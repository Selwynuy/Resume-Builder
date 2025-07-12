import React from 'react';

import { STEPS, StepConfig } from '@/components/resume-builder/types'

interface ProgressBarProps {
  currentStep: number
  onStepClick: (step: number) => void
  steps?: StepConfig[]
}

export const ProgressBar = ({ currentStep, onStepClick, steps = STEPS }: ProgressBarProps) => {
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 1 ? Math.min(((currentStep - 1) / (totalSteps - 1)) * 80, 80) : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-center mb-4">
        <div className="relative flex items-center">
          {/* Background line */}
          <div className="absolute left-5 right-5 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
          
          {/* Progress line */}
          <div 
            className="absolute left-5 h-0.5 bg-primary-600 top-1/2 transform -translate-y-1/2 transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`
            }}
          ></div>
          
          {/* Step circles */}
          <div className="relative flex items-center space-x-16">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm relative z-10 transition-all duration-300 cursor-pointer group
                  ${currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white hover:bg-primary-700 hover:border-primary-700' 
                    : currentStep === step.id - 1
                    ? 'bg-primary-100 border-primary-300 text-primary-600 hover:bg-primary-200 hover:border-primary-400'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-600'
                  }
                `}
                title={`Go to ${step.title}`}
              >
                {currentStep > step.id ? '✓' : step.id}
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {steps[currentStep - 1]?.icon} {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-slate-600">{steps[currentStep - 1]?.description}</p>
      </div>
    </div>
  )
} 