import { DocumentType, StepConfig, DocumentStructure } from '@/types';

// Predefined step configurations for each document type
export const STEP_CONFIGURATIONS: Record<DocumentType, DocumentStructure> = {
  [DocumentType.RESUME]: {
    documentType: DocumentType.RESUME,
    steps: [
      { id: 1, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself', required: true, component: 'PersonalInfoStep' },
      { id: 2, title: 'Work Experience', icon: '💼', description: 'Add your work history', required: true, component: 'ExperienceStep' },
      { id: 3, title: 'Education', icon: '🎓', description: 'Add your education', required: true, component: 'EducationStep' },
      { id: 4, title: 'Skills', icon: '⚡', description: 'Showcase your abilities', required: true, component: 'SkillsStep' },
      { id: 5, title: 'Review', icon: '✨', description: 'Finalize your resume', required: true, component: 'ReviewStep' }
    ],
    maxSteps: 5,
    minSteps: 5
  },
  [DocumentType.CV]: {
    documentType: DocumentType.CV,
    steps: [
      { id: 1, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself', required: true, component: 'PersonalInfoStep' },
      { id: 2, title: 'Work Experience', icon: '💼', description: 'Add your work history', required: true, component: 'ExperienceStep' },
      { id: 3, title: 'Education', icon: '🎓', description: 'Add your education', required: true, component: 'EducationStep' },
      { id: 4, title: 'Skills', icon: '⚡', description: 'Showcase your abilities', required: true, component: 'SkillsStep' },
      { id: 5, title: 'CV Details', icon: '📋', description: 'Add academic and research credentials', required: true, component: 'CVStep' },
      { id: 6, title: 'Review', icon: '✨', description: 'Finalize your CV', required: true, component: 'ReviewStep' }
    ],
    maxSteps: 6,
    minSteps: 6
  },
  [DocumentType.BIODATA]: {
    documentType: DocumentType.BIODATA,
    steps: [
      { id: 1, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself', required: true, component: 'PersonalInfoStep' },
      { id: 2, title: 'Work Experience', icon: '💼', description: 'Add your work history', required: false, component: 'ExperienceStep' },
      { id: 3, title: 'Education', icon: '🎓', description: 'Add your education', required: true, component: 'EducationStep' },
      { id: 4, title: 'Skills', icon: '⚡', description: 'Showcase your abilities', required: false, component: 'SkillsStep' },
      { id: 5, title: 'Biodata Details', icon: '👤', description: 'Add personal and family information', required: true, component: 'BiodataStep' },
      { id: 6, title: 'Review', icon: '✨', description: 'Finalize your biodata', required: true, component: 'ReviewStep' }
    ],
    maxSteps: 6,
    minSteps: 4 // Personal Info, Education, Biodata Details, Review are required
  }
};

// Step validation rules
export interface StepValidationRule {
  stepId: number;
  required: boolean;
  dependencies?: number[]; // IDs of steps that must be completed first
  conditions?: (data: any) => boolean; // Custom validation conditions
}

export const STEP_VALIDATION_RULES: Record<DocumentType, StepValidationRule[]> = {
  [DocumentType.RESUME]: [
    { stepId: 1, required: true },
    { stepId: 2, required: true, dependencies: [1] },
    { stepId: 3, required: true, dependencies: [1] },
    { stepId: 4, required: true, dependencies: [1] },
    { stepId: 5, required: true, dependencies: [1, 2, 3, 4] }
  ],
  [DocumentType.CV]: [
    { stepId: 1, required: true },
    { stepId: 2, required: true, dependencies: [1] },
    { stepId: 3, required: true, dependencies: [1] },
    { stepId: 4, required: true, dependencies: [1] },
    { stepId: 5, required: true, dependencies: [1, 2, 3, 4] },
    { stepId: 6, required: true, dependencies: [1, 2, 3, 4, 5] }
  ],
  [DocumentType.BIODATA]: [
    { stepId: 1, required: true },
    { stepId: 2, required: false, dependencies: [1] },
    { stepId: 3, required: true, dependencies: [1] },
    { stepId: 4, required: false, dependencies: [1] },
    { stepId: 5, required: true, dependencies: [1] },
    { stepId: 6, required: true, dependencies: [1, 3, 5] }
  ]
};

// Utility functions for step configuration management
export class StepConfigurationManager {
  /**
   * Get step configuration for a specific document type
   */
  static getConfiguration(documentType: DocumentType): DocumentStructure {
    return STEP_CONFIGURATIONS[documentType];
  }

  /**
   * Get all available document types
   */
  static getAvailableDocumentTypes(): DocumentType[] {
    return Object.values(DocumentType);
  }

  /**
   * Get step configuration for a specific step
   */
  static getStepConfig(documentType: DocumentType, stepId: number): StepConfig | undefined {
    const config = this.getConfiguration(documentType);
    return config.steps.find(step => step.id === stepId);
  }

  /**
   * Get validation rules for a document type
   */
  static getValidationRules(documentType: DocumentType): StepValidationRule[] {
    return STEP_VALIDATION_RULES[documentType];
  }

  /**
   * Check if a step is required for a document type
   */
  static isStepRequired(documentType: DocumentType, stepId: number): boolean {
    const rules = this.getValidationRules(documentType);
    const rule = rules.find(r => r.stepId === stepId);
    return rule?.required ?? false;
  }

  /**
   * Get step dependencies for a specific step
   */
  static getStepDependencies(documentType: DocumentType, stepId: number): number[] {
    const rules = this.getValidationRules(documentType);
    const rule = rules.find(r => r.stepId === stepId);
    return rule?.dependencies ?? [];
  }

  /**
   * Check if a step can be accessed (dependencies met)
   */
  static canAccessStep(documentType: DocumentType, stepId: number, completedSteps: number[]): boolean {
    const dependencies = this.getStepDependencies(documentType, stepId);
    return dependencies.every(dep => completedSteps.includes(dep));
  }

  /**
   * Get the next available step
   */
  static getNextStep(documentType: DocumentType, currentStep: number, completedSteps: number[]): number | null {
    const config = this.getConfiguration(documentType);
    const currentStepIndex = config.steps.findIndex(step => step.id === currentStep);
    
    for (let i = currentStepIndex + 1; i < config.steps.length; i++) {
      const step = config.steps[i];
      if (this.canAccessStep(documentType, step.id, completedSteps)) {
        return step.id;
      }
    }
    
    return null;
  }

  /**
   * Get the previous step
   */
  static getPreviousStep(documentType: DocumentType, currentStep: number): number | null {
    const config = this.getConfiguration(documentType);
    const currentStepIndex = config.steps.findIndex(step => step.id === currentStep);
    
    if (currentStepIndex > 0) {
      return config.steps[currentStepIndex - 1].id;
    }
    
    return null;
  }

  /**
   * Get required steps for a document type
   */
  static getRequiredSteps(documentType: DocumentType): number[] {
    const rules = this.getValidationRules(documentType);
    return rules.filter(rule => rule.required).map(rule => rule.stepId);
  }

  /**
   * Get optional steps for a document type
   */
  static getOptionalSteps(documentType: DocumentType): number[] {
    const rules = this.getValidationRules(documentType);
    return rules.filter(rule => !rule.required).map(rule => rule.stepId);
  }

  /**
   * Validate step completion for a document type
   */
  static validateStepCompletion(documentType: DocumentType, completedSteps: number[]): {
    isValid: boolean;
    missingRequired: number[];
    missingOptional: number[];
  } {
    const requiredSteps = this.getRequiredSteps(documentType);
    const optionalSteps = this.getOptionalSteps(documentType);
    
    const missingRequired = requiredSteps.filter(step => !completedSteps.includes(step));
    const missingOptional = optionalSteps.filter(step => !completedSteps.includes(step));
    
    return {
      isValid: missingRequired.length === 0,
      missingRequired,
      missingOptional
    };
  }

  /**
   * Get step completion percentage
   */
  static getCompletionPercentage(documentType: DocumentType, completedSteps: number[]): number {
    const config = this.getConfiguration(documentType);
    const totalSteps = config.steps.length;
    const completedCount = completedSteps.length;
    
    return Math.round((completedCount / totalSteps) * 100);
  }

  /**
   * Get step by component name
   */
  static getStepByComponent(documentType: DocumentType, componentName: string): StepConfig | undefined {
    const config = this.getConfiguration(documentType);
    return config.steps.find(step => step.component === componentName);
  }

  /**
   * Check if a step is the last step
   */
  static isLastStep(documentType: DocumentType, stepId: number): boolean {
    const config = this.getConfiguration(documentType);
    const lastStep = config.steps[config.steps.length - 1];
    return lastStep.id === stepId;
  }

  /**
   * Check if a step is the first step
   */
  static isFirstStep(documentType: DocumentType, stepId: number): boolean {
    const config = this.getConfiguration(documentType);
    const firstStep = config.steps[0];
    return firstStep.id === stepId;
  }
}

// Export default configuration for backward compatibility
export const DEFAULT_STEP_CONFIGURATION = STEP_CONFIGURATIONS[DocumentType.RESUME]; 