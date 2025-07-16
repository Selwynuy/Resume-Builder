import { getCurrentSession, getCurrentUserRole } from '@/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'
import UserTable from './UserTable'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getUsers() {
  await connectDB()
  const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 })
  return users.map((u: any) => ({
    id: u._id.toString(),
    name: u.name || '',
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }))
}

export default async function AdminUsersPage() {
  const session = await getCurrentSession()
  const role = await getCurrentUserRole()
  if (!session?.user || role !== 'admin') {
    redirect('/dashboard')
  }
  const users = await getUsers()
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        {users.length === 0 && <div className="text-center text-gray-500 py-8">No users found.</div>}
        <UserTable users={users} />
      </div>
    </div>
  )
} 