// Export NextAuth configuration
export { authOptions } from './config'

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
  handleRegistration,
  type RegistrationData,
  type RegistrationResult
} from './register' 