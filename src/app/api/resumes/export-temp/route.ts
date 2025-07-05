import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { renderTemplate } from '@/lib/template-renderer'
import { getTemplate } from '@/lib/templates'
import connectDB from '@/lib/db'
import Template from '@/models/Template'
import puppeteer from 'puppeteer'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { personalInfo, experiences, education, skills, template, isCustomTemplate, sectionOrder } = data

    let htmlContent = ''

    if (isCustomTemplate) {
      // Handle custom templates
      await connectDB()
      const customTemplate = await Template.findById(template)
      
      if (!customTemplate) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }

      const resumeData = { personalInfo, experiences, education, skills }
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              @page { 
                margin: 0.5in; 
                size: A4;
              }
              body { 
                margin: 0; 
                font-family: Arial, sans-serif;
              }
              ${customTemplate.cssStyles}
            </style>
          </head>
          <body>
            ${renderTemplate(customTemplate.htmlTemplate, customTemplate.cssStyles || '', resumeData, false)}
          </body>
        </html>
      `
    } else {
      // Handle built-in templates - generate HTML that matches the preview
      const templateData = getTemplate(template)
      const orderedSections = sectionOrder || ['experience', 'education', 'skills']

      const renderSection = (sectionType: string) => {
        switch (sectionType) {
          case 'experience':
            return experiences.some((exp: any) => exp.company || exp.position) ? `
              <div class="section">
                <h3 class="section-title">${templateData.id === 'creative' ? '✦ Experience' : 'Experience'}</h3>
                ${experiences.map((exp: any) => (exp.company || exp.position) ? `
                  <div class="item">
                    <div class="item-header">
                      <div>
                        <h4 class="position">${exp.position}</h4>
                        <p class="company">${exp.company}</p>
                      </div>
                      ${(exp.startDate || exp.endDate) ? `<p class="dates">${exp.startDate} - ${exp.endDate}</p>` : ''}
                    </div>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                  </div>
                ` : '').join('')}
              </div>
            ` : ''

          case 'education':
            return education.some((edu: any) => edu.school || edu.degree) ? `
              <div class="section">
                <h3 class="section-title">${templateData.id === 'creative' ? '✦ Education' : 'Education'}</h3>
                ${education.map((edu: any) => (edu.school || edu.degree) ? `
                  <div class="item">
                    <div class="item-header">
                      <div>
                        <h4 class="position">${edu.degree} ${edu.field ? `in ${edu.field}` : ''}</h4>
                        <p class="company">${edu.school}</p>
                        ${edu.gpa ? `<p class="dates">GPA: ${edu.gpa}</p>` : ''}
                      </div>
                      ${edu.graduationDate ? `<p class="dates">${edu.graduationDate}</p>` : ''}
                    </div>
                  </div>
                ` : '').join('')}
              </div>
            ` : ''

          case 'skills':
            return skills.some((skill: any) => skill.name) ? `
              <div class="section">
                <h3 class="section-title">${templateData.id === 'creative' ? '✦ Skills' : 'Skills'}</h3>
                <div class="skills-grid">
                  ${skills.map((skill: any) => skill.name ? `
                    <div class="skill-item">
                      <span class="skill-name">${skill.name}</span>
                      <span class="skill-level">(${skill.level})</span>
                    </div>
                  ` : '').join('')}
                </div>
              </div>
            ` : ''

          default:
            return ''
        }
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              @page { 
                margin: 0.5in; 
                size: A4;
              }
              body { 
                margin: 0; 
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: ${templateData.colors.text};
              }
              .header {
                ${templateData.id === 'creative' ? `background-color: ${templateData.colors.primary}; color: white; padding: 15px; margin: -0.5in -0.5in 20px -0.5in;` : ''}
                ${templateData.id === 'minimal' ? `border-left: 4px solid ${templateData.colors.primary}; padding-left: 15px;` : ''}
                ${templateData.id !== 'creative' && templateData.id !== 'minimal' ? `border-bottom: 1px solid ${templateData.colors.accent}; padding-bottom: 10px;` : ''}
                margin-bottom: 20px;
              }
              .name {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
                color: ${templateData.id === 'creative' ? 'white' : templateData.colors.primary};
                ${templateData.id === 'modern' ? 'text-align: center;' : ''}
              }
              .contact-info {
                font-size: 14px;
                color: ${templateData.id === 'creative' ? 'white' : templateData.colors.secondary};
                margin-bottom: 2px;
                ${templateData.id === 'modern' ? 'text-align: center;' : ''}
              }
              .section {
                margin-bottom: 20px;
              }
              .section-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                color: ${templateData.colors.primary};
                ${templateData.id === 'classic' ? `border-bottom: 1px solid ${templateData.colors.accent}; padding-bottom: 2px;` : ''}
                ${templateData.id === 'modern' ? `background-color: ${templateData.colors.primary}; color: white; padding: 5px 10px; margin-left: -10px; margin-right: -10px;` : ''}
              }
              .summary {
                font-size: 14px;
                line-height: 1.4;
                margin-bottom: 15px;
                ${templateData.id === 'creative' ? 'font-style: italic;' : ''}
                ${templateData.id === 'minimal' ? `background-color: #f0f0f0; padding: 10px; border-left: 3px solid ${templateData.colors.primary}; padding-left: 15px;` : ''}
              }
              .item {
                margin-bottom: 15px;
              }
              .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 5px;
              }
              .position {
                font-size: 16px;
                font-weight: bold;
                margin: 0 0 2px 0;
                color: ${templateData.colors.primary};
              }
              .company {
                font-size: 14px;
                margin: 0 0 2px 0;
                color: ${templateData.colors.secondary};
                ${templateData.id === 'creative' ? 'font-style: italic;' : ''}
              }
              .dates {
                font-size: 12px;
                color: ${templateData.colors.secondary};
                margin: 0;
              }
              .description {
                font-size: 12px;
                line-height: 1.4;
                margin: 5px 0 0 0;
              }
              .skills-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 5px;
              }
              .skill-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
              }
              .skill-name {
                color: ${templateData.colors.text};
              }
              .skill-level {
                color: ${templateData.colors.secondary};
                font-size: 11px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="name">${personalInfo.name}</h1>
              ${personalInfo.email ? `<p class="contact-info">${personalInfo.email}</p>` : ''}
              ${personalInfo.phone ? `<p class="contact-info">${personalInfo.phone}</p>` : ''}
              ${personalInfo.location ? `<p class="contact-info">${personalInfo.location}</p>` : ''}
            </div>
            
            ${personalInfo.summary ? `
              <div class="section">
                <h3 class="section-title">${templateData.id === 'creative' ? '✦ Professional Summary' : 'Professional Summary'}</h3>
                <p class="summary">${personalInfo.summary}</p>
              </div>
            ` : ''}
            
            ${orderedSections.map((sectionType: string) => renderSection(sectionType)).join('')}
          </body>
        </html>
      `
    }

    try {
      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true
      })
      
      await browser.close()

      // Return PDF as download
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${personalInfo.name || 'resume'}.pdf"`,
        },
      })
    } catch (error: any) {
      console.error('Puppeteer PDF generation error:', error)
      return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
    }
    
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Error generating export' }, { status: 500 })
  }
} 