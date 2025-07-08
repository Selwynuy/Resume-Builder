export default function Loading() {
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading Page</h2>
        <p className="text-slate-600">Please wait while we load the content...</p>
      </div>
    </div>
  )
} 