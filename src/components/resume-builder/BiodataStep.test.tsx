import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BiodataStep } from './BiodataStep';

describe('BiodataStep', () => {
  const defaultBiodataData = {
    personalDetails: [],
    familyMembers: [],
    hobbies: [],
    languages: [],
    references: []
  };

  const defaultProps = {
    biodataData: defaultBiodataData,
    onUpdate: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render biodata step title and description', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('👤 Biodata Details')).toBeInTheDocument();
      expect(screen.getByText('Add your personal and family information')).toBeInTheDocument();
    });

    it('should render all four main sections', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('Personal Details')).toBeInTheDocument();
      expect(screen.getByText('Family Members')).toBeInTheDocument();
      expect(screen.getByText('Hobbies & Interests')).toBeInTheDocument();
      expect(screen.getByText('Languages Known')).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Personal Details Section', () => {
    it('should render add detail button', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Detail')).toBeInTheDocument();
    });

    it('should add new personal detail when add button is clicked', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Detail');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        personalDetails: [{
          field: '',
          value: ''
        }]
      });
    });

    it('should render personal detail form when data exists', () => {
      const biodataDataWithDetails = {
        ...defaultBiodataData,
        personalDetails: [{
          field: 'Date of Birth',
          value: '01/01/1990'
        }]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithDetails} />);
      
      expect(screen.getByDisplayValue('Date of Birth')).toBeInTheDocument();
      expect(screen.getByDisplayValue('01/01/1990')).toBeInTheDocument();
    });

    it('should update personal detail fields when input changes', () => {
      const biodataDataWithDetails = {
        ...defaultBiodataData,
        personalDetails: [{
          field: '',
          value: ''
        }]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithDetails} />);
      
      const fieldInput = screen.getByPlaceholderText('e.g., Date of Birth, Blood Group');
      fireEvent.change(fieldInput, { target: { value: 'Blood Group' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        personalDetails: [{
          field: 'Blood Group',
          value: ''
        }]
      });
    });

    it('should remove personal detail when remove button is clicked', () => {
      const biodataDataWithDetails = {
        ...defaultBiodataData,
        personalDetails: [{
          field: 'Date of Birth',
          value: '01/01/1990'
        }]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithDetails} />);
      
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        personalDetails: []
      });
    });

    it('should have datalist with default personal fields', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const fieldInput = screen.getByPlaceholderText('e.g., Date of Birth, Blood Group');
      expect(fieldInput).toHaveAttribute('list', 'personal-fields');
      
      const datalist = document.getElementById('personal-fields');
      expect(datalist).toBeInTheDocument();
    });
  });

  describe('Family Members Section', () => {
    it('should render add family member button', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Family Member')).toBeInTheDocument();
    });

    it('should add new family member when add button is clicked', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Family Member');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        familyMembers: [{
          name: '',
          relationship: '',
          age: '',
          occupation: '',
          education: ''
        }]
      });
    });

    it('should render family member form when data exists', () => {
      const biodataDataWithFamily = {
        ...defaultBiodataData,
        familyMembers: [{
          name: 'John Doe',
          relationship: 'Father',
          age: '50',
          occupation: 'Engineer',
          education: 'Bachelor\'s Degree'
        }]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithFamily} />);
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Father')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Bachelor\'s Degree')).toBeInTheDocument();
    });

    it('should update family member fields when input changes', () => {
      const biodataDataWithFamily = {
        ...defaultBiodataData,
        familyMembers: [{
          name: '',
          relationship: '',
          age: '',
          occupation: '',
          education: ''
        }]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithFamily} />);
      
      const nameInput = screen.getByPlaceholderText('Full name');
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        familyMembers: [{
          name: 'Jane Doe',
          relationship: '',
          age: '',
          occupation: '',
          education: ''
        }]
      });
    });

    it('should remove family member when remove button is clicked', () => {
      const biodataDataWithFamily = {
        ...defaultBiodataData,
        familyMembers: [{
          name: 'John Doe',
          relationship: 'Father',
          age: '50',
          occupation: 'Engineer',
          education: ''
        }]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithFamily} />);
      
      const removeButton = screen.getAllByText('Remove')[1]; // Second remove button (family member)
      fireEvent.click(removeButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        familyMembers: []
      });
    });
  });

  describe('Hobbies Section', () => {
    it('should render add hobby button', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Hobby')).toBeInTheDocument();
    });

    it('should add new hobby when add button is clicked', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Hobby');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        hobbies: ['']
      });
    });

    it('should render hobby input when hobbies exist', () => {
      const biodataDataWithHobbies = {
        ...defaultBiodataData,
        hobbies: ['Reading', 'Swimming']
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithHobbies} />);
      
      expect(screen.getByDisplayValue('Reading')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Swimming')).toBeInTheDocument();
    });

    it('should update hobby when input changes', () => {
      const biodataDataWithHobbies = {
        ...defaultBiodataData,
        hobbies: ['']
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithHobbies} />);
      
      const hobbyInput = screen.getByPlaceholderText('e.g., Reading, Swimming, Photography');
      fireEvent.change(hobbyInput, { target: { value: 'Photography' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        hobbies: ['Photography']
      });
    });

    it('should remove hobby when remove button is clicked', () => {
      const biodataDataWithHobbies = {
        ...defaultBiodataData,
        hobbies: ['Reading', 'Swimming']
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithHobbies} />);
      
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[2]); // Third remove button (hobby)
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        hobbies: ['Swimming']
      });
    });
  });

  describe('Languages Section', () => {
    it('should render add language button', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('+ Add Language')).toBeInTheDocument();
    });

    it('should add new language when add button is clicked', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const addButton = screen.getByText('+ Add Language');
      fireEvent.click(addButton);
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        languages: ['']
      });
    });

    it('should render language input when languages exist', () => {
      const biodataDataWithLanguages = {
        ...defaultBiodataData,
        languages: ['English (Fluent)', 'Hindi (Native)']
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithLanguages} />);
      
      expect(screen.getByDisplayValue('English (Fluent)')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Hindi (Native)')).toBeInTheDocument();
    });

    it('should update language when input changes', () => {
      const biodataDataWithLanguages = {
        ...defaultBiodataData,
        languages: ['']
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithLanguages} />);
      
      const languageInput = screen.getByPlaceholderText('e.g., English (Fluent), Hindi (Native)');
      fireEvent.change(languageInput, { target: { value: 'Spanish (Intermediate)' } });
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        languages: ['Spanish (Intermediate)']
      });
    });

    it('should remove language when remove button is clicked', () => {
      const biodataDataWithLanguages = {
        ...defaultBiodataData,
        languages: ['English (Fluent)', 'Hindi (Native)']
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithLanguages} />);
      
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[3]); // Fourth remove button (language)
      
      expect(defaultProps.onUpdate).toHaveBeenCalledWith({
        languages: ['Hindi (Native)']
      });
    });
  });

  describe('Navigation', () => {
    it('should call onPrevious when Previous button is clicked', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);
      
      expect(defaultProps.onPrevious).toHaveBeenCalled();
    });

    it('should call onNext when Next button is clicked', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      expect(defaultProps.onNext).toHaveBeenCalled();
    });

    it('should have proper button styling', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const previousButton = screen.getByText('Previous');
      const nextButton = screen.getByText('Next');
      
      expect(previousButton).toHaveClass('variant-outline');
      expect(nextButton).toHaveClass('bg-gradient-to-r', 'from-primary-500', 'to-primary-600');
    });
  });

  describe('Form Validation', () => {
    it('should mark required fields with asterisk', () => {
      render(<BiodataStep {...defaultProps} />);
      
      // Check for required field indicators in personal details
      expect(screen.getByText('Field *')).toBeInTheDocument();
      expect(screen.getByText('Value *')).toBeInTheDocument();
      
      // Check for required field indicators in family members
      expect(screen.getByText('Name *')).toBeInTheDocument();
      expect(screen.getByText('Relationship *')).toBeInTheDocument();
    });

    it('should mark optional fields appropriately', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Occupation')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByLabelText('Field *')).toBeInTheDocument();
      expect(screen.getByLabelText('Value *')).toBeInTheDocument();
      expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have proper heading structure', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('should have proper spacing', () => {
      render(<BiodataStep {...defaultProps} />);
      
      const container = screen.getByText('👤 Biodata Details').closest('.space-y-6');
      expect(container).toHaveClass('space-y-6');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple personal details', () => {
      const biodataDataWithMultipleDetails = {
        ...defaultBiodataData,
        personalDetails: [
          { field: 'Date of Birth', value: '01/01/1990' },
          { field: 'Blood Group', value: 'O+' }
        ]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithMultipleDetails} />);
      
      expect(screen.getByDisplayValue('Date of Birth')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Blood Group')).toBeInTheDocument();
    });

    it('should handle multiple family members', () => {
      const biodataDataWithMultipleFamily = {
        ...defaultBiodataData,
        familyMembers: [
          { name: 'John Doe', relationship: 'Father', age: '50', occupation: 'Engineer', education: '' },
          { name: 'Jane Doe', relationship: 'Mother', age: '45', occupation: 'Teacher', education: '' }
        ]
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithMultipleFamily} />);
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    });

    it('should handle empty data gracefully', () => {
      render(<BiodataStep {...defaultProps} />);
      
      expect(screen.getByText('Personal Details')).toBeInTheDocument();
      expect(screen.getByText('Family Members')).toBeInTheDocument();
      expect(screen.getByText('Hobbies & Interests')).toBeInTheDocument();
      expect(screen.getByText('Languages Known')).toBeInTheDocument();
    });

    it('should handle null or undefined data', () => {
      const biodataDataWithNulls = {
        personalDetails: null as any,
        familyMembers: undefined as any,
        hobbies: [],
        languages: [],
        references: []
      };

      render(<BiodataStep {...defaultProps} biodataData={biodataDataWithNulls} />);
      
      // Should not crash and should render the component
      expect(screen.getByText('👤 Biodata Details')).toBeInTheDocument();
    });
  });
}); 