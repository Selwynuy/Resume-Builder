"use client"
import React, { useState } from 'react'

export default function UserTable({ users }: { users: any[] }) {
  return (
    <table className="w-full bg-white rounded shadow">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Role</th>
          <th className="p-3">Change Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => <UserRow key={user.id} user={user} />)}
      </tbody>
    </table>
  )
}

function UserRow({ user }: { user: any }) {
  const [role, setRole] = useState(user.role)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setRole(newRole)
    setLoading(true)
    setStatus('')
    try {
      const res = await fetch('/api/admin/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, role: newRole })
      })
      const data = await res.json()
      if (res.ok) setStatus('✅')
      else setStatus(data.error || '❌ Error')
    } catch (err) {
      setStatus('❌ Network error')
    } finally {
      setLoading(false)
    }
  }
  return (
    <tr className="border-b">
      <td className="p-3">{user.name}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">
        <select value={role} onChange={handleChange} disabled={loading} className="border rounded px-2 py-1">
          <option value="user">user</option>
          <option value="creator">creator</option>
          <option value="admin">admin</option>
        </select>
        <span className="ml-2 text-green-600">{status}</span>
      </td>
    </tr>
  )
} 