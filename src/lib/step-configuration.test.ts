import { DocumentType } from '@/types';
import { 
  StepConfigurationManager, 
  STEP_CONFIGURATIONS, 
  STEP_VALIDATION_RULES,
  DEFAULT_STEP_CONFIGURATION 
} from './step-configuration';

describe('Step Configuration System', () => {
  describe('STEP_CONFIGURATIONS', () => {
    it('should have configurations for all document types', () => {
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME]).toBeDefined();
      expect(STEP_CONFIGURATIONS[DocumentType.CV]).toBeDefined();
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA]).toBeDefined();
    });

    it('should have correct step counts for each document type', () => {
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].steps).toHaveLength(5);
      expect(STEP_CONFIGURATIONS[DocumentType.CV].steps).toHaveLength(6);
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA].steps).toHaveLength(6);
    });

    it('should have correct max and min steps for each document type', () => {
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].maxSteps).toBe(5);
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].minSteps).toBe(5);
      
      expect(STEP_CONFIGURATIONS[DocumentType.CV].maxSteps).toBe(6);
      expect(STEP_CONFIGURATIONS[DocumentType.CV].minSteps).toBe(6);
      
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA].maxSteps).toBe(6);
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA].minSteps).toBe(4);
    });

    it('should have unique step IDs within each configuration', () => {
      Object.values(STEP_CONFIGURATIONS).forEach(config => {
        const stepIds = config.steps.map(step => step.id);
        const uniqueIds = new Set(stepIds);
        expect(uniqueIds.size).toBe(stepIds.length);
      });
    });

    it('should have required components for all steps', () => {
      Object.values(STEP_CONFIGURATIONS).forEach(config => {
        config.steps.forEach(step => {
          expect(step.component).toBeDefined();
          expect(step.component).not.toBe('');
        });
      });
    });
  });

  describe('STEP_VALIDATION_RULES', () => {
    it('should have validation rules for all document types', () => {
      expect(STEP_VALIDATION_RULES[DocumentType.RESUME]).toBeDefined();
      expect(STEP_VALIDATION_RULES[DocumentType.CV]).toBeDefined();
      expect(STEP_VALIDATION_RULES[DocumentType.BIODATA]).toBeDefined();
    });

    it('should have correct number of validation rules for each document type', () => {
      expect(STEP_VALIDATION_RULES[DocumentType.RESUME]).toHaveLength(5);
      expect(STEP_VALIDATION_RULES[DocumentType.CV]).toHaveLength(6);
      expect(STEP_VALIDATION_RULES[DocumentType.BIODATA]).toHaveLength(6);
    });

    it('should have all steps marked as required for Resume', () => {
      STEP_VALIDATION_RULES[DocumentType.RESUME].forEach(rule => {
        expect(rule.required).toBe(true);
      });
    });

    it('should have all steps marked as required for CV', () => {
      STEP_VALIDATION_RULES[DocumentType.CV].forEach(rule => {
        expect(rule.required).toBe(true);
      });
    });

    it('should have some optional steps for Biodata', () => {
      const biodataRules = STEP_VALIDATION_RULES[DocumentType.BIODATA];
      const optionalSteps = biodataRules.filter(rule => !rule.required);
      expect(optionalSteps.length).toBeGreaterThan(0);
    });
  });

  describe('StepConfigurationManager', () => {
    describe('getConfiguration', () => {
      it('should return correct configuration for Resume', () => {
        const config = StepConfigurationManager.getConfiguration(DocumentType.RESUME);
        expect(config.documentType).toBe(DocumentType.RESUME);
        expect(config.steps).toHaveLength(5);
      });

      it('should return correct configuration for CV', () => {
        const config = StepConfigurationManager.getConfiguration(DocumentType.CV);
        expect(config.documentType).toBe(DocumentType.CV);
        expect(config.steps).toHaveLength(6);
      });

      it('should return correct configuration for Biodata', () => {
        const config = StepConfigurationManager.getConfiguration(DocumentType.BIODATA);
        expect(config.documentType).toBe(DocumentType.BIODATA);
        expect(config.steps).toHaveLength(6);
      });
    });

    describe('getAvailableDocumentTypes', () => {
      it('should return all document types', () => {
        const types = StepConfigurationManager.getAvailableDocumentTypes();
        expect(types).toContain(DocumentType.RESUME);
        expect(types).toContain(DocumentType.CV);
        expect(types).toContain(DocumentType.BIODATA);
        expect(types).toHaveLength(3);
      });
    });

    describe('getStepConfig', () => {
      it('should return correct step config for valid step ID', () => {
        const stepConfig = StepConfigurationManager.getStepConfig(DocumentType.RESUME, 1);
        expect(stepConfig).toBeDefined();
        expect(stepConfig?.id).toBe(1);
        expect(stepConfig?.title).toBe('Personal Info');
      });

      it('should return undefined for invalid step ID', () => {
        const stepConfig = StepConfigurationManager.getStepConfig(DocumentType.RESUME, 999);
        expect(stepConfig).toBeUndefined();
      });
    });

    describe('getValidationRules', () => {
      it('should return validation rules for Resume', () => {
        const rules = StepConfigurationManager.getValidationRules(DocumentType.RESUME);
        expect(rules).toHaveLength(5);
        expect(rules.every(rule => rule.required)).toBe(true);
      });

      it('should return validation rules for CV', () => {
        const rules = StepConfigurationManager.getValidationRules(DocumentType.CV);
        expect(rules).toHaveLength(6);
        expect(rules.every(rule => rule.required)).toBe(true);
      });

      it('should return validation rules for Biodata', () => {
        const rules = StepConfigurationManager.getValidationRules(DocumentType.BIODATA);
        expect(rules).toHaveLength(6);
        expect(rules.some(rule => !rule.required)).toBe(true);
      });
    });

    describe('isStepRequired', () => {
      it('should return true for required steps', () => {
        expect(StepConfigurationManager.isStepRequired(DocumentType.RESUME, 1)).toBe(true);
        expect(StepConfigurationManager.isStepRequired(DocumentType.CV, 1)).toBe(true);
        expect(StepConfigurationManager.isStepRequired(DocumentType.BIODATA, 1)).toBe(true);
      });

      it('should return false for optional steps', () => {
        expect(StepConfigurationManager.isStepRequired(DocumentType.BIODATA, 2)).toBe(false);
        expect(StepConfigurationManager.isStepRequired(DocumentType.BIODATA, 4)).toBe(false);
      });
    });

    describe('getStepDependencies', () => {
      it('should return empty array for first step', () => {
        const dependencies = StepConfigurationManager.getStepDependencies(DocumentType.RESUME, 1);
        expect(dependencies).toEqual([]);
      });

      it('should return correct dependencies for later steps', () => {
        const dependencies = StepConfigurationManager.getStepDependencies(DocumentType.RESUME, 5);
        expect(dependencies).toEqual([1, 2, 3, 4]);
      });
    });

    describe('canAccessStep', () => {
      it('should return true for first step', () => {
        const canAccess = StepConfigurationManager.canAccessStep(DocumentType.RESUME, 1, []);
        expect(canAccess).toBe(true);
      });

      it('should return true when dependencies are met', () => {
        const canAccess = StepConfigurationManager.canAccessStep(DocumentType.RESUME, 2, [1]);
        expect(canAccess).toBe(true);
      });

      it('should return false when dependencies are not met', () => {
        const canAccess = StepConfigurationManager.canAccessStep(DocumentType.RESUME, 2, []);
        expect(canAccess).toBe(false);
      });
    });

    describe('getNextStep', () => {
      it('should return next step when available', () => {
        const nextStep = StepConfigurationManager.getNextStep(DocumentType.RESUME, 1, [1]);
        expect(nextStep).toBe(2);
      });

      it('should return null for last step', () => {
        const nextStep = StepConfigurationManager.getNextStep(DocumentType.RESUME, 5, [1, 2, 3, 4, 5]);
        expect(nextStep).toBeNull();
      });

      it('should return null when dependencies are not met', () => {
        const nextStep = StepConfigurationManager.getNextStep(DocumentType.RESUME, 1, []);
        expect(nextStep).toBeNull();
      });
    });

    describe('getPreviousStep', () => {
      it('should return previous step when available', () => {
        const prevStep = StepConfigurationManager.getPreviousStep(DocumentType.RESUME, 2);
        expect(prevStep).toBe(1);
      });

      it('should return null for first step', () => {
        const prevStep = StepConfigurationManager.getPreviousStep(DocumentType.RESUME, 1);
        expect(prevStep).toBeNull();
      });
    });

    describe('getRequiredSteps', () => {
      it('should return all required steps for Resume', () => {
        const requiredSteps = StepConfigurationManager.getRequiredSteps(DocumentType.RESUME);
        expect(requiredSteps).toEqual([1, 2, 3, 4, 5]);
      });

      it('should return all required steps for CV', () => {
        const requiredSteps = StepConfigurationManager.getRequiredSteps(DocumentType.CV);
        expect(requiredSteps).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should return only required steps for Biodata', () => {
        const requiredSteps = StepConfigurationManager.getRequiredSteps(DocumentType.BIODATA);
        expect(requiredSteps).toEqual([1, 3, 5, 6]);
      });
    });

    describe('getOptionalSteps', () => {
      it('should return empty array for Resume', () => {
        const optionalSteps = StepConfigurationManager.getOptionalSteps(DocumentType.RESUME);
        expect(optionalSteps).toEqual([]);
      });

      it('should return empty array for CV', () => {
        const optionalSteps = StepConfigurationManager.getOptionalSteps(DocumentType.CV);
        expect(optionalSteps).toEqual([]);
      });

      it('should return optional steps for Biodata', () => {
        const optionalSteps = StepConfigurationManager.getOptionalSteps(DocumentType.BIODATA);
        expect(optionalSteps).toEqual([2, 4]);
      });
    });

    describe('validateStepCompletion', () => {
      it('should return valid when all required steps are completed', () => {
        const result = StepConfigurationManager.validateStepCompletion(DocumentType.RESUME, [1, 2, 3, 4, 5]);
        expect(result.isValid).toBe(true);
        expect(result.missingRequired).toEqual([]);
      });

      it('should return invalid when required steps are missing', () => {
        const result = StepConfigurationManager.validateStepCompletion(DocumentType.RESUME, [1, 2, 3]);
        expect(result.isValid).toBe(false);
        expect(result.missingRequired).toEqual([4, 5]);
      });

      it('should handle optional steps correctly for Biodata', () => {
        const result = StepConfigurationManager.validateStepCompletion(DocumentType.BIODATA, [1, 3, 5, 6]);
        expect(result.isValid).toBe(true);
        expect(result.missingRequired).toEqual([]);
        expect(result.missingOptional).toEqual([2, 4]);
      });
    });

    describe('getCompletionPercentage', () => {
      it('should return 100% when all steps are completed', () => {
        const percentage = StepConfigurationManager.getCompletionPercentage(DocumentType.RESUME, [1, 2, 3, 4, 5]);
        expect(percentage).toBe(100);
      });

      it('should return 60% when 3 out of 5 steps are completed', () => {
        const percentage = StepConfigurationManager.getCompletionPercentage(DocumentType.RESUME, [1, 2, 3]);
        expect(percentage).toBe(60);
      });

      it('should return 0% when no steps are completed', () => {
        const percentage = StepConfigurationManager.getCompletionPercentage(DocumentType.RESUME, []);
        expect(percentage).toBe(0);
      });
    });

    describe('getStepByComponent', () => {
      it('should return step config for valid component name', () => {
        const stepConfig = StepConfigurationManager.getStepByComponent(DocumentType.RESUME, 'PersonalInfoStep');
        expect(stepConfig).toBeDefined();
        expect(stepConfig?.component).toBe('PersonalInfoStep');
      });

      it('should return undefined for invalid component name', () => {
        const stepConfig = StepConfigurationManager.getStepByComponent(DocumentType.RESUME, 'InvalidComponent');
        expect(stepConfig).toBeUndefined();
      });
    });

    describe('isLastStep', () => {
      it('should return true for last step', () => {
        expect(StepConfigurationManager.isLastStep(DocumentType.RESUME, 5)).toBe(true);
        expect(StepConfigurationManager.isLastStep(DocumentType.CV, 6)).toBe(true);
        expect(StepConfigurationManager.isLastStep(DocumentType.BIODATA, 6)).toBe(true);
      });

      it('should return false for non-last steps', () => {
        expect(StepConfigurationManager.isLastStep(DocumentType.RESUME, 1)).toBe(false);
        expect(StepConfigurationManager.isLastStep(DocumentType.RESUME, 3)).toBe(false);
      });
    });

    describe('isFirstStep', () => {
      it('should return true for first step', () => {
        expect(StepConfigurationManager.isFirstStep(DocumentType.RESUME, 1)).toBe(true);
        expect(StepConfigurationManager.isFirstStep(DocumentType.CV, 1)).toBe(true);
        expect(StepConfigurationManager.isFirstStep(DocumentType.BIODATA, 1)).toBe(true);
      });

      it('should return false for non-first steps', () => {
        expect(StepConfigurationManager.isFirstStep(DocumentType.RESUME, 2)).toBe(false);
        expect(StepConfigurationManager.isFirstStep(DocumentType.RESUME, 5)).toBe(false);
      });
    });
  });

  describe('DEFAULT_STEP_CONFIGURATION', () => {
    it('should be the same as Resume configuration', () => {
      expect(DEFAULT_STEP_CONFIGURATION).toEqual(STEP_CONFIGURATIONS[DocumentType.RESUME]);
    });
  });
}); 