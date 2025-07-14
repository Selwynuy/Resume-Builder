import { Skill } from '@/components/resume-builder/types'

export function SkillDisplay({ skill }: { skill: Skill }) {
  if (!skill.name) return null;
  return (
    <span>
      {skill.name}
      {skill.years ? ` (${skill.years} years)` : ''}
      {skill.certification ? ` (${skill.certification})` : ''}
      {skill.level ? ` (${skill.level})` : ''}
      {skill.context ? ` - ${skill.context}` : ''}
    </span>
  );
} 