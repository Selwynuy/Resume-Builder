
interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (type: string) => void;
  onRegenerate: () => void;
  aiLoading: boolean;
  aiError: string;
  aiResult: string;
}

// Utility to parse feedback into sections
function parseFeedback(feedbackText: string) {
  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;
  feedbackText.split('\n').forEach(line => {
    const sectionMatch = line.match(/^([A-Za-z ]+):$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      sections[currentSection] = [];
    } else if (currentSection && line.trim()) {
      sections[currentSection].push(line.trim());
    }
  });
  return sections;
}

// FeedbackDisplay component
function FeedbackDisplay({ feedback }: { feedback: string }) {
  const sections = parseFeedback(feedback);
  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([section, points]) => (
        <div key={section} className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold text-primary-700 mb-2">{section}</h4>
          <ul className="space-y-1">
            {points.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">{point.slice(0, 2)}</span>
                <span>{point.slice(2).trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export const AIFeedbackModal = ({ 
  isOpen, 
  onClose, 
  onOpen, 
  onRegenerate, 
  aiLoading, 
  aiError, 
  aiResult 
}: AIFeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold">AI Resume Feedback</h3>
            <p className="text-gray-600">Get personalized suggestions to improve your resume</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {aiLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Generating feedback...</span>
            </div>
          ) : aiError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Generating Feedback</h3>
              <p className="text-gray-600 mb-6">{aiError}</p>
              <button
                onClick={onRegenerate}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : aiResult ? (
            <div>
              <FeedbackDisplay feedback={aiResult} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Resume Feedback</h3>
              <p className="text-gray-600 mb-6">
                Get personalized suggestions to improve your resume content, structure, and impact.
              </p>
              <button
                onClick={() => onOpen('feedback')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Generate Feedback
              </button>
            </div>
          )}
        </div>
        
        {aiResult && !aiLoading && (
          <div className="p-6 border-t bg-gray-50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                💡 Use this feedback to improve your resume and increase your chances of getting hired.
              </p>
              <button
                onClick={onRegenerate}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 