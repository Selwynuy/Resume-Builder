import { requireCreator } from '@/auth'
import CreateTemplateClient from './CreateTemplateClient'

export default async function CreateTemplatePage() {
  // Require creator role for template creation
  await requireCreator()
  
  return <CreateTemplateClient />
}