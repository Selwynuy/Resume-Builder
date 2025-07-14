
interface MultiStyleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  onSelectSummary: (summary: string) => void;
  summaries: {
    professional: string;
    creative: string;
    friendly: string;
    technical: string;
  } | null;
  loading: boolean;
  error: string | null;
  currentSummary: string;
}

export const MultiStyleSummaryModal = ({
  isOpen,
  onClose,
  onRegenerate,
  onSelectSummary,
  summaries,
  loading,
  error,
  currentSummary
}: MultiStyleSummaryModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-60 transition-all z-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl min-w-[280px] max-h-[80vh] p-3 sm:p-5 md:p-6 flex flex-col justify-center relative"
          style={{ boxSizing: 'border-box' }}
          tabIndex={-1}
        >
          <button
            className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow focus:outline-none"
            style={{ zIndex: 10 }}
            onClick={onClose}
            aria-label="Close"
            autoFocus
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M6 6l12 12m0-12l-12 12"/>
            </svg>
          </button>
          
          <div className="flex-1 overflow-y-auto h-[65vh]">
            <h2 className="font-semibold mb-6 text-center text-lg sm:text-xl md:text-2xl">
              AI Summary Suggestions
            </h2>
            
            <button
              className="mb-6 self-center px-5 py-2 rounded bg-primary-100 text-primary-700 font-semibold hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200"
              onClick={onRegenerate}
              disabled={loading}
            >
              Regenerate Suggestions
            </button>
            
            {loading && (
              <div className="text-center py-12 text-lg">Loading...</div>
            )}
            
            {error && (
              <div className="text-red-500 text-center py-6">{error}</div>
            )}
            
            {summaries && (
              <div className="space-y-4 sm:space-y-6">
                {(['professional','creative','friendly','technical'] as const).map(style => (
                  <div 
                    key={style} 
                    className={`border rounded-lg p-3 sm:p-5 md:p-8 bg-slate-50 ${
                      currentSummary === summaries[style] ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                    }`}
                    aria-selected={currentSummary === summaries[style]}
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        onSelectSummary(summaries[style]);
                        onClose();
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium capitalize text-base">{style}</span>
                      <div className="flex gap-2">
                        <button
                          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200 ${
                            currentSummary === summaries[style] ? 'ring-2 ring-primary-400' : ''
                          }`}
                          onClick={() => {
                            onSelectSummary(summaries[style]);
                            onClose();
                          }}
                          aria-label={`Use ${style} summary`}
                        >
                          Use
                        </button>
                        <button
                          className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors duration-200"
                          onClick={() => navigator.clipboard.writeText(summaries[style])}
                          aria-label={`Copy ${style} summary`}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="text-base whitespace-pre-line leading-relaxed">
                      {summaries[style]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 