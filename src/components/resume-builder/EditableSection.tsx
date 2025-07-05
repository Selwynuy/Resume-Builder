interface EditableSectionProps {
  title: string
  icon: string
  count?: number
  isEditing: boolean
  onToggleEdit: () => void
  children: React.ReactNode
}

export const EditableSection = ({ 
  title, 
  icon, 
  count, 
  isEditing: _isEditing, 
  onToggleEdit, 
  children 
}: EditableSectionProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 flex items-center">
          <span className="text-lg mr-2">{icon}</span>
          {title}
          {count !== undefined && ` (${count})`}
        </h4>
        <button
          onClick={onToggleEdit}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title={`Edit ${title.toLowerCase()}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}; 