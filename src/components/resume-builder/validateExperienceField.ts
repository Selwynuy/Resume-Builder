export function validateExperienceField(field: string, value: string): string {
  if (field === 'position') {
    if (!value || value.trim().length < 2) return 'Job title required';
    if (value.length > 100) return 'Job title too long';
  }
  if (field === 'company') {
    if (!value || value.trim().length < 2) return 'Company name required';
    if (value.length > 100) return 'Company name too long';
  }
  if (field === 'startDate') {
    if (value && !/^\d{4}-\d{2}$/.test(value)) return 'Invalid start date format';
  }
  if (field === 'endDate') {
    if (value && !/^\d{4}-\d{2}$/.test(value)) return 'Invalid end date format';
    // Additional validation: end date should not be before start date
    // This would need startDate passed as parameter for full validation
  }
  if (field === 'description') {
    if (value && value.length > 1000) return 'Description too long (max 1000 characters)';
  }
  return '';
} 