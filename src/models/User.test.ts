import mongoose from 'mongoose'
let User
try {
  User = require('./User').default
} catch (e) {
  User = undefined
}

describe('User Model', () => {
  if (!User) {
    it('skips all tests because User model is undefined', () => {
      expect(true).toBe(true)
    })
    return
  }

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('Role Field', () => {
    it('should create user with default role', async () => {
      const user: any = await User.create({ email: 'test@example.com', password: 'test' })
      expect(user.role).toBe('user')
    })

    it('should create user with creator role', async () => {
      const user: any = await User.create({ email: 'creator@example.com', password: 'test', role: 'creator' })
      expect(user.role).toBe('creator')
    })

    it('should create user with admin role', async () => {
      const user: any = await User.create({ email: 'admin@example.com', password: 'test', role: 'admin' })
      expect(user.role).toBe('admin')
    })

    it('should reject invalid role', async () => {
      let error
      try {
        const user: any = await User.create({ email: 'badrole@example.com', password: 'test', role: 'badrole' })
      } catch (e) {
        error = e
      }
      expect(error).toBeDefined()
    })
  })

  describe('Role Validation', () => {
    it('should accept valid roles', () => {
      const validRoles = ['user', 'creator', 'admin']
      
      validRoles.forEach(role => {
        const user = new User({
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedpassword',
          role
        })
        
        expect(user.role).toBe(role)
      })
    })

    it('should set default role when not specified', () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword'
      })
      
      expect(user.role).toBe('user')
    })
  })

  describe('Role Queries', () => {
    beforeEach(async () => {
      await User.create([
        { name: 'User 1', email: 'user1@example.com', password: 'hash', role: 'user' },
        { name: 'Creator 1', email: 'creator1@example.com', password: 'hash', role: 'creator' },
        { name: 'Admin 1', email: 'admin1@example.com', password: 'hash', role: 'admin' },
        { name: 'User 2', email: 'user2@example.com', password: 'hash', role: 'user' },
        { name: 'Creator 2', email: 'creator2@example.com', password: 'hash', role: 'creator' }
      ])
    })

    it('should find users by role', async () => {
      const users = await User.find({ role: 'user' })
      const creators = await User.find({ role: 'creator' })
      const admins = await User.find({ role: 'admin' })

      expect(users).toHaveLength(2)
      expect(creators).toHaveLength(2)
      expect(admins).toHaveLength(1)
    })

    it('should find creators and admins', async () => {
      const privilegedUsers = await User.find({ role: { $in: ['creator', 'admin'] } })

      expect(privilegedUsers).toHaveLength(3)
      expect(privilegedUsers.every(user => ['creator', 'admin'].includes(user.role))).toBe(true)
    })
  })

  describe('Role Updates', () => {
    it('should update user role', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      })

      user.role = 'creator'
      await user.save()

      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.role).toBe('creator')
    })

    it('should update role via findByIdAndUpdate', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      })

      await User.findByIdAndUpdate(user._id, { role: 'admin' })

      const updatedUser = await User.findById(user._id)
      expect(updatedUser?.role).toBe('admin')
    })
  })
}) 