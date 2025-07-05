export function validateEducationField(field: string, value: string): string {
  if (field === 'school') {
    if (!value || value.trim().length < 2) return 'School name required';
    if (value.length > 100) return 'School name too long';
  }
  if (field === 'degree') {
    if (!value || value.trim().length < 2) return 'Degree required';
    if (value.length > 100) return 'Degree too long';
  }
  if (field === 'field') {
    if (value && value.length > 100) return 'Field of study too long';
  }
  if (field === 'graduationDate') {
    if (value && !/^\d{4}-\d{2}$/.test(value)) return 'Invalid graduation date format';
  }
  if (field === 'gpa') {
    if (value) {
      // Allow formats like "3.8/4.0", "3.8", "85%", etc.
      const gpaPattern = /^(\d+(?:\.\d+)?)(?:\/\d+(?:\.\d+)?)?(?:\s*%)?$/;
      if (!gpaPattern.test(value)) return 'Invalid GPA format';
      const numValue = parseFloat(value.split('/')[0]);
      if (isNaN(numValue) || numValue < 0 || numValue > 4.5) return 'GPA must be between 0-4.5';
    }
  }
  return '';
} 