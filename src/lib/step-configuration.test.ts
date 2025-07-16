import { DocumentType } from '@/types';
import { 
  StepConfigurationManager, 
  STEP_CONFIGURATIONS, 
  STEP_VALIDATION_RULES,
  DEFAULT_STEP_CONFIGURATION 
} from './step-configuration';

describe('Step Configuration System', () => {
  describe('STEP_CONFIGURATIONS', () => {
    it('should have correct step counts for each document type', () => {
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].steps).toHaveLength(5);
      expect(STEP_CONFIGURATIONS[DocumentType.CV].steps).toHaveLength(9);
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA].steps).toHaveLength(8);
    });

    it('should have correct max and min steps for each document type', () => {
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].maxSteps).toBe(5);
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].minSteps).toBe(5);
      
      expect(STEP_CONFIGURATIONS[DocumentType.CV].maxSteps).toBe(9);
      expect(STEP_CONFIGURATIONS[DocumentType.CV].minSteps).toBe(9);
      
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA].maxSteps).toBe(8);
      expect(STEP_CONFIGURATIONS[DocumentType.BIODATA].minSteps).toBe(6);
    });

    it('should have PersonalInfoStep as first step for Resume', () => {
      expect(STEP_CONFIGURATIONS[DocumentType.RESUME].steps[0].component).toBe('PersonalInfoStep');
    });

    it('should have correct step components for Resume', () => {
      const resumeSteps = STEP_CONFIGURATIONS[DocumentType.RESUME].steps;
      expect(resumeSteps[0].component).toBe('PersonalInfoStep');
      expect(resumeSteps[1].component).toBe('ExperienceStep');
      expect(resumeSteps[2].component).toBe('EducationStep');
      expect(resumeSteps[3].component).toBe('SkillsStep');
      expect(resumeSteps[4].component).toBe('ReviewStep');
    });

    it('should have correct step components for CV', () => {
      const cvSteps = STEP_CONFIGURATIONS[DocumentType.CV].steps;
      expect(cvSteps[0].component).toBe('TemplateSelector');
      expect(cvSteps[1].component).toBe('PersonalInfoStep');
      expect(cvSteps[2].component).toBe('ExperienceStep');
      expect(cvSteps[3].component).toBe('EducationStep');
      expect(cvSteps[4].component).toBe('SkillsStep');
      expect(cvSteps[5].component).toBe('PublicationsStep');
      expect(cvSteps[6].component).toBe('ResearchStep');
      expect(cvSteps[7].component).toBe('AwardsStep');
      expect(cvSteps[8].component).toBe('ReviewStep');
    });

    it('should have correct step components for Biodata', () => {
      const biodataSteps = STEP_CONFIGURATIONS[DocumentType.BIODATA].steps;
      expect(biodataSteps[0].component).toBe('TemplateSelector');
      expect(biodataSteps[1].component).toBe('PersonalInfoStep');
      expect(biodataSteps[2].component).toBe('ExperienceStep');
      expect(biodataSteps[3].component).toBe('EducationStep');
      expect(biodataSteps[4].component).toBe('SkillsStep');
      expect(biodataSteps[5].component).toBe('PersonalDetailsStep');
      expect(biodataSteps[6].component).toBe('LanguagesStep');
      expect(biodataSteps[7].component).toBe('ReviewStep');
    });
  });

  describe('STEP_VALIDATION_RULES', () => {
    it('should have correct number of validation rules for each document type', () => {
      expect(STEP_VALIDATION_RULES[DocumentType.RESUME]).toHaveLength(5);
      expect(STEP_VALIDATION_RULES[DocumentType.CV]).toHaveLength(9);
      expect(STEP_VALIDATION_RULES[DocumentType.BIODATA]).toHaveLength(8);
    });

    it('should have TemplateSelector as required for all document types', () => {
      expect(STEP_VALIDATION_RULES[DocumentType.RESUME][0].stepId).toBe(1);
      expect(STEP_VALIDATION_RULES[DocumentType.RESUME][0].required).toBe(true);
      expect(STEP_VALIDATION_RULES[DocumentType.CV][0].stepId).toBe(1);
      expect(STEP_VALIDATION_RULES[DocumentType.CV][0].required).toBe(true);
      expect(STEP_VALIDATION_RULES[DocumentType.BIODATA][0].stepId).toBe(1);
      expect(STEP_VALIDATION_RULES[DocumentType.BIODATA][0].required).toBe(true);
    });

    it('should have correct dependencies for Resume', () => {
      const resumeRules = STEP_VALIDATION_RULES[DocumentType.RESUME];
      expect(resumeRules[1].dependencies).toEqual([1]); // Experience depends on PersonalInfo
      expect(resumeRules[2].dependencies).toEqual([1]); // Education depends on PersonalInfo
      expect(resumeRules[3].dependencies).toEqual([1]); // Skills depends on PersonalInfo
      expect(resumeRules[4].dependencies).toEqual([1, 2, 3, 4]); // Review depends on all previous
    });

    it('should have correct dependencies for CV', () => {
      const cvRules = STEP_VALIDATION_RULES[DocumentType.CV];
      expect(cvRules[1].dependencies).toEqual([1]); // PersonalInfo depends on TemplateSelector
      expect(cvRules[2].dependencies).toEqual([1]); // Experience depends on TemplateSelector
      expect(cvRules[3].dependencies).toEqual([1]); // Education depends on TemplateSelector
      expect(cvRules[4].dependencies).toEqual([1]); // Skills depends on TemplateSelector
      expect(cvRules[5].dependencies).toEqual([1, 2, 3, 4, 5]); // Publications depends on all previous
      expect(cvRules[6].dependencies).toEqual([1, 2, 3, 4, 5, 6]); // Research depends on all previous
      expect(cvRules[7].dependencies).toEqual([1, 2, 3, 4, 5, 6, 7]); // Awards depends on all previous
      expect(cvRules[8].dependencies).toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // Review depends on all previous
    });

    it('should have correct dependencies for Biodata', () => {
      const biodataRules = STEP_VALIDATION_RULES[DocumentType.BIODATA];
      expect(biodataRules[1].dependencies).toEqual([1]); // PersonalInfo depends on TemplateSelector
      expect(biodataRules[2].dependencies).toEqual([1]); // Experience depends on TemplateSelector
      expect(biodataRules[3].dependencies).toEqual([1]); // Education depends on TemplateSelector
      expect(biodataRules[4].dependencies).toEqual([1]); // Skills depends on TemplateSelector
      expect(biodataRules[5].dependencies).toEqual([1]); // Personal Details depends on TemplateSelector
      expect(biodataRules[6].dependencies).toEqual([1]); // Languages depends on TemplateSelector
      expect(biodataRules[7].dependencies).toEqual([1, 2, 4, 6, 7]); // Review depends on required steps
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
        expect(config.steps).toHaveLength(9);
      });

      it('should return correct configuration for Biodata', () => {
        const config = StepConfigurationManager.getConfiguration(DocumentType.BIODATA);
        expect(config.documentType).toBe(DocumentType.BIODATA);
        expect(config.steps).toHaveLength(8);
      });
    });

    describe('getStepConfig', () => {
      it('should return correct step config for valid step ID', () => {
        const config = StepConfigurationManager.getConfiguration(DocumentType.RESUME);
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
        expect(rules).toHaveLength(9);
        expect(rules.every(rule => rule.required)).toBe(true);
      });

      it('should return validation rules for Biodata', () => {
        const rules = StepConfigurationManager.getValidationRules(DocumentType.BIODATA);
        expect(rules).toHaveLength(8);
        expect(rules.some(rule => !rule.required)).toBe(true);
      });
    });

    describe('isStepRequired', () => {
      it('should return true for required steps', () => {
        expect(StepConfigurationManager.isStepRequired(DocumentType.RESUME, 1)).toBe(true);
        expect(StepConfigurationManager.isStepRequired(DocumentType.RESUME, 2)).toBe(true);
        expect(StepConfigurationManager.isStepRequired(DocumentType.RESUME, 5)).toBe(true);
      });

      it('should return false for optional steps', () => {
        expect(StepConfigurationManager.isStepRequired(DocumentType.BIODATA, 3)).toBe(false);
        expect(StepConfigurationManager.isStepRequired(DocumentType.BIODATA, 5)).toBe(false);
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
        expect(StepConfigurationManager.canAccessStep(DocumentType.RESUME, 1, [])).toBe(true);
      });

      it('should return true when dependencies are met', () => {
        expect(StepConfigurationManager.canAccessStep(DocumentType.RESUME, 2, [1])).toBe(true);
      });

      it('should return false when dependencies are not met', () => {
        expect(StepConfigurationManager.canAccessStep(DocumentType.RESUME, 2, [])).toBe(false);
      });
    });

    describe('getNextStep', () => {
      it('should return next step when available', () => {
        const nextStep = StepConfigurationManager.getNextStep(DocumentType.RESUME, 1, [1]);
        expect(nextStep).toBe(2);
      });

      it('should return null for last step', () => {
        expect(StepConfigurationManager.getNextStep(DocumentType.RESUME, 5, [1, 2, 3, 4, 5])).toBeNull();
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
        expect(requiredSteps).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });

      it('should return only required steps for Biodata', () => {
        const requiredSteps = StepConfigurationManager.getRequiredSteps(DocumentType.BIODATA);
        expect(requiredSteps).toEqual([1, 2, 4, 6, 7, 8]);
      });
    });

    describe('getOptionalSteps', () => {
      it('should return empty array for Resume (all required)', () => {
        const optionalSteps = StepConfigurationManager.getOptionalSteps(DocumentType.RESUME);
        expect(optionalSteps).toEqual([]);
      });

      it('should return optional steps for Biodata', () => {
        const optionalSteps = StepConfigurationManager.getOptionalSteps(DocumentType.BIODATA);
        expect(optionalSteps).toEqual([3, 5]);
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
        const result = StepConfigurationManager.validateStepCompletion(DocumentType.BIODATA, [1, 2, 4, 6, 7, 8]);
        expect(result.isValid).toBe(true);
        expect(result.missingRequired).toEqual([]);
        expect(result.missingOptional).toEqual([3, 5]);
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

    describe('isLastStep', () => {
      it('should return true for last step', () => {
        expect(StepConfigurationManager.isLastStep(DocumentType.RESUME, 5)).toBe(true);
        expect(StepConfigurationManager.isLastStep(DocumentType.CV, 9)).toBe(true);
        expect(StepConfigurationManager.isLastStep(DocumentType.BIODATA, 8)).toBe(true);
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
        expect(StepConfigurationManager.isFirstStep(DocumentType.RESUME, 6)).toBe(false);
      });
    });
  });

  describe('DEFAULT_STEP_CONFIGURATION', () => {
    it('should be the same as Resume configuration', () => {
      expect(DEFAULT_STEP_CONFIGURATION).toEqual(STEP_CONFIGURATIONS[DocumentType.RESUME]);
    });
  });
}); 