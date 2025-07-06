/* eslint-disable react/prop-types */
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

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
  customTemplate?: {
    cssStyles?: string
  }
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

  function _PDFSkillDisplay({ skill }: { skill: { name: string; years?: string; certification?: string; level?: string; context?: string } }) {
    if (!skill.name) return null;
    let text = skill.name;
    if (skill.years) text += ` (${skill.years} years)`;
    if (skill.certification) text += ` (${skill.certification})`;
    if (skill.level) text += ` (${skill.level})`;
    if (skill.context) text += ` - ${skill.context}`;
    return <Text>{text}</Text>;
  }

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

// Default styles for basic PDF structure
const defaultStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    borderBottom: 1,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
    marginBottom: 20
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5
  },
  contactInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 2
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3
  },
  company: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2
  },
  dates: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 5
  },
  description: {
    fontSize: 11,
    lineHeight: 1.4,
    marginTop: 5
  },
  summary: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#374151'
  },
  educationItem: {
    marginBottom: 8
  },
  degree: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3
  },
  school: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2
  },
  graduation: {
    fontSize: 11,
    color: '#9ca3af'
  },
  skillsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  skillItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11
  },
  skillName: {
    color: '#374151'
  },
  skillLevel: {
    color: '#6b7280',
    fontSize: 10
  }
})

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  // If it's a custom template, use the simplified PDF version
  if (data.customTemplate) {
    return <CustomTemplatePDF data={data} />
  }

  // Return a basic PDF structure if no template is available
  function _PDFSkillDisplay({ skill }: { skill: { name: string; years?: string; certification?: string; level?: string; context?: string } }) {
    if (!skill.name) return null;
    let text = skill.name;
    if (skill.years) text += ` (${skill.years} years)`;
    if (skill.certification) text += ` (${skill.certification})`;
    if (skill.level) text += ` (${skill.level})`;
    if (skill.context) text += ` - ${skill.context}`;
    return <Text>{text}</Text>;
  }

  return (
    <Document>
      <Page size="A4" style={defaultStyles.page}>
        {/* Header */}
        <View style={defaultStyles.header}>
          <Text style={defaultStyles.name}>{data.personalInfo.name}</Text>
          {data.personalInfo.email && <Text style={defaultStyles.contactInfo}>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text style={defaultStyles.contactInfo}>{data.personalInfo.phone}</Text>}
          {data.personalInfo.location && <Text style={defaultStyles.contactInfo}>{data.personalInfo.location}</Text>}
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={defaultStyles.section}>
            <Text style={defaultStyles.sectionTitle}>Professional Summary</Text>
            <Text style={defaultStyles.summary}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && data.experiences.some(exp => exp.company || exp.position) && (
          <View style={defaultStyles.section}>
            <Text style={defaultStyles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp, index) => (
              (exp.company || exp.position) && (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={defaultStyles.jobTitle}>{exp.position}</Text>
                  <Text style={defaultStyles.company}>{exp.company}</Text>
                  {(exp.startDate || exp.endDate) && (
                    <Text style={defaultStyles.dates}>{exp.startDate} - {exp.endDate}</Text>
                  )}
                  {exp.description && <Text style={defaultStyles.description}>{exp.description}</Text>}
                </View>
              )
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && data.education.some(edu => edu.school || edu.degree) && (
          <View style={defaultStyles.section}>
            <Text style={defaultStyles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              (edu.school || edu.degree) && (
                <View key={index} style={defaultStyles.educationItem}>
                  <Text style={defaultStyles.degree}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </Text>
                  <Text style={defaultStyles.school}>{edu.school}</Text>
                  <Text style={defaultStyles.graduation}>{edu.graduationDate}</Text>
                  {edu.gpa && <Text style={defaultStyles.graduation}>GPA: {edu.gpa}</Text>}
                </View>
              )
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && data.skills.some(skill => skill.name) && (
          <View style={defaultStyles.section}>
            <Text style={defaultStyles.sectionTitle}>Skills</Text>
            <View style={defaultStyles.skillsGrid}>
              {data.skills.map((skill, index) => (
                skill.name && (
                  <View key={index} style={defaultStyles.skillItem}>
                    <Text style={defaultStyles.skillName}>{skill.name}</Text>
                    <Text style={defaultStyles.skillLevel}>{skill.level}</Text>
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