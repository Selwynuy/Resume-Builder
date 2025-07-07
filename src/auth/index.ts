// Export NextAuth configuration
export { authOptions } from '@/app/api/auth/options'

// Export authentication utilities
export {
  getCurrentSession,
  getCurrentUserId,
  getCurrentUserEmail,
  requireAuth,
  requireAdmin,
  isAdmin,
  optionalAuth
} from './utils'

// Export registration utilities
export {
  registerUser,
  type RegistrationData,
  type RegistrationResult
} from './register' 