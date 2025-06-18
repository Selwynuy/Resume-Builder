import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { Template, getTemplate } from './templates'

// Register fonts
Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf'
})

Font.register({
  family: 'Open Sans Bold',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUuhp.ttf'
})

const createStyles = (template: Template) => StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    fontSize: 11,
    paddingTop: 50,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 50,
    color: template.colors.text,
  },
  header: {
    marginBottom: 20,
    borderBottom: template.id === 'minimal' ? 0 : 1,
    borderBottomColor: template.colors.accent,
    paddingBottom: template.id === 'minimal' ? 0 : 10,
    backgroundColor: template.id === 'creative' ? template.colors.primary : 'transparent',
    padding: template.id === 'creative' ? 15 : 0,
    margin: template.id === 'creative' ? -60 : 0,
    marginBottom: 20,
    marginTop: template.id === 'creative' ? -50 : 0,
  },
  name: {
    fontSize: template.id === 'creative' ? 28 : 24,
    fontFamily: 'Open Sans Bold',
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
    fontFamily: 'Open Sans Bold',
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
    fontFamily: 'Open Sans Bold',
    marginBottom: 2,
    color: template.colors.primary,
  },
  company: {
    fontSize: 11,
    marginBottom: 2,
    fontStyle: template.id === 'creative' ? 'italic' : 'normal',
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
    fontStyle: template.id === 'creative' ? 'italic' : 'normal',
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
}

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  const template = getTemplate(data.template || 'classic')
  const styles = createStyles(template)

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

        {/* Experience */}
        {data.experiences.length > 0 && data.experiences.some(exp => exp.company || exp.position) && (
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
        )}

        {/* Education */}
        {data.education.length > 0 && data.education.some(edu => edu.school || edu.degree) && (
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
        )}

        {/* Skills */}
        {data.skills.length > 0 && data.skills.some(skill => skill.name) && (
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
        )}
      </Page>
    </Document>
  )
} 