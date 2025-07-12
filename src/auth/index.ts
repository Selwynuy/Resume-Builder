// Export NextAuth configuration
export { authOptions } from '@/app/api/auth/options'

// Export authentication utilities
export {
  getCurrentSession,
  getCurrentUserId,
  getCurrentUserEmail,
  getCurrentUserRole,
  requireAuth,
  requireAdmin,
  requireCreator,
  isAdmin,
  isCreator,
  isCreatorAsync,
  optionalAuth
} from './utils'

// Export registration utilities
export {
  registerUser,
  type RegistrationData,
  type RegistrationResult
} from './register' 