import { PersonalInfo } from '@/components/resume-builder/types';
import { phoneRegex, nameRegex, locationRegex, INPUT_LIMITS } from '@/lib/security';

export interface ValidationErrors {
  [key: string]: string;
}

export const validatePersonalInfoField = (
  field: keyof PersonalInfo, 
  value: string
): string | null => {
  switch (field) {
    case 'name':
      if (value && !nameRegex.test(value)) {
        return 'Name contains invalid characters';
      } else if (value.length > INPUT_LIMITS.NAME) {
        return `Name must be less than ${INPUT_LIMITS.NAME} characters`;
      }
      break;
      
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
      } else if (value.length > INPUT_LIMITS.EMAIL) {
        return `Email must be less than ${INPUT_LIMITS.EMAIL} characters`;
      }
      break;
      
    case 'phone':
      if (value && !phoneRegex.test(value)) {
        return 'Invalid phone number format';
      } else if (value.length > INPUT_LIMITS.PHONE) {
        return `Phone must be less than ${INPUT_LIMITS.PHONE} characters`;
      }
      break;
      
    case 'location':
      if (value && !locationRegex.test(value)) {
        return 'Location contains invalid characters';
      } else if (value.length > INPUT_LIMITS.LOCATION) {
        return `Location must be less than ${INPUT_LIMITS.LOCATION} characters`;
      }
      break;
      
    case 'summary':
      if (value.length > INPUT_LIMITS.SUMMARY) {
        return `Summary must be less than ${INPUT_LIMITS.SUMMARY} characters`;
      }
      break;
  }
  
  return null;
};

export const validatePersonalInfo = (personalInfo: PersonalInfo): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  Object.keys(personalInfo).forEach((field) => {
    const error = validatePersonalInfoField(field as keyof PersonalInfo, personalInfo[field as keyof PersonalInfo]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
}; 