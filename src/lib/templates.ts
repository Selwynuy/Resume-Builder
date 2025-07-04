export interface Template {
  id: string
  name: string
  description: string
  preview?: string
  category?: string
  colors?: {
    primary: string
    secondary: string
    text: string
    accent: string
  }
  // Community template specific fields
  htmlTemplate?: string
  cssStyles?: string
  creator?: string
  downloads?: number
  rating?: number
  isApproved?: boolean
}

// Remove built-in templates - now using only community templates
export const templates: Template[] = []

export const getTemplate = (id: string): Template | null => {
  // For backward compatibility, return null for built-in template IDs
  // The calling code should handle fetching community templates via API
  console.warn(`getTemplate(${id}) called - built-in templates removed, use community templates`)
  return null
}

// Default fallback template structure for error cases
export const getDefaultTemplate = (): Template => {
  return {
    id: 'default',
    name: 'Default Template',
    description: 'Basic template structure',
    htmlTemplate: `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>{{personalInfo.name}}</h1>
        <p>{{personalInfo.email}} | {{personalInfo.phone}}</p>
        <p>{{personalInfo.location}}</p>
        
        <h2>Summary</h2>
        <p>{{personalInfo.summary}}</p>
        
        <h2>Experience</h2>
        {{#each experiences}}
        <div style="margin-bottom: 15px;">
          <h3>{{position}} at {{company}}</h3>
          <p>{{startDate}} - {{endDate}}</p>
          <p>{{description}}</p>
        </div>
        {{/each}}
        
        <h2>Education</h2>
        {{#each education}}
        <div style="margin-bottom: 10px;">
          <h3>{{degree}} {{#if field}}in {{field}}{{/if}}</h3>
          <p>{{school}} - {{graduationDate}}</p>
        </div>
        {{/each}}
        
        <h2>Skills</h2>
        {{#each skills}}
        <span style="margin-right: 15px;">
          {{name}}
          {{#if years}} ({{years}} years){{/if}}
          {{#if certification}} ({{certification}}){{/if}}
          {{#if level}} ({{level}}){{/if}}
          {{#if context}} - {{context}}{{/if}}
        </span>
        {{/each}}
      </div>
    `,
    cssStyles: `
      body { font-family: Arial, sans-serif; }
      h1 { color: #2563eb; margin-bottom: 5px; }
      h2 { color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
      h3 { color: #374151; margin-bottom: 3px; }
    `
  }
} 