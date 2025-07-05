import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { renderToBuffer } from '@react-pdf/renderer'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'
import Template from '@/models/Template'
import { ResumePDF } from '@/lib/pdf-generator'
import { renderTemplate } from '@/lib/template-renderer'
import mongoose from 'mongoose'

async function generatePDF(params: { id: string }) {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid resume ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const resume = await Resume.findOne({
      _id: params.id,
      userId: session.user.id
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

  // Fetch community template data
  let customTemplate = null
  if (resume.template) {
    // Check if the template ID is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(resume.template)) {
      try {
        customTemplate = await Template.findById(resume.template)
        if (customTemplate) {
          // Increment downloads count for the custom template
          await Template.findByIdAndUpdate(resume.template, { $inc: { downloads: 1 } })
        }
      } catch (error) {
        console.error('Error fetching custom template:', error)
      }
    }
  }

  // Transform resume data to match expected format
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

  // All templates are now community templates - generate HTML for PDF printing
  try {
    // Check if we have a valid template
    if (!customTemplate || !customTemplate.htmlTemplate) {
      return NextResponse.json(
        { error: 'Template not found or invalid' },
        { status: 400 }
      )
    }

    // Use the same renderTemplate function used everywhere else
    const htmlContent = renderTemplate(
      customTemplate.htmlTemplate, 
      customTemplate.cssStyles || '', 
      resumeData, 
      false
    )

    // Return a complete HTML document optimized for PDF printing
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resume.title || 'Resume'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
              /* Force A4 dimensions */
              width: 210mm;
              height: 297mm;
            }
            
            @media print {
              @page {
                size: A4 portrait !important;
                margin: 0 !important;
                width: 210mm !important;
                height: 297mm !important;
                /* Remove browser headers and footers */
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              /* Hide browser chrome elements */
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Remove any default browser margins */
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden;
              }
              
              /* Hide any scrollbars or browser UI */
              ::-webkit-scrollbar {
                display: none;
              }
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.4;
              color: #333;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Template-specific CSS */
            ${customTemplate?.cssStyles || ''}
            
            /* PDF-specific overrides */
            .resume-template {
              width: 100%;
              max-width: none;
              margin: 0;
              padding: 0;
              background: white !important;
            }
            
            /* Ensure colors are preserved in PDF */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Page break controls */
            .page-break {
              page-break-before: always;
            }
            
            .no-break {
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <div class="resume-template">
            ${htmlContent}
          </div>
        </body>
      </html>
    `

    return new NextResponse(fullHtml, {
      headers: {
        'Content-Type': 'text/html',
        'X-PDF-Template': 'community',
        'X-Resume-Title': resume.title || 'resume'
      },
    })
  } catch (error) {
    console.error('Error generating community template HTML:', error)
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to generate PDF - no template available' },
      { status: 400 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    return await generatePDF(params)
  } catch (error: any) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    return await generatePDF(params)
  } catch (error: any) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
} 