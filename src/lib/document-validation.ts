import { z } from 'zod'
import { DocumentType } from '@/components/document-builder/types'
import { INPUT_LIMITS } from './security'

// Base validation schemas for common fields
const PersonalInfoSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(INPUT_LIMITS.NAME, 'Name too long')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(INPUT_LIMITS.EMAIL, 'Email too long')
    .trim(),
  phone: z.string()
    .max(INPUT_LIMITS.PHONE, 'Phone number too long')
    .optional(),
  location: z.string()
    .max(INPUT_LIMITS.LOCATION, 'Location too long')
    .optional(),
  summary: z.string()
    .max(INPUT_LIMITS.SUMMARY, 'Summary too long')
    .optional()
})

const ExperienceSchema = z.object({
  company: z.string()
    .min(1, 'Company name is required')
    .max(INPUT_LIMITS.COMPANY, 'Company name too long')
    .trim(),
  position: z.string()
    .min(1, 'Position is required')
    .max(INPUT_LIMITS.POSITION, 'Position too long')
    .trim(),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
  endDate: z.string()
    .regex(/^(\d{4}-\d{2}|Present)$/, 'End date must be in YYYY-MM format or "Present"'),
  description: z.string()
    .max(INPUT_LIMITS.DESCRIPTION, 'Description too long')
    .optional()
})

const EducationSchema = z.object({
  school: z.string()
    .min(1, 'School name is required')
    .max(INPUT_LIMITS.SCHOOL, 'School name too long')
    .trim(),
  degree: z.string()
    .min(1, 'Degree is required')
    .max(INPUT_LIMITS.DEGREE, 'Degree too long')
    .trim(),
  field: z.string()
    .max(INPUT_LIMITS.FIELD, 'Field of study too long')
    .optional(),
  graduationDate: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Graduation date must be in YYYY-MM format'),
  gpa: z.string()
    .optional()
})

