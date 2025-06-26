import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Template, getTemplate } from './templates'
import { renderTemplate } from './template-renderer'
import { renderToStaticMarkup } from 'react-dom/server'

const createStyles = (template: Template) => StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    color: template.colors.text,
  },
  header: {
    borderBottom: template.id === 'minimal' ? 0 : 1,
    borderBottomColor: template.colors.accent,
    paddingBottom: template.id === 'minimal' ? 0 : 10,
    backgroundColor: template.id === 'creative' ? template.colors.primary : 'transparent',
    padding: template.id === 'creative' ? 15 : 0,
    margin: template.id === 'creative' ? -60 : 0,
    marginBottom: template.id === 'creative' ? 20 : 20,
    marginTop: template.id === 'creative' ? -50 : 0,
  },
  name: {
    fontSize: template.id === 'creative' ? 28 : 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    color: template.id === 'creative' ? '#ffffff' : template.colors.primary,
    textAlign: template.id === 'modern' ? 'center' : 'left',
  },
  contactInfo: {
    fontSize: 10,
    color: template.id === 'creative' ? '#ffffff' : template.colors.secondary,
    marginBottom: 2,
    textAlign: template.id === 'modern' ? 'center' : 'left',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    borderBottom: template.id === 'classic' ? 1 : 0,
    borderBottomColor: template.colors.accent,
    paddingBottom: template.id === 'classic' ? 2 : 0,
    backgroundColor: template.id === 'modern' ? template.colors.primary : 'transparent',
    color: template.id === 'modern' ? '#ffffff' : template.colors.primary,
    padding: template.id === 'modern' ? '5 10' : 0,
    marginLeft: template.id === 'modern' ? -10 : 0,
    marginRight: template.id === 'modern' ? -10 : 0,
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    color: template.colors.primary,
  },
  company: {
    fontSize: 11,
    marginBottom: 2,
    fontFamily: template.id === 'creative' ? 'Helvetica-Oblique' : 'Helvetica',
  },
  dates: {
    fontSize: 10,
    color: template.colors.secondary,
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: template.id === 'modern' ? 5 : 10,
  },
  skill: {
    fontSize: 10,
    marginBottom: 3,
    backgroundColor: template.id === 'modern' ? template.colors.accent : 'transparent',
    color: template.id === 'modern' ? '#ffffff' : template.colors.text,
    padding: template.id === 'modern' ? '3 8' : 0,
    borderRadius: template.id === 'modern' ? 10 : 0,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 15,
    fontFamily: template.id === 'creative' ? 'Helvetica-Oblique' : 'Helvetica',
    backgroundColor: template.id === 'minimal' ? '#f9f9f9' : 'transparent',
    padding: template.id === 'minimal' ? 10 : 0,
    borderLeft: template.id === 'minimal' ? `3 solid ${template.colors.primary}` : 0,
    paddingLeft: template.id === 'minimal' ? 15 : 0,
  },
  modernSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: template.colors.primary,
  },
  customTemplate: {
    fontSize: 10,
    lineHeight: 1.3,
    color: '#333333',
  }
})

interface ResumeData {
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
  sectionOrder?: string[]
  customTemplate?: any
}

