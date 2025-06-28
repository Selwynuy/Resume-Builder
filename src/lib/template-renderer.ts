import Handlebars from 'handlebars'
import { sanitizeHtml, sanitizeTemplateContent, sanitizeCss } from './security'

export interface TemplateData {
  htmlTemplate: string
  cssStyles: string
  placeholders: string[]
  layout: string
}

export interface ResumeData {
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
}

/**
 * Register Handlebars helpers for template rendering
 */
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('formatDate', (date: string) => {
    if (!date) return 'Present'
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  })

  Handlebars.registerHelper('capitalize', (text: string) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
  })

  Handlebars.registerHelper('eq', (a: any, b: any) => a === b)
  
  Handlebars.registerHelper('gt', (a: number, b: number) => a > b)
}

/**
 * Render HTML template with resume data
 */
export function renderTemplate(htmlTemplate: string, cssStyles: string, resumeData: ResumeData, forPreview: boolean = true): { html: string, css: string } {
  try {
    registerHandlebarsHelpers()
    
    // Sanitize template content before compilation
    const sanitizedTemplate = sanitizeTemplateContent(htmlTemplate, forPreview)
    const template = Handlebars.compile(sanitizedTemplate)
    const renderedHtml = template(resumeData)
    
    // Sanitize and convert print units to pixels for preview
    const sanitizedCss = sanitizeCss(cssStyles)
    const processedCss = forPreview ? sanitizedCss.replace(/(\d+(?:\.\d+)?)in/g, (match, num) => {
      return `${Math.round(parseFloat(num) * 72)}px` // Convert inches to pixels (72 DPI)
    }).replace(/(\d+(?:\.\d+)?)pt/g, (match, num) => {
      return `${Math.round(parseFloat(num) * 1.333)}px` // Convert points to pixels (1pt = 1.333px)
    }) : sanitizedCss

    // Add preview-specific adjustments
    const previewDefaults = forPreview ? `
      /* A4 Preview container adjustments - only target the actual document, not our wrapper */
      .resume-document {
        width: 210mm !important; /* A4 width */
        height: 297mm !important; /* A4 height */
        margin: 0 !important;
        padding: 20mm !important; /* Standard A4 margins */
        box-sizing: border-box !important;
        background: white !important;
        overflow: hidden !important;
        font-size: 12px !important; /* Standard document font size */
        line-height: 1.4 !important;
      }
      
      /* Remove any conflicting transforms from templates */
      .resume-template {
        transform: none !important;
        width: 100% !important;
        height: 100% !important;
      }
      
      /* Ensure content fits within A4 */
      .content-wrapper, .main-content {
        height: 100% !important;
        overflow: hidden !important;
      }
      
      /* Responsive adjustments for A4 */
      .section {
        margin-bottom: 15px !important;
      }
      
      .header, .contact-info {
        margin-bottom: 20px !important;
      }
    ` : ''
    
    // Return HTML and CSS separately
    return {
      html: renderedHtml,
      css: `${previewDefaults}\n${processedCss}`
    }
  } catch (error) {
    throw new Error(`Failed to render template: ${error}`)
  }
}

/**
 * Extract placeholders from HTML template
 */
export function extractPlaceholders(htmlTemplate: string): string[] {
  const placeholderRegex = /\{\{[^}]+\}\}/g
  const matches = htmlTemplate.match(placeholderRegex) || []
  return Array.from(new Set(matches))
}

/**
 * Validate template structure
 */
export function validateTemplate(htmlTemplate: string, cssStyles: string): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic HTML validation
  if (!htmlTemplate.trim()) {
    errors.push('HTML template cannot be empty')
  }

  // Check for required placeholders
  const requiredPlaceholders = ['{{personalInfo.name}}', '{{personalInfo.email}}']
  const placeholders = extractPlaceholders(htmlTemplate)
  
  requiredPlaceholders.forEach(required => {
    if (!placeholders.includes(required)) {
      warnings.push(`Missing recommended placeholder: ${required}`)
    }
  })

  // Check for basic HTML structure
  if (!htmlTemplate.includes('{{personalInfo.name}}')) {
    warnings.push('Template should include name placeholder for better user experience')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get sample data for template preview
 */
export function getSampleResumeData(): ResumeData {
  return {
    personalInfo: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      summary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.'
    },
    experiences: [
      {
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        startDate: '2021-03',
        endDate: '2024-01',
        description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and improved system performance by 40%.'
      },
      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        startDate: '2019-06',
        endDate: '2021-02',
        description: 'Built responsive web applications using React and Node.js. Collaborated with design team to implement user-friendly interfaces.'
      }
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2019',
        gpa: '3.8'
      }
    ],
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'AWS', level: 'Advanced' }
    ]
  }
}

/**
 * Get built-in template examples
 */
export function getBuiltInTemplates() {
  return [
    {
      id: 'modern-web',
      name: 'Modern Web',
      description: 'Responsive web-first design with modern typography and colors',
      layout: 'single-column',
      htmlTemplate: `
        <div class="resume-container">
          <header class="header">
            <h1 class="name">{{personalInfo.name}}</h1>
            <div class="contact-info">
              <span class="contact-item">{{personalInfo.email}}</span>
              <span class="contact-item">{{personalInfo.phone}}</span>
              <span class="contact-item">{{personalInfo.location}}</span>
            </div>
            {{#if personalInfo.summary}}
            <div class="summary">{{personalInfo.summary}}</div>
            {{/if}}
          </header>

          {{#if experiences}}
          <section class="section">
            <h2 class="section-title">Experience</h2>
            {{#each experiences}}
            <div class="experience-item">
              <div class="item-header">
                <div class="title-company">
                  <h3 class="position">{{position}}</h3>
                  <p class="company">{{company}}</p>
                </div>
                <span class="dates">{{startDate}} - {{endDate}}</span>
              </div>
              {{#if description}}
              <p class="description">{{description}}</p>
              {{/if}}
            </div>
            {{/each}}
          </section>
          {{/if}}

          {{#if education}}
          <section class="section">
            <h2 class="section-title">Education</h2>
            {{#each education}}
            <div class="education-item">
              <div class="item-header">
                <div class="title-company">
                  <h3 class="degree">{{degree}}{{#if field}} in {{field}}{{/if}}</h3>
                  <p class="school">{{school}}</p>
                </div>
                <span class="dates">{{graduationDate}}</span>
              </div>
              {{#if gpa}}
              <p class="gpa">GPA: {{gpa}}</p>
              {{/if}}
            </div>
            {{/each}}
          </section>
          {{/if}}

          {{#if skills}}
          <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-container">
              {{#each skills}}
              <div class="skill-badge">
                <span class="skill-name">{{name}}</span>
                <span class="skill-level">{{level}}</span>
              </div>
              {{/each}}
            </div>
          </section>
          {{/if}}
        </div>
      `,
      cssStyles: `
        .resume-template {
          font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        .resume-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 3rem 2rem;
          position: relative;
        }

        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .header > * {
          position: relative;
          z-index: 1;
        }

        .name {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.5px;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .summary {
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.95;
          font-weight: 300;
          line-height: 1.7;
        }

        .section {
          padding: 2.5rem 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 1.5rem;
          position: relative;
          padding-left: 1.5rem;
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 2px;
        }

        .experience-item, .education-item {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .experience-item:hover, .education-item:hover {
          border-left-color: #667eea;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .title-company {
          flex: 1;
        }

        .position, .degree {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .company, .school {
          font-size: 1.1rem;
          color: #667eea;
          font-weight: 500;
          margin: 0;
        }

        .dates {
          font-size: 0.95rem;
          color: #6b7280;
          background: #e5e7eb;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          white-space: nowrap;
          font-weight: 500;
        }

        .description {
          color: #4b5563;
          margin: 0;
          line-height: 1.7;
        }

        .gpa {
          color: #059669;
          font-weight: 600;
          margin: 0.5rem 0 0 0;
          font-size: 0.95rem;
        }

        .skills-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .skill-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 25px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }

        .skill-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .skill-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .skill-level {
          font-size: 0.9rem;
          opacity: 0.9;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .resume-template {
            padding: 1rem 0.5rem;
          }

          .name {
            font-size: 2.2rem;
          }

          .contact-info {
            flex-direction: column;
            gap: 0.75rem;
          }

          .item-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dates {
            margin-top: 0.5rem;
          }

          .section {
            padding: 2rem 1.5rem;
          }

          .skills-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .name {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .position, .degree {
            font-size: 1.1rem;
          }
        }
      `
    },
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      description: 'Clean, modern design with subtle styling',
      layout: 'single-column',
      htmlTemplate: `
        <div class="header">
          <h1 class="name">{{personalInfo.name}}</h1>
          <div class="contact">
            {{personalInfo.email}} • {{personalInfo.phone}} • {{personalInfo.location}}
          </div>
          {{#if personalInfo.summary}}
          <div class="summary">{{personalInfo.summary}}</div>
          {{/if}}
        </div>

        {{#if experiences}}
        <section class="section">
          <h2 class="section-title">Experience</h2>
          {{#each experiences}}
          <div class="experience-item">
            <div class="experience-header">
              <h3 class="position">{{position}}</h3>
              <span class="company">{{company}}</span>
              <span class="dates">{{startDate}} - {{endDate}}</span>
            </div>
            {{#if description}}
            <p class="description">{{description}}</p>
            {{/if}}
          </div>
          {{/each}}
        </section>
        {{/if}}

        {{#if education}}
        <section class="section">
          <h2 class="section-title">Education</h2>
          {{#each education}}
          <div class="education-item">
            <h3 class="degree">{{degree}} in {{field}}</h3>
            <span class="school">{{school}}</span>
            <span class="graduation">{{graduationDate}}</span>
          </div>
          {{/each}}
        </section>
        {{/if}}

        {{#if skills}}
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            {{#each skills}}
            <div class="skill-item">
              <span class="skill-name">{{name}}</span>
              <span class="skill-level">{{level}}</span>
            </div>
            {{/each}}
          </div>
        </section>
        {{/if}}
      `,
      cssStyles: `
        .resume-template {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #374151;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 1.5rem;
        }

        .name {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .contact {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .summary {
          font-size: 1.1rem;
          color: #4b5563;
          font-style: italic;
          max-width: 600px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
        }

        .experience-item, .education-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .experience-item:last-child, .education-item:last-child {
          border-bottom: none;
        }

        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.5rem;
        }

        .position, .degree {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .company, .school {
          font-weight: 500;
          color: #3b82f6;
        }

        .dates, .graduation {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .description {
          margin: 0.5rem 0 0 0;
          color: #4b5563;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5rem;
        }

        .skill-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .skill-name {
          font-weight: 500;
        }

        .skill-level {
          font-size: 0.9rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .experience-header {
            flex-direction: column;
            align-items: start;
          }
          
          .dates {
            margin-top: 0.25rem;
          }
        }
      `
    }
  ]
} 