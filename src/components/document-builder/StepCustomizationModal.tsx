'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DocumentType, StepConfig, DocumentStructure } from '@/types';
import { StepConfigurationManager } from '@/lib/step-configuration';

interface StepCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType;
  currentSteps: StepConfig[];
  onStepsChange: (steps: StepConfig[]) => void;
}

interface StepToggleProps {
  step: StepConfig;
  isEnabled: boolean;
  isRequired: boolean;
  onToggle: (enabled: boolean) => void;
  canToggle: boolean;
}

const StepToggle: React.FC<StepToggleProps> = ({
  step,
  isEnabled,
  isRequired,
  onToggle,
  canToggle
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{step.icon}</div>
        <div>
          <h4 className="font-medium text-gray-900">{step.title}</h4>
          <p className="text-sm text-gray-600">{step.description}</p>
          {isRequired && (
            <Badge className="mt-1 bg-gray-100 text-gray-700">
              Required
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {!isRequired && (
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            disabled={!canToggle}
          />
        )}
                 {isRequired && (
           <Badge className="text-gray-500 border border-gray-300 bg-transparent">
             Always included
           </Badge>
         )}
      </div>
    </div>
  );
};

export const StepCustomizationModal: React.FC<StepCustomizationModalProps> = ({
  isOpen,
  onClose,
  documentType,
  currentSteps,
  onStepsChange
}) => {
  const [availableSteps, setAvailableSteps] = useState<StepConfig[]>([]);
  const [enabledSteps, setEnabledSteps] = useState<Set<number>>(new Set());
  const [stepOrder, setStepOrder] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      const config = StepConfigurationManager.getConfiguration(documentType);
      const allSteps = config.steps;
      
      // Initialize enabled steps from current configuration
      const enabled = new Set(currentSteps.map(step => step.id));
      setEnabledSteps(enabled);
      
      // Set available steps (all steps for this document type)
      setAvailableSteps(allSteps);
      
      // Initialize step order
      setStepOrder(currentSteps.map(step => step.id));
    }
  }, [isOpen, documentType, currentSteps]);

  const handleStepToggle = (stepId: number, enabled: boolean) => {
    const newEnabledSteps = new Set(enabledSteps);
    
    if (enabled) {
      newEnabledSteps.add(stepId);
    } else {
      newEnabledSteps.delete(stepId);
    }
    
    setEnabledSteps(newEnabledSteps);
  };

  const handleSave = () => {
    // Create new step configuration based on enabled steps and order
    const newSteps = stepOrder
      .filter(stepId => enabledSteps.has(stepId))
      .map(stepId => availableSteps.find(step => step.id === stepId)!)
      .filter(Boolean);
    
    onStepsChange(newSteps);
    onClose();
  };

  const handleReset = () => {
    const config = StepConfigurationManager.getConfiguration(documentType);
    setEnabledSteps(new Set(config.steps.map(step => step.id)));
    setStepOrder(config.steps.map(step => step.id));
  };

  const moveStepUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...stepOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setStepOrder(newOrder);
    }
  };

  const moveStepDown = (index: number) => {
    if (index < stepOrder.length - 1) {
      const newOrder = [...stepOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setStepOrder(newOrder);
    }
  };

  const isStepRequired = (stepId: number) => {
    return StepConfigurationManager.isStepRequired(documentType, stepId);
  };

  const canToggleStep = (stepId: number) => {
    // Check if toggling this step would break dependencies
    const dependencies = StepConfigurationManager.getStepDependencies(documentType, stepId);
    return dependencies.every(dep => enabledSteps.has(dep));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customize Steps
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Step Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Steps</h3>
              <div className="space-y-3">
                {availableSteps.map((step) => {
                  const isRequired = isStepRequired(step.id);
                  const isEnabled = enabledSteps.has(step.id);
                  const canToggle = canToggleStep(step.id);
                  
                  return (
                    <StepToggle
                      key={step.id}
                      step={step}
                      isEnabled={isEnabled}
                      isRequired={isRequired}
                      onToggle={(enabled) => handleStepToggle(step.id, enabled)}
                      canToggle={canToggle}
                    />
                  );
                })}
              </div>
            </div>

            {/* Step Ordering */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Step Order</h3>
              <div className="space-y-2">
                {stepOrder
                  .filter(stepId => enabledSteps.has(stepId))
                  .map((stepId, index) => {
                    const step = availableSteps.find(s => s.id === stepId);
                    if (!step) return null;
                    
                    return (
                      <div
                        key={stepId}
                        className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-500 w-8">
                            {index + 1}
                          </span>
                          <span className="text-xl">{step.icon}</span>
                          <span className="font-medium">{step.title}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveStepUp(index)}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveStepDown(index)}
                            disabled={index === stepOrder.filter(id => enabledSteps.has(id)).length - 1}
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Reset to Default
              </Button>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 