// Custom template renderer for PDF - Unified styling for all community templates
const CustomTemplatePDF = ({ data }: { data: ResumeData }) => {
  // Extract primary color from template CSS, fallback to blue
  const getPrimaryColor = () => {
    if (!data.customTemplate?.cssStyles) return '#3b82f6'
    
    const css = data.customTemplate.cssStyles
    // Look for the first hex color in the CSS (usually the primary color)
    const colorMatch = css.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/)
    return colorMatch?.[0] || '#3b82f6'
  }

  const primaryColor = getPrimaryColor()

  // Unified styles for all community templates
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 20,
      color: '#374151',
    },
    header: {
      textAlign: 'center',
      marginBottom: 32,
      borderBottom: 2,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 24,
    },
    name: {
      fontSize: 28,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 8,
      color: '#1f2937',
    },
    contactLine: {
      fontSize: 12,
      color: '#6b7280',
      marginBottom: 16,
    },
    summary: {
      fontSize: 13,
      color: '#4b5563',
      fontFamily: 'Helvetica-Oblique',
      lineHeight: 1.4,
      marginTop: 12,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Helvetica-Bold',
      color: primaryColor,
      marginBottom: 12,
      borderLeft: 4,
      borderLeftColor: primaryColor,
      paddingLeft: 16,
    },
    experienceItem: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: 1,
      borderBottomColor: '#f3f4f6',
    },
    position: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    company: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: primaryColor,
      marginBottom: 4,
    },
    dates: {
      fontSize: 10,
      color: '#6b7280',
      marginBottom: 6,
    },
    description: {
      fontSize: 11,
      lineHeight: 1.4,
      color: '#4b5563',
      marginTop: 6,
    },
    educationItem: {
      marginBottom: 14,
      paddingBottom: 12,
      borderBottom: 1,
      borderBottomColor: '#f3f4f6',
    },
    degree: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    school: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: primaryColor,
      marginBottom: 4,
    },
    graduation: {
      fontSize: 10,
      color: '#6b7280',
    },
    skillsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
      backgroundColor: '#f9fafb',
      borderRadius: 6,
      marginBottom: 6,
      minWidth: 160,
    },
    skillName: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#374151',
    },
    skillLevel: {
      fontSize: 9,
      color: '#6b7280',
    },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Dynamic Header Layout */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name}</Text>
          <Text style={styles.contactLine}>
            {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location]
              .filter(Boolean)
              .join(' • ')}
          </Text>
          {data.personalInfo.summary && (
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          )}
        </View>

        {/* Experience */}
        {data.experiences.length > 0 && data.experiences.some(exp => exp.company || exp.position) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp, index) => (
              (exp.company || exp.position) && (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.position}>{exp.position}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
                  {(exp.startDate || exp.endDate) && (
                    <Text style={styles.dates}>{exp.startDate} - {exp.endDate}</Text>
                  )}
                  {exp.description && <Text style={styles.description}>{exp.description}</Text>}
                </View>
              )
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && data.education.some(edu => edu.school || edu.degree) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              (edu.school || edu.degree) && (
                <View key={index} style={styles.educationItem}>
                  <Text style={styles.degree}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </Text>
                  <Text style={styles.school}>{edu.school}</Text>
                  <Text style={styles.graduation}>{edu.graduationDate}</Text>
                  {edu.gpa && <Text style={styles.graduation}>GPA: {edu.gpa}</Text>}
                </View>
              )
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && data.skills.some(skill => skill.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsGrid}>
              {data.skills.map((skill, index) => (
                skill.name && (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillLevel}>{skill.level}</Text>
                  </View>
                )
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  console.log('🔍 PDF Generator - Template:', data.template)
  console.log('🔍 PDF Generator - Has custom template?', !!data.customTemplate)
  console.log('🔍 PDF Generator - Custom template name:', data.customTemplate?.name)
  
  // If it's a custom template, use the simplified PDF version
  if (data.customTemplate) {
    console.log('🔍 PDF Generator - Using CustomTemplatePDF')
    return <CustomTemplatePDF data={data} />
  }

  console.log('🔍 PDF Generator - Using built-in template:', data.template)

  // Otherwise use the original built-in template logic
  const template = getTemplate(data.template || 'classic')
  const styles = createStyles(template)
  const sectionOrder = data.sectionOrder || ['experience', 'education', 'skills']

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case 'experience':
        return data.experiences.length > 0 && data.experiences.some(exp => exp.company || exp.position) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {template.id === 'creative' ? '✦ Experience' : 'Experience'}
            </Text>
            {data.experiences.map((exp, index) => (
              (exp.company || exp.position) && (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
                  {(exp.startDate || exp.endDate) && (
                    <Text style={styles.dates}>{exp.startDate} - {exp.endDate}</Text>
                  )}
                  {exp.description && <Text style={styles.description}>{exp.description}</Text>}
                </View>
              )
            ))}
          </View>
        )

      case 'education':
        return data.education.length > 0 && data.education.some(edu => edu.school || edu.degree) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {template.id === 'creative' ? '✦ Education' : 'Education'}
            </Text>
            {data.education.map((edu, index) => (
              (edu.school || edu.degree) && (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={styles.jobTitle}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </Text>
                  <Text style={styles.company}>{edu.school}</Text>
                  <Text style={styles.dates}>{edu.graduationDate}</Text>
                  {edu.gpa && <Text style={styles.dates}>GPA: {edu.gpa}</Text>}
                </View>
              )
            ))}
          </View>
        )

      case 'skills':
        return data.skills.length > 0 && data.skills.some(skill => skill.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {template.id === 'creative' ? '✦ Skills' : 'Skills'}
            </Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, index) => (
                skill.name && (
                  <Text key={index} style={styles.skill}>
                    {template.id === 'modern' ? skill.name : `${skill.name} (${skill.level})`}
                  </Text>
                )
              ))}
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Modern template sidebar */}
        {template.id === 'modern' && <View style={styles.modernSidebar} />}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name}</Text>
          {data.personalInfo.email && <Text style={styles.contactInfo}>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text style={styles.contactInfo}>{data.personalInfo.phone}</Text>}
          {data.personalInfo.location && <Text style={styles.contactInfo}>{data.personalInfo.location}</Text>}
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {template.id === 'creative' ? '✦ Professional Summary' : 'Professional Summary'}
            </Text>
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Dynamic sections in custom order */}
        {sectionOrder.map((sectionType) => (
          <View key={sectionType}>
            {renderSection(sectionType)}
          </View>
        ))}
      </Page>
    </Document>
  )
} 