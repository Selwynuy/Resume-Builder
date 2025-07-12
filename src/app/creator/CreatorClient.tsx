'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useRef } from 'react'
import TemplateTable, { TemplateTableRow } from '@/components/creator/TemplateTable'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CreatorClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // UI state
  const [templates, setTemplates] = useState<TemplateTableRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [showDuplicate, setShowDuplicate] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selected, setSelected] = useState<TemplateTableRow | null>(null)
  const [statusMsg, setStatusMsg] = useState('')
  const statusTimeout = useRef<NodeJS.Timeout | null>(null)

  // Filtering/sorting/search state
  const [sortBy, setSortBy] = useState((searchParams?.get('sortBy')) || 'createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>((searchParams?.get('sortDir')) === 'asc' ? 'asc' : 'desc')
  const [statusFilter, setStatusFilter] = useState((searchParams?.get('status')) || 'all')
  const [categoryFilter, setCategoryFilter] = useState((searchParams?.get('category')) || 'all')
  const [search, setSearch] = useState((searchParams?.get('search')) || '')
  const [page, setPage] = useState(Number(searchParams?.get('page')) || 1)
  const PAGE_SIZE = 5

  // Fetch templates from API
  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('sortBy', sortBy)
    params.set('sortDir', sortDir)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (categoryFilter !== 'all') params.set('category', categoryFilter)
    if (search) params.set('search', search)
    params.set('page', String(page))
    params.set('limit', String(PAGE_SIZE))
    fetch(`/api/creator/templates?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(data => {
        setTemplates(data.templates)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load templates')
        setTemplates([])
        setLoading(false)
      })
  }, [sortBy, sortDir, statusFilter, categoryFilter, search, page])

  // Filtering, searching, sorting, pagination
  const filtered = (templates || [])
    .filter(t => statusFilter === 'all' || t.approvalStatus === statusFilter)
    .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  const sorted = [...filtered].sort((a, b) => {
    let vA = a[sortBy as keyof TemplateTableRow]
    let vB = b[sortBy as keyof TemplateTableRow]
    if (sortBy === 'price') {
      vA = Number(vA)
      vB = Number(vB)
    } else if (sortBy === 'createdAt') {
      vA = new Date(vA as string).getTime()
      vB = new Date(vB as string).getTime()
    } else {
      vA = String(vA).toLowerCase()
      vB = String(vB).toLowerCase()
    }
    if (vA < vB) return sortDir === 'asc' ? -1 : 1
    if (vA > vB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Update URL query params on filter/sort/search/page change
  useEffect(() => {
    const params = new URLSearchParams()
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy)
    if (sortDir !== 'desc') params.set('sortDir', sortDir)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (categoryFilter !== 'all') params.set('category', categoryFilter)
    if (search) params.set('search', search)
    if (page !== 1) params.set('page', String(page))
    router.replace(`?${params.toString()}`)
  }, [sortBy, sortDir, statusFilter, categoryFilter, search, page])

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(col)
      setSortDir('asc')
    }
  }

  const handleAction = (action: 'edit' | 'delete' | 'duplicate' | 'preview', template: TemplateTableRow) => {
    setSelected(template)
    if (action === 'delete') setShowDelete(true)
    else if (action === 'duplicate') setShowDuplicate(true)
    else if (action === 'preview') setShowPreview(true)
    else if (action === 'edit') window.location.href = `/templates/edit/${template._id}`
  }

  const handleDelete = async () => {
    if (!selected) return
    // Optimistic UI update
    setTemplates((prev) => prev ? prev.filter(t => t._id !== selected._id) : prev)
    setShowDelete(false)
    setSelected(null)
    setStatusMsg('Template deleted. (Updated just now)')
    if (statusTimeout.current) clearTimeout(statusTimeout.current)
    statusTimeout.current = setTimeout(() => setStatusMsg(''), 3000)
    // Real API call
    try {
      const res = await fetch(`/api/templates/${selected._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
    } catch (err) {
      setError('Failed to delete template (refresh to retry)')
    }
  }

  const handleDuplicate = async () => {
    if (!selected) return
    setShowDuplicate(false)
    setSelected(null)
    setStatusMsg('Template duplicated. (Updated just now)')
    if (statusTimeout.current) clearTimeout(statusTimeout.current)
    statusTimeout.current = setTimeout(() => setStatusMsg(''), 3000)
    // Real API call
    try {
      const res = await fetch(`/api/creator/templates/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selected._id })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      // Optimistically add new template to UI
      setTemplates((prev) => prev ? [data.template, ...prev] : prev)
    } catch (err) {
      setError('Failed to duplicate template')
    }
  }

  // Placeholder preview modal
  const PreviewModal = ({ open, onClose, template }: { open: boolean, onClose: () => void, template: TemplateTableRow | null }) => (
    open && template ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Preview: {template.name}</h2>
          <div className="mb-4 text-gray-700">(Template preview would render here.)</div>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">Close</Button>
        </div>
      </div>
    ) : null
  )

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return <div className="flex justify-center items-center min-h-screen">Access denied</div>
  }

  const totalTemplates = filtered.length
  const totalDownloads = filtered.reduce((sum, t) => sum + (t.downloads ?? 0), 0)
  const avgRating = filtered.length ? (filtered.reduce((sum, t) => sum + (t.rating ?? 0), 0) / filtered.length).toFixed(2) : '0.00'

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/dashboard" className="hover:underline text-blue-600">Dashboard</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center text-gray-700 font-semibold">Creator</li>
          </ol>
        </nav>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Creator Management</h1>
          <Link href="/templates/create">
            <Button className="bg-blue-600 hover:bg-blue-700">Create New Template</Button>
          </Link>
        </div>
        {/* Analytics summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{totalTemplates}</div>
            <div className="text-xs text-blue-700 font-semibold">Templates</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{totalDownloads}</div>
            <div className="text-xs text-green-700 font-semibold">Total Downloads</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{avgRating}</div>
            <div className="text-xs text-yellow-700 font-semibold">Avg. Rating</div>
          </div>
        </div>
        {/* Performance trend card (mocked) */}
        <div className="bg-purple-50 rounded-lg p-4 text-center mb-6">
          <div className="text-xs text-purple-700 font-semibold mb-2">Downloads Trend (last 7 days)</div>
          <div className="flex justify-center gap-1 text-purple-700 text-lg font-mono">
            {/* Mocked trend: 7 bars */}
            {[12, 18, 22, 15, 30, 25, 28].map((v, i) => (
              <span key={i} className="inline-block w-4">{v}</span>
            ))}
          </div>
        </div>
        {/* Status update indicator */}
        {statusMsg && (
          <div className="mb-4 text-center text-green-700 font-semibold">{statusMsg}</div>
        )}
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 flex-1">
            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="border rounded px-2 py-1">
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1) }} className="border rounded px-2 py-1">
                <option value="all">All</option>
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Search</label>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="border rounded px-2 py-1" placeholder="Search by name..." />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[300px]">
          {loading && (
            <div className="flex justify-center items-center h-40 text-gray-400">Loading your templates...</div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
          )}
          {!loading && !error && paged.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="text-2xl text-gray-400 mb-2">No templates found.</div>
              <Link href="/templates/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Create Your First Template</Button>
              </Link>
            </div>
          )}
          {!loading && !error && paged.length > 0 && (
            <TemplateTable
              templates={paged}
              onAction={handleAction}
              onSort={handleSort}
              sortBy={sortBy}
              sortDir={sortDir}
            />
          )}
          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button key={i} size="sm" variant={page === i + 1 ? 'default' : 'outline'} onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
      {/* Duplicate Confirmation Modal */}
      <ConfirmModal
        isOpen={showDuplicate}
        title="Duplicate Template"
        message={`Duplicate "${selected?.name}"? The copy will be set to pending approval.`}
        confirmText="Duplicate"
        cancelText="Cancel"
        onConfirm={handleDuplicate}
        onCancel={() => setShowDuplicate(false)}
      />
      {/* Preview Modal */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} template={selected} />
    </div>
  )
} 