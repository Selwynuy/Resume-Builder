import Handlebars from 'handlebars'

import { sanitizeTemplateContent, sanitizeCss } from '@/lib/security'

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
    level?: string
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

  Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)
  
  Handlebars.registerHelper('gt', (a: number, b: number) => a > b)

  // Skill formatting helper
  Handlebars.registerHelper('formatSkill', function(skill: { name?: string; format?: string; level?: string; years?: string; certification?: string; context?: string }) {
    if (!skill) return '';
    if (skill.format === 'level') return `${skill.name} (${skill.level})`;
    if (skill.format === 'years') return `${skill.name} (${skill.years} yrs)`;
    if (skill.format === 'certification') return `${skill.name} (${skill.certification})`;
    if (skill.format === 'context') return `${skill.name} - ${skill.context}`;
    return skill.name;
  });
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
      /* US Letter Preview container adjustments - only target the actual document, not our wrapper */
      .resume-document {
        width: 8.5in; 
        height: 11in;
        margin: 0;
        box-sizing: border-box;
        background: white;
        overflow: hidden;
        font-size: 12px;
        line-height: 1.4;
      }
      
      /* Remove any conflicting transforms from templates */
      .resume-template {
        transform: none;
        width: 100%;
        height: 100%;
      }
      
      /* Ensure content fits within Letter */
      .content-wrapper, .main-content {
        height: 100%;
        overflow: hidden;
      }
      
      /* Responsive adjustments for Letter */
      .section {
        margin-bottom: 15px;
      }
      
      .header, .contact-info {
        margin-bottom: 20px;
      }
    ` : ''
    
    // Return HTML and CSS separately
    return {
      html: renderedHtml,
      css: `${previewDefaults}\n${processedCss}`
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown template rendering error'
    throw new Error(`Failed to render template: ${errorMessage}`)
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
export function validateTemplate(htmlTemplate: string, _cssStyles: string): {
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

