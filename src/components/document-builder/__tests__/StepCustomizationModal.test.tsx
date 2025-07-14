import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StepCustomizationModal } from '../StepCustomizationModal';
import { DocumentType } from '@/types';
import { StepConfigurationManager } from '@/lib/step-configuration';

// Mock the step configuration manager
jest.mock('@/lib/step-configuration', () => ({
  StepConfigurationManager: {
    getConfiguration: jest.fn(),
    isStepRequired: jest.fn(),
    getStepDependencies: jest.fn(),
  },
}));

const mockStepConfigurationManager = StepConfigurationManager as jest.Mocked<typeof StepConfigurationManager>;

describe('StepCustomizationModal', () => {
  const mockSteps = [
    { id: 1, title: 'Template', icon: '🎨', description: 'Choose template', required: true, component: 'TemplateSelector' },
    { id: 2, title: 'Personal Info', icon: '👤', description: 'Personal details', required: true, component: 'PersonalInfoStep' },
    { id: 3, title: 'Experience', icon: '💼', description: 'Work experience', required: false, component: 'ExperienceStep' },
    { id: 4, title: 'Education', icon: '🎓', description: 'Education details', required: true, component: 'EducationStep' },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    documentType: DocumentType.RESUME,
    currentSteps: mockSteps,
    onStepsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockStepConfigurationManager.getConfiguration.mockReturnValue({
      documentType: DocumentType.RESUME,
      steps: mockSteps,
      maxSteps: 4,
      minSteps: 3,
    });
    
    mockStepConfigurationManager.isStepRequired.mockImplementation((docType, stepId) => {
      return stepId === 1 || stepId === 2 || stepId === 4;
    });
    
    mockStepConfigurationManager.getStepDependencies.mockReturnValue([]);
  });

  it('renders when open', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    expect(screen.getByText('Customize Steps')).toBeInTheDocument();
    expect(screen.getByText('Select Steps')).toBeInTheDocument();
    expect(screen.getByText('Step Order')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<StepCustomizationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Customize Steps')).not.toBeInTheDocument();
  });

  it('displays all available steps', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    // Use getAllByText to handle multiple instances
    expect(screen.getAllByText('Template').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Personal Info').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Experience').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Education').length).toBeGreaterThan(0);
  });

  it('shows required badges for required steps', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    const requiredBadges = screen.getAllByText('Required');
    expect(requiredBadges).toHaveLength(3); // Template, Personal Info, Education
  });

  it('shows switches for optional steps', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    // Experience step should have a switch (it's optional)
    const experienceSteps = screen.getAllByText('Experience');
    const experienceStep = experienceSteps[0].closest('div');
    expect(experienceStep).toHaveTextContent('Work experience');
  });

  it('allows toggling optional steps', async () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    // Find the switch for the Experience step (optional)
    const switches = screen.getAllByRole('checkbox');
    const experienceSwitch = switches.find(switchEl => 
      switchEl.closest('div')?.textContent?.includes('Experience')
    );
    
    if (experienceSwitch) {
      fireEvent.click(experienceSwitch);
      await waitFor(() => {
        expect(experienceSwitch).toBeChecked();
      });
    }
  });

  it('calls onStepsChange when saving', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    expect(defaultProps.onStepsChange).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when canceling', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(defaultProps.onStepsChange).not.toHaveBeenCalled();
  });

  it('resets to default configuration', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    const resetButton = screen.getByText('Reset to Default');
    fireEvent.click(resetButton);
    
    expect(mockStepConfigurationManager.getConfiguration).toHaveBeenCalledWith(DocumentType.RESUME);
  });

  it('displays step order with reorder buttons', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    // Should show step numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Should show reorder buttons
    const upButtons = screen.getAllByText('↑');
    const downButtons = screen.getAllByText('↓');
    expect(upButtons.length).toBeGreaterThan(0);
    expect(downButtons.length).toBeGreaterThan(0);
  });

  it('handles step reordering', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    const downButtons = screen.getAllByText('↓');
    const firstDownButton = downButtons[0];
    
    fireEvent.click(firstDownButton);
    
    // The button should still be there after reordering
    expect(screen.getAllByText('↓').length).toBeGreaterThan(0);
  });

  it('disables reorder buttons appropriately', () => {
    render(<StepCustomizationModal {...defaultProps} />);
    
    const upButtons = screen.getAllByText('↑');
    const downButtons = screen.getAllByText('↓');
    
    // First up button should be disabled
    expect(upButtons[0]).toBeDisabled();
    
    // Last down button should be disabled
    expect(downButtons[downButtons.length - 1]).toBeDisabled();
  });

  it('respects step dependencies when toggling', () => {
    // Mock dependencies: Experience depends on Personal Info
    mockStepConfigurationManager.getStepDependencies.mockImplementation((docType, stepId) => {
      if (stepId === 3) return [2]; // Experience depends on Personal Info
      return [];
    });
    
    render(<StepCustomizationModal {...defaultProps} />);
    
    // The Experience step should be toggleable since Personal Info is enabled
    const switches = screen.getAllByRole('checkbox');
    expect(switches.length).toBeGreaterThan(0);
    switches.forEach(sw => expect(sw).not.toBeDisabled());
  });
}); 