import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CVStep } from './CVStep';

describe('CVStep', () => {
  const defaultCVData = {
    publications: [],
    researchExperience: [],
    academicAchievements: [],
    teachingExperience: [],
    grants: [],
    conferences: []
  };

  const defaultProps = {
    cvData: defaultCVData,
    onUpdate: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render CV step title and description', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('📋 CV Details')).toBeInTheDocument();
      expect(screen.getByText('Add your academic and research credentials')).toBeInTheDocument();
    });

    it('should render all three main sections', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('Publications')).toBeInTheDocument();
      expect(screen.getByText('Research Experience')).toBeInTheDocument();
      expect(screen.getByText('Academic Achievements')).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Publications Section', () => {
    it('should render add publication button', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Publication')).toBeInTheDocument();
    });

    it('should add new publication when add button is clicked', () => {
      render(<CVStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Publication');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        publications: [{
          title: '',
          authors: '',
          journal: '',
          year: '',
          doi: ''
        }]
      });
    });

    it('should render publication form when publications exist', () => {
      const cvDataWithPublication = {
        ...defaultCVData,
        publications: [{
          title: 'Test Publication',
          authors: 'John Doe',
          journal: 'Test Journal',
          year: '2024',
          doi: '10.1000/test'
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithPublication} />);
      
      expect(screen.getByDisplayValue('Test Publication')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Journal')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10.1000/test')).toBeInTheDocument();
    });

    it('should update publication fields when input changes', () => {
      const cvDataWithPublication = {
        ...defaultCVData,
        publications: [{
          title: '',
          authors: '',
          journal: '',
          year: '',
          doi: ''
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithPublication} />);
      
      const titleInput = screen.getByPlaceholderText('Publication title');
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        publications: [{
          title: 'New Title',
          authors: '',
          journal: '',
          year: '',
          doi: ''
        }]
      });
    });

    it('should remove publication when remove button is clicked', () => {
      const cvDataWithPublication = {
        ...defaultCVData,
        publications: [{
          title: 'Test Publication',
          authors: 'John Doe',
          journal: 'Test Journal',
          year: '2024',
          doi: ''
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithPublication} />);
      
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        publications: []
      });
    });
  });

  describe('Research Experience Section', () => {
    it('should render add research experience button', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Research Experience')).toBeInTheDocument();
    });

    it('should add new research experience when add button is clicked', () => {
      render(<CVStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Research Experience');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        researchExperience: [{
          institution: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          funding: ''
        }]
      });
    });

    it('should render research experience form when data exists', () => {
      const cvDataWithResearch = {
        ...defaultCVData,
        researchExperience: [{
          institution: 'Test University',
          position: 'Research Assistant',
          startDate: '01/2023',
          endDate: '12/2023',
          description: 'Research description',
          funding: 'NSF Grant'
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithResearch} />);
      
      expect(screen.getByDisplayValue('Test University')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Research Assistant')).toBeInTheDocument();
      expect(screen.getByDisplayValue('01/2023')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12/2023')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Research description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('NSF Grant')).toBeInTheDocument();
    });

    it('should update research experience fields when input changes', () => {
      const cvDataWithResearch = {
        ...defaultCVData,
        researchExperience: [{
          institution: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          funding: ''
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithResearch} />);
      
      const institutionInput = screen.getByPlaceholderText('University name');
      fireEvent.change(institutionInput, { target: { value: 'New University' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        researchExperience: [{
          institution: 'New University',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          funding: ''
        }]
      });
    });

    it('should remove research experience when remove button is clicked', () => {
      const cvDataWithResearch = {
        ...defaultCVData,
        researchExperience: [{
          institution: 'Test University',
          position: 'Research Assistant',
          startDate: '01/2023',
          endDate: '12/2023',
          description: 'Research description',
          funding: ''
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithResearch} />);
      
      const removeButton = screen.getAllByText('Remove')[1]; // Second remove button (research experience)
      fireEvent.click(removeButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        researchExperience: []
      });
    });
  });

  describe('Academic Achievements Section', () => {
    it('should render add achievement button', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Achievement')).toBeInTheDocument();
    });

    it('should add new achievement when add button is clicked', () => {
      render(<CVStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Achievement');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        academicAchievements: [{
          title: '',
          institution: '',
          year: '',
          description: ''
        }]
      });
    });

    it('should render achievement form when data exists', () => {
      const cvDataWithAchievement = {
        ...defaultCVData,
        academicAchievements: [{
          title: 'Best Paper Award',
          institution: 'Test Conference',
          year: '2024',
          description: 'Award description'
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithAchievement} />);
      
      expect(screen.getByDisplayValue('Best Paper Award')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Conference')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Award description')).toBeInTheDocument();
    });

    it('should update achievement fields when input changes', () => {
      const cvDataWithAchievement = {
        ...defaultCVData,
        academicAchievements: [{
          title: '',
          institution: '',
          year: '',
          description: ''
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithAchievement} />);
      
      const titleInput = screen.getByPlaceholderText('Award, honor, or achievement name');
      fireEvent.change(titleInput, { target: { value: 'New Award' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        academicAchievements: [{
          title: 'New Award',
          institution: '',
          year: '',
          description: ''
        }]
      });
    });

    it('should remove achievement when remove button is clicked', () => {
      const cvDataWithAchievement = {
        ...defaultCVData,
        academicAchievements: [{
          title: 'Best Paper Award',
          institution: 'Test Conference',
          year: '2024',
          description: 'Award description'
        }]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithAchievement} />);
      
      const removeButton = screen.getAllByText('Remove')[2]; // Third remove button (achievement)
      fireEvent.click(removeButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        academicAchievements: []
      });
    });
  });

  describe('Navigation', () => {
    it('should call onPrevious when Previous button is clicked', () => {
      render(<CVStep {...defaultProps} />);
      
      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);
      
      expect(defaultProps.onPrevious).toHaveBeenCalled();
    });

    it('should call onNext when Next button is clicked', () => {
      render(<CVStep {...defaultProps} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      expect(defaultProps.onNext).toHaveBeenCalled();
    });

    it('should have proper button styling', () => {
      render(<CVStep {...defaultProps} />);
      
      const previousButton = screen.getByText('Previous');
      const nextButton = screen.getByText('Next');
      
      expect(previousButton).toHaveClass('variant-outline');
      expect(nextButton).toHaveClass('bg-gradient-to-r', 'from-primary-500', 'to-primary-600');
    });
  });

  describe('Form Validation', () => {
    it('should mark required fields with asterisk', () => {
      render(<CVStep {...defaultProps} />);
      
      // Check for required field indicators in publications
      expect(screen.getByText('Title *')).toBeInTheDocument();
      expect(screen.getByText('Authors *')).toBeInTheDocument();
      expect(screen.getByText('Journal/Conference *')).toBeInTheDocument();
      expect(screen.getByText('Year *')).toBeInTheDocument();
    });

    it('should mark optional fields appropriately', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('DOI (Optional)')).toBeInTheDocument();
      expect(screen.getByText('Funding Source (Optional)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Authors *')).toBeInTheDocument();
      expect(screen.getByLabelText('Journal/Conference *')).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<CVStep {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have proper heading structure', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(<CVStep {...defaultProps} />);
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('should have proper spacing', () => {
      render(<CVStep {...defaultProps} />);
      
      const container = screen.getByText('📋 CV Details').closest('.space-y-6');
      expect(container).toHaveClass('space-y-6');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple publications', () => {
      const cvDataWithMultiplePublications = {
        ...defaultCVData,
        publications: [
          { title: 'Pub 1', authors: 'Author 1', journal: 'Journal 1', year: '2023', doi: '' },
          { title: 'Pub 2', authors: 'Author 2', journal: 'Journal 2', year: '2024', doi: '' }
        ]
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithMultiplePublications} />);
      
      expect(screen.getByDisplayValue('Pub 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pub 2')).toBeInTheDocument();
    });

    it('should handle empty data gracefully', () => {
      render(<CVStep {...defaultProps} />);
      
      expect(screen.getByText('Publications')).toBeInTheDocument();
      expect(screen.getByText('Research Experience')).toBeInTheDocument();
      expect(screen.getByText('Academic Achievements')).toBeInTheDocument();
    });

    it('should handle null or undefined data', () => {
      const cvDataWithNulls = {
        publications: null as any,
        researchExperience: undefined as any,
        academicAchievements: [],
        teachingExperience: [],
        grants: [],
        conferences: []
      };

      render(<CVStep {...defaultProps} cvData={cvDataWithNulls} />);
      
      // Should not crash and should render the component
      expect(screen.getByText('📋 CV Details')).toBeInTheDocument();
    });
  });
}); 