const SkillSchema = z.object({
  name: z.string()
    .min(1, 'Skill name is required')
    .max(INPUT_LIMITS.SKILL_NAME, 'Skill name too long')
    .trim(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .optional(),
  years: z.number()
    .min(0, 'Years cannot be negative')
    .max(50, 'Years cannot exceed 50')
    .optional(),
  certification: z.string()
    .max(100, 'Certification name too long')
    .optional(),
  context: z.string()
    .max(100, 'Context too long')
    .optional()
})

// CV-specific schemas
const PublicationSchema = z.object({
  title: z.string()
    .min(1, 'Publication title is required')
    .max(200, 'Publication title too long')
    .trim(),
  authors: z.string()
    .min(1, 'Authors are required')
    .max(200, 'Authors list too long')
    .trim(),
  journal: z.string()
    .min(1, 'Journal name is required')
    .max(100, 'Journal name too long')
    .trim(),
  year: z.number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  doi: z.string()
    .max(100, 'DOI too long')
    .optional(),
  url: z.string()
    .url('Invalid URL format')
    .max(500, 'URL too long')
    .optional()
})

const PresentationSchema = z.object({
  title: z.string()
    .min(1, 'Presentation title is required')
    .max(200, 'Presentation title too long')
    .trim(),
  conference: z.string()
    .min(1, 'Conference name is required')
    .max(100, 'Conference name too long')
    .trim(),
  location: z.string()
    .max(100, 'Location too long')
    .optional(),
  date: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Date must be in YYYY-MM format'),
  type: z.enum(['Oral', 'Poster', 'Workshop', 'Keynote'])
    .default('Oral')
})

const ResearchSchema = z.object({
  title: z.string()
    .min(1, 'Research title is required')
    .max(200, 'Research title too long')
    .trim(),
  institution: z.string()
    .min(1, 'Institution is required')
    .max(100, 'Institution name too long')
    .trim(),
  supervisor: z.string()
    .max(100, 'Supervisor name too long')
    .optional(),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
  endDate: z.string()
    .regex(/^(\d{4}-\d{2}|Present)$/, 'End date must be in YYYY-MM format or "Present"'),
  description: z.string()
    .max(INPUT_LIMITS.DESCRIPTION, 'Description too long')
    .optional()
})

const AwardSchema = z.object({
  name: z.string()
    .min(1, 'Award name is required')
    .max(100, 'Award name too long')
    .trim(),
  organization: z.string()
    .min(1, 'Organization is required')
    .max(100, 'Organization name too long')
    .trim(),
  year: z.number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  description: z.string()
    .max(200, 'Description too long')
    .optional()
})

const ReferenceSchema = z.object({
  name: z.string()
    .min(1, 'Reference name is required')
    .max(100, 'Reference name too long')
    .trim(),
  title: z.string()
    .max(100, 'Title too long')
    .optional(),
  organization: z.string()
    .max(100, 'Organization name too long')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(INPUT_LIMITS.EMAIL, 'Email too long')
    .optional(),
  phone: z.string()
    .max(INPUT_LIMITS.PHONE, 'Phone number too long')
    .optional(),
  relationship: z.string()
    .max(100, 'Relationship description too long')
    .optional()
})

// Biodata-specific schemas
const LanguageSchema = z.object({
  name: z.string()
    .min(1, 'Language name is required')
    .max(50, 'Language name too long')
    .trim(),
  proficiency: z.enum(['Basic', 'Intermediate', 'Advanced', 'Native', 'Fluent'])
    .default('Intermediate'),
  reading: z.enum(['Basic', 'Intermediate', 'Advanced', 'Native'])
    .optional(),
  writing: z.enum(['Basic', 'Intermediate', 'Advanced', 'Native'])
    .optional(),
  speaking: z.enum(['Basic', 'Intermediate', 'Advanced', 'Native'])
    .optional()
})

const PersonalDetailsSchema = z.object({
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'])
    .optional(),
  nationality: z.string()
    .max(50, 'Nationality too long')
    .optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'])
    .optional(),
  address: z.string()
    .max(300, 'Address too long')
    .optional()
})

// Document type validation schemas
export const ResumeValidationSchema = z.object({
  documentType: z.literal(DocumentType.RESUME),
  personalInfo: PersonalInfoSchema,
  experiences: z.array(ExperienceSchema)
    .min(1, 'At least one experience entry is required')
    .max(10, 'Too many experience entries'),
  education: z.array(EducationSchema)
    .min(1, 'At least one education entry is required')
    .max(5, 'Too many education entries'),
  skills: z.array(SkillSchema)
    .min(1, 'At least one skill is required')
    .max(20, 'Too many skills'),
  template: z.string()
    .min(1, 'Template is required')
})

export const CVValidationSchema = z.object({
  documentType: z.literal(DocumentType.CV),
  personalInfo: PersonalInfoSchema,
  experiences: z.array(ExperienceSchema)
    .min(1, 'At least one experience entry is required')
    .max(15, 'Too many experience entries'),
  education: z.array(EducationSchema)
    .min(1, 'At least one education entry is required')
    .max(10, 'Too many education entries'),
  research: z.array(ResearchSchema)
    .max(10, 'Too many research entries')
    .optional(),
  publications: z.array(PublicationSchema)
    .max(20, 'Too many publications')
    .optional(),
  presentations: z.array(PresentationSchema)
    .max(15, 'Too many presentations')
    .optional(),
  skills: z.array(SkillSchema)
    .min(1, 'At least one skill is required')
    .max(30, 'Too many skills'),
  awards: z.array(AwardSchema)
    .max(10, 'Too many awards')
    .optional(),
  references: z.array(ReferenceSchema)
    .min(1, 'At least one reference is required')
    .max(5, 'Too many references'),
  template: z.string()
    .min(1, 'Template is required')
})

export const BiodataValidationSchema = z.object({
  documentType: z.literal(DocumentType.BIODATA),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema)
    .min(1, 'At least one education entry is required')
    .max(10, 'Too many education entries'),
  experiences: z.array(ExperienceSchema)
    .min(1, 'At least one experience entry is required')
    .max(15, 'Too many experience entries'),
  skills: z.array(SkillSchema)
    .min(1, 'At least one skill is required')
    .max(25, 'Too many skills'),
  languages: z.array(LanguageSchema)
    .min(1, 'At least one language is required')
    .max(10, 'Too many languages'),
  personalDetails: PersonalDetailsSchema
    .optional(),
  references: z.array(ReferenceSchema)
    .min(1, 'At least one reference is required')
    .max(3, 'Too many references'),
  declaration: z.string()
    .max(500, 'Declaration too long')
    .optional(),
  template: z.string()
    .min(1, 'Template is required')
})

// Union type for all document validation schemas
export const DocumentValidationSchema = z.discriminatedUnion('documentType', [
  ResumeValidationSchema,
  CVValidationSchema,
  BiodataValidationSchema
])

// Helper function to get validation schema by document type
export function getValidationSchema(documentType: DocumentType) {
  switch (documentType) {
    case DocumentType.RESUME:
      return ResumeValidationSchema
    case DocumentType.CV:
      return CVValidationSchema
    case DocumentType.BIODATA:
      return BiodataValidationSchema
    default:
      return ResumeValidationSchema // Default fallback
  }
}

// Helper function to validate document data
export function validateDocumentData(data: any, documentType: DocumentType) {
  const schema = getValidationSchema(documentType)
  return schema.safeParse(data)
} 