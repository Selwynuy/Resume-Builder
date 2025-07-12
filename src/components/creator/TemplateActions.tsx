import React, { FC } from 'react'
import { Button } from '@/components/ui/button'
import { TemplateTableRow } from './TemplateTable'

interface TemplateActionsProps {
  template: TemplateTableRow
  onAction: (action: 'edit' | 'delete' | 'duplicate' | 'preview', template: TemplateTableRow) => void
}

const TemplateActions: FC<TemplateActionsProps> = ({ template, onAction }) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => onAction('edit', template)}>Edit</Button>
      <Button size="sm" variant="outline" onClick={() => onAction('preview', template)}>Preview</Button>
      <Button size="sm" variant="outline" onClick={() => onAction('duplicate', template)}>Duplicate</Button>
      <Button size="sm" variant="destructive" onClick={() => onAction('delete', template)}>Delete</Button>
    </div>
  )
}

export default TemplateActions; 