import React from 'react';

interface CompletionStatusProps {
  completionPercentage: number;
}

export const CompletionStatus = ({ completionPercentage }: CompletionStatusProps) => {
  const getStatusMessage = () => {
    if (completionPercentage >= 80) {
      return "Excellent! Your resume is ready to export.";
    } else if (completionPercentage >= 60) {
      return "Good progress! Consider adding more details.";
    } else {
      return "Add more information to improve your resume.";
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-green-800">Resume Completion</h4>
        <span className="text-2xl text-green-600 font-bold">{completionPercentage}%</span>
      </div>
      <div className="w-full bg-green-200 rounded-full h-3 mb-3">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-green-700 text-sm">{getStatusMessage()}</p>
    </div>
  );
}; 