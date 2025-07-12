import React, { FC } from 'react'
import { Button } from '@/components/ui/button'
import TemplateActions from './TemplateActions'

export interface TemplateTableRow {
  _id: string
  name: string
  description: string
  category: string
  price: number
  createdAt: string
  updatedAt?: string
  approvalStatus: 'approved' | 'pending' | 'rejected'
  rejectionReason?: string
  downloads?: number
  rating?: number // 0-5
}

interface TemplateTableProps {
  templates: TemplateTableRow[]
  onAction: (action: 'edit' | 'delete' | 'duplicate' | 'preview', template: TemplateTableRow) => void
  onSort?: (col: string) => void
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

const statusColor = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'downloads', label: 'Downloads' },
  { key: 'rating', label: 'Rating' },
  { key: 'createdAt', label: 'Created' },
  { key: 'updatedAt', label: 'Last Updated' },
  { key: 'approvalStatus', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const TemplateTable: FC<TemplateTableProps> = ({ templates, onAction, onSort, sortBy, sortDir }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(col => (
              col.key === 'actions' ? (
                <th key={col.key} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{col.label}</th>
              ) : (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-600 cursor-pointer select-none"
                  onClick={onSort ? () => onSort(col.key) : undefined}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              )
            ))}
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl) => (
            <tr key={tpl._id} className="border-b last:border-0">
              <td className="px-4 py-2 font-medium text-gray-900">{tpl.name}</td>
              <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{tpl.description}</td>
              <td className="px-4 py-2 text-gray-700">{tpl.category}</td>
              <td className="px-4 py-2 text-gray-700">{tpl.price === 0 ? 'Free' : `$${tpl.price}`}</td>
              <td className="px-4 py-2 text-gray-700">{tpl.downloads ?? 0}</td>
              <td className="px-4 py-2 text-yellow-500">
                {tpl.rating ? '★'.repeat(Math.round(tpl.rating)) + '☆'.repeat(5 - Math.round(tpl.rating)) : '☆☆☆☆☆'}
              </td>
              <td className="px-4 py-2 text-gray-700">{new Date(tpl.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-gray-700">{tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : '-'}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[tpl.approvalStatus]}`}>{tpl.approvalStatus.charAt(0).toUpperCase() + tpl.approvalStatus.slice(1)}</span>
                {tpl.approvalStatus === 'rejected' && tpl.rejectionReason && (
                  <div className="text-xs text-red-500 mt-1">{tpl.rejectionReason}</div>
                )}
              </td>
              <td className="px-4 py-2">
                <TemplateActions template={tpl} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TemplateTable; 