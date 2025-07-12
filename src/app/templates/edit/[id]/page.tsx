import { requireCreator } from '@/auth'
import EditTemplateClient from './EditTemplateClient'

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  // Require creator role for template editing
  await requireCreator()
  
  return <EditTemplateClient params={params} />
} 