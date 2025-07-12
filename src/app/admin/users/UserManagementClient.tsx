'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'creator' | 'admin'
  createdAt: string
}

export default function UserManagementClient() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'user' | 'creator' | 'admin'>('user')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState('')

  // For demo purposes, we'll use a simple search by email
  // In a real app, you'd have a proper user listing API
  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      setMessage('Please enter an email address')
      return
    }

    setLoading(true)
    try {
      // This is a simplified approach - in reality you'd search the database
      // For now, we'll just show a message
      setMessage(`Search functionality would look up user: ${searchEmail}`)
      setSelectedUser({
        _id: 'demo-id',
        name: 'Demo User',
        email: searchEmail,
        role: 'user',
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      setMessage('Error searching for user')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`Success: ${data.message}`)
        setSelectedUser({ ...selectedUser, role: newRole })
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage('Error updating user role')
    } finally {
      setUpdating(false)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return <div className="flex justify-center items-center min-h-screen">Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Role Management</h1>
          
          {/* Search Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Search User</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email-search" className="block text-sm font-medium text-gray-700 mb-2">
                  User Email
                </Label>
                <Input
                  id="email-search"
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter user email to search"
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearchUser}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.startsWith('Success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* User Role Update Section */}
          {selectedUser && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Update User Role</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Current Role</Label>
                  <p className="text-gray-900 capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Member Since</Label>
                  <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
                    New Role
                  </Label>
                  <select
                    id="role-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'user' | 'creator' | 'admin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button
                  onClick={handleUpdateRole}
                  disabled={updating || newRole === selectedUser.role}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {updating ? 'Updating...' : 'Update Role'}
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Enter a user's email address to search for them</li>
              <li>• Select the new role you want to assign</li>
              <li>• Click "Update Role" to apply the change</li>
              <li>• Only admins can access this page and modify user roles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 