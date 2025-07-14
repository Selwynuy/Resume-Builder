import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ProgressBar } from './ProgressBar';
import { STEPS, StepConfig } from './types';

describe('ProgressBar', () => {
  const defaultProps = {
    currentStep: 1,
    onStepClick: jest.fn()
  };

  const customSteps: StepConfig[] = [
    { id: 1, title: 'Step 1', icon: '🚀', description: 'First step', required: true, component: 'Step1' },
    { id: 2, title: 'Step 2', icon: '⚡', description: 'Second step', required: true, component: 'Step2' },
    { id: 3, title: 'Step 3', icon: '🎯', description: 'Third step', required: false, component: 'Step3' },
    { id: 4, title: 'Step 4', icon: '✨', description: 'Fourth step', required: true, component: 'Step4' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Steps Rendering', () => {
    it('should render with default steps when no steps prop is provided', () => {
      render(<ProgressBar {...defaultProps} />);
      
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });

    it('should render correct number of step circles for default steps', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const stepCircles = screen.getAllByRole('button');
      expect(stepCircles).toHaveLength(5);
    });

    it('should display current step title and description', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} />);
      
      expect(screen.getByText('💼 Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Add your work history')).toBeInTheDocument();
    });
  });

  describe('Custom Steps Rendering', () => {
    it('should render with custom steps when provided', () => {
      render(<ProgressBar {...defaultProps} steps={customSteps} />);
      
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
      expect(screen.getByText('Step 4')).toBeInTheDocument();
    });

    it('should render correct number of step circles for custom steps', () => {
      render(<ProgressBar {...defaultProps} steps={customSteps} />);
      
      const stepCircles = screen.getAllByRole('button');
      expect(stepCircles).toHaveLength(4);
    });

    it('should display custom step title and description', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} steps={customSteps} />);
      
      expect(screen.getByText('⚡ Step 2')).toBeInTheDocument();
      expect(screen.getByText('Second step')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('should call onStepClick when step circle is clicked', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const step2Button = screen.getByText('2');
      fireEvent.click(step2Button);
      
      expect(defaultProps.onStepClick).toHaveBeenCalledWith(2);
    });

    it('should call onStepClick for all step circles', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const stepButtons = screen.getAllByRole('button');
      stepButtons.forEach((button, index) => {
        fireEvent.click(button);
        expect(defaultProps.onStepClick).toHaveBeenCalledWith(index + 1);
      });
    });

    it('should have proper cursor pointer for step circles', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const stepButtons = screen.getAllByRole('button');
      stepButtons.forEach(button => {
        expect(button).toHaveClass('cursor-pointer');
      });
    });
  });

  describe('Step States and Styling', () => {
    it('should apply completed step styling (checkmark)', () => {
      render(<ProgressBar {...defaultProps} currentStep={3} />);
      
      // Get the first step button specifically
      const stepButtons = screen.getAllByRole('button');
      const step1Button = stepButtons[0];
      expect(step1Button).toHaveTextContent('✓');
      expect(step1Button).toHaveClass('bg-primary-600', 'border-primary-600', 'text-white');
    });

    it('should apply current step styling', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} />);
      
      const step2Button = screen.getByText('2');
      expect(step2Button).toHaveClass('bg-primary-600', 'border-primary-600', 'text-white');
    });

    it('should apply upcoming step styling', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} />);
      
      const step3Button = screen.getByText('3');
      expect(step3Button).toHaveClass('bg-white', 'border-gray-300', 'text-gray-500');
    });

    it('should apply hover effects to upcoming steps', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} />);
      
      const step3Button = screen.getByText('3');
      expect(step3Button).toHaveClass('hover:bg-gray-50', 'hover:border-gray-400', 'hover:text-gray-600');
    });

    it('should apply hover effects to current step', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} />);
      
      const step2Button = screen.getByText('2');
      expect(step2Button).toHaveClass('hover:bg-primary-700', 'hover:border-primary-700');
    });
  });

  describe('Progress Line', () => {
    it('should render progress line with correct width for first step', () => {
      render(<ProgressBar {...defaultProps} currentStep={1} />);
      
      const progressLine = screen.getByTestId('progress-line');
      expect(progressLine).toHaveStyle({ width: '0%' });
    });

    it('should render progress line with correct width for middle step', () => {
      render(<ProgressBar {...defaultProps} currentStep={3} />);
      
      const progressLine = screen.getByTestId('progress-line');
      expect(progressLine).toHaveStyle({ width: '40%' });
    });

    it('should render progress line with correct width for last step', () => {
      render(<ProgressBar {...defaultProps} currentStep={5} />);
      
      const progressLine = screen.getByTestId('progress-line');
      expect(progressLine).toHaveStyle({ width: '80%' });
    });

    it('should handle progress line for custom steps', () => {
      render(<ProgressBar {...defaultProps} currentStep={2} steps={customSteps} />);
      
      const progressLine = screen.getByTestId('progress-line');
      // For 4 steps, step 2 should be 1/3 * 80% = 26.666666666666664%
      expect(progressLine).toHaveStyle({ width: '26.666666666666664%' });
    });

    it('should cap progress line at 80%', () => {
      render(<ProgressBar {...defaultProps} currentStep={10} />);
      
      const progressLine = screen.getByTestId('progress-line');
      expect(progressLine).toHaveStyle({ width: '80%' });
    });
  });

  describe('Tooltips', () => {
    it('should show tooltip on hover', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const step2Button = screen.getByText('2');
      fireEvent.mouseEnter(step2Button);
      
      // Note: Tooltips are CSS-based, so we test the class structure
      expect(step2Button).toHaveClass('group');
    });

    it('should have proper tooltip positioning', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const stepButtons = screen.getAllByRole('button');
      stepButtons.forEach(button => {
        const tooltip = button.querySelector('.absolute.-top-12');
        expect(tooltip).toHaveClass('left-1/2', 'transform', '-translate-x-1/2');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles for step navigation', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have proper title attributes for step buttons', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const step2Button = screen.getByText('2');
      expect(step2Button).toHaveAttribute('title', 'Go to Work Experience');
    });

    it('should have proper heading structure', () => {
      render(<ProgressBar {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive spacing for step circles', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const stepContainer = screen.getByText('1').closest('.space-x-16');
      expect(stepContainer).toHaveClass('space-x-16');
    });

    it('should maintain proper spacing on mobile', () => {
      render(<ProgressBar {...defaultProps} />);
      
      const container = screen.getByText('Personal Info').closest('.mb-8');
      expect(container).toHaveClass('mb-8');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single step gracefully', () => {
      const singleStep: StepConfig[] = [
        { id: 1, title: 'Single Step', icon: '🎯', description: 'Only step', required: true, component: 'SingleStep' }
      ];
      
      render(<ProgressBar {...defaultProps} steps={singleStep} />);
      
      expect(screen.getByText('🎯 Single Step')).toBeInTheDocument();
      expect(screen.getByText('Only step')).toBeInTheDocument();
    });

    it('should handle empty steps array', () => {
      render(<ProgressBar {...defaultProps} steps={[]} />);
      
      // Should fall back to default steps
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    it('should handle current step beyond available steps', () => {
      render(<ProgressBar {...defaultProps} currentStep={10} />);
      
      // Should still render all steps
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });

    it('should handle current step as 0', () => {
      render(<ProgressBar {...defaultProps} currentStep={0} />);
      
      // Should default to first step
      expect(screen.getByText('👤 Personal Info')).toBeInTheDocument();
    });
  });

  describe('Step Validation', () => {
    it('should handle required vs optional steps', () => {
      render(<ProgressBar {...defaultProps} steps={customSteps} />);
      
      // All steps should be rendered regardless of required status
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument(); // Optional step
    });

    it('should maintain step order regardless of required status', () => {
      render(<ProgressBar {...defaultProps} steps={customSteps} />);
      
      const stepButtons = screen.getAllByRole('button');
      expect(stepButtons[0]).toHaveTextContent('1');
      expect(stepButtons[1]).toHaveTextContent('2');
      expect(stepButtons[2]).toHaveTextContent('3');
      expect(stepButtons[3]).toHaveTextContent('4');
    });
  });

  describe('Performance', () => {
    it('should handle large number of steps efficiently', () => {
      const manySteps: StepConfig[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Step ${i + 1}`,
        icon: '🎯',
        description: `Step ${i + 1} description`,
        required: true,
        component: `Step${i + 1}`
      }));
      
      render(<ProgressBar {...defaultProps} steps={manySteps} />);
      
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 20')).toBeInTheDocument();
    });
  });
}); 