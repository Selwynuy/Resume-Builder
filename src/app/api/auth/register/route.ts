import { handleRegistration } from '@/auth/register-handler'

export async function POST(req: Request) {
  return handleRegistration(req)
} 