import { requireCreator } from '@/auth'
import CreatorClient from './CreatorClient'

export default async function CreatorPage() {
  // Require creator role for access
  await requireCreator()
  return <CreatorClient />
} 