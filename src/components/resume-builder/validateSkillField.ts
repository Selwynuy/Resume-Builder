export function validateSkillField(field: string, value: string | number | undefined): string {
  if (field === 'name') {
    if (!value || typeof value !== 'string' || value.trim().length < 2) return 'Skill name required';
    if (value.length > 50) return 'Skill name too long';
  }
  if (field === 'years') {
    if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 50)) return 'Years must be 0-50';
  }
  if (field === 'certification') {
    if (value && typeof value === 'string' && value.length > 100) return 'Certification too long';
  }
  if (field === 'context') {
    if (value && typeof value === 'string' && value.length > 100) return 'Context too long';
  }
  if (field === 'level') {
    if (value && typeof value === 'string' && !['Beginner','Intermediate','Advanced','Expert'].includes(value)) return 'Invalid level';
  }
  return '';
} 