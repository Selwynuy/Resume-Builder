import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'
import Template from '@/models/Template'
import { renderTemplate } from '@/lib/template-renderer'
import mongoose from 'mongoose'
import puppeteer from 'puppeteer'

async function generatePDF(params: { id: string }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 })
  }
  await connectDB()
  const resume = await Resume.findOne({ _id: params.id, userId: session.user.id })
  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }
  let customTemplate = null
  if (resume.template && mongoose.Types.ObjectId.isValid(resume.template)) {
    try {
      customTemplate = await Template.findById(resume.template)
      if (customTemplate) {
        await Template.findByIdAndUpdate(resume.template, { $inc: { downloads: 1 } })
      }
    } catch (error) {
      console.error('Error fetching custom template:', error)
    }
  }
  if (!customTemplate || !customTemplate.htmlTemplate) {
    return NextResponse.json({ error: 'Template not found or invalid' }, { status: 400 })
  }
  // Prepare resume data
  const resumeData = {
    personalInfo: {
      name: resume.personalInfo.name || '',
      email: resume.personalInfo.email || '',
      phone: resume.personalInfo.phone || '',
      location: resume.personalInfo.location || '',
      summary: resume.personalInfo.summary || ''
    },
    experiences: resume.experiences.map((exp: any) => ({
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || ''
    })),
    education: resume.education.map((edu: any) => ({
      school: edu.school || '',
      degree: edu.degree || '',
      field: edu.field || '',
      graduationDate: edu.graduationDate || '',
      gpa: edu.gpa || ''
    })),
    skills: resume.skills.map((skill: any) => ({
      name: skill.name || '',
      level: skill.level || 'Intermediate'
    })),
    template: resume.template || '',
    customTemplate: customTemplate
  }
  // Render HTML
  const renderResult = renderTemplate(
    customTemplate.htmlTemplate,
    customTemplate.cssStyles || '',
    resumeData,
    false
  )
  const renderedHtml = typeof renderResult === 'string' ? renderResult : renderResult.html

  // Compose full HTML document with CSS in <style>
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${resume.title || 'Resume'}</title>
        <style>
          /* Reset all margins and padding */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          
          /* Ensure the resume takes full page */
          .resume-template, .resume-document {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          
          ${customTemplate.cssStyles || ''}
        </style>
      </head>
      <body>
        ${renderedHtml}
      </body>
    </html>
  `

  // Generate PDF with Puppeteer
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
      width: '8.5in',
      height: '11in',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    })
    await browser.close()
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title || 'resume'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('PDF generation error:', error)
    const errorMessage = error.message || error.toString() || 'Unknown PDF generation error'
    return NextResponse.json({ error: `Failed to generate PDF: ${errorMessage}` }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return await generatePDF(params)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return await generatePDF(params)
} 