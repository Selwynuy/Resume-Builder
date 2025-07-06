import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import puppeteer from 'puppeteer'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import { renderTemplate } from '@/lib/template-renderer'
import Resume from '@/models/Resume'
import Template from '@/models/Template'

interface ExportData {
  title?: string
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experiences: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    graduationDate: string
    gpa?: string
  }>
  skills: Array<{
    name: string
    level: string
  }>
  template?: string
  customTemplate?: {
    htmlTemplate: string
    cssStyles: string
  }
}

async function generatePDF(params: { id: string }) {
  const session = await getServerSession(authOptions) as { user?: { id?: string } } | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 })
  }
  await connectDB()
  const resume = await Resume.findById(params.id).lean() as ExportData | null
  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }
  let customTemplate = null
  if (resume.template && mongoose.Types.ObjectId.isValid(resume.template)) {
    try {
      customTemplate = await Template.findById(resume.template).lean() as { htmlTemplate: string; cssStyles: string } | null
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
    experiences: resume.experiences.map((exp: { company?: string; position?: string; startDate?: string; endDate?: string; description?: string }) => ({
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || ''
    })),
    education: resume.education.map((edu: { school?: string; degree?: string; field?: string; graduationDate?: string; gpa?: string }) => ({
      school: edu.school || '',
      degree: edu.degree || '',
      field: edu.field || '',
      graduationDate: edu.graduationDate || '',
      gpa: edu.gpa || ''
    })),
    skills: resume.skills.map((skill: { name?: string; level?: string }) => ({
      name: skill.name || '',
      level: skill.level || 'Intermediate'
    })),
    template: resume.template || '',
    customTemplate: customTemplate
  }
  // Render HTML
  const { html, css } = renderTemplate(
    customTemplate.htmlTemplate,
    customTemplate.cssStyles,
    resumeData,
    false
  )
  const renderedHtml = html

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
          
          ${css || ''}
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
  } catch (error: unknown) {
    console.error('PDF generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown PDF generation error'
    return NextResponse.json({ error: `Failed to generate PDF: ${errorMessage}` }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return await generatePDF(params)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return await generatePDF(params)
} 