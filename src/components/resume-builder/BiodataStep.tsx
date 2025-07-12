import React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FamilyMember {
  name: string;
  relationship: string;
  age?: string;
  occupation?: string;
  education?: string;
}

interface PersonalDetail {
  field: string;
  value: string;
}

interface BiodataData {
  personalDetails: PersonalDetail[];
  familyMembers: FamilyMember[];
  hobbies: string[];
  languages: string[];
  references: any[];
}

interface BiodataStepProps {
  biodataData: BiodataData;
  onUpdate: (data: Partial<BiodataData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DEFAULT_PERSONAL_FIELDS = [
  'Date of Birth',
  'Place of Birth',
  'Nationality',
  'Religion',
  'Marital Status',
  'Blood Group',
  'Height',
  'Weight',
  'Emergency Contact',
  'Permanent Address'
];

export const BiodataStep = ({ biodataData, onUpdate, onNext, onPrevious }: BiodataStepProps) => {
  const addPersonalDetail = () => {
    const newDetail: PersonalDetail = {
      field: '',
      value: ''
    };
    onUpdate({ personalDetails: [...biodataData.personalDetails, newDetail] });
  };

  const updatePersonalDetail = (index: number, field: keyof PersonalDetail, value: string) => {
    const updatedDetails = [...biodataData.personalDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    onUpdate({ personalDetails: updatedDetails });
  };

  const removePersonalDetail = (index: number) => {
    const updatedDetails = biodataData.personalDetails.filter((_, i) => i !== index);
    onUpdate({ personalDetails: updatedDetails });
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      name: '',
      relationship: '',
      age: '',
      occupation: '',
      education: ''
    };
    onUpdate({ familyMembers: [...biodataData.familyMembers, newMember] });
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updatedMembers = [...biodataData.familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    onUpdate({ familyMembers: updatedMembers });
  };

  const removeFamilyMember = (index: number) => {
    const updatedMembers = biodataData.familyMembers.filter((_, i) => i !== index);
    onUpdate({ familyMembers: updatedMembers });
  };

  const addHobby = () => {
    const newHobby = '';
    onUpdate({ hobbies: [...biodataData.hobbies, newHobby] });
  };

  const updateHobby = (index: number, value: string) => {
    const updatedHobbies = [...biodataData.hobbies];
    updatedHobbies[index] = value;
    onUpdate({ hobbies: updatedHobbies });
  };

  const removeHobby = (index: number) => {
    const updatedHobbies = biodataData.hobbies.filter((_, i) => i !== index);
    onUpdate({ hobbies: updatedHobbies });
  };

  const addLanguage = () => {
    const newLanguage = '';
    onUpdate({ languages: [...biodataData.languages, newLanguage] });
  };

  const updateLanguage = (index: number, value: string) => {
    const updatedLanguages = [...biodataData.languages];
    updatedLanguages[index] = value;
    onUpdate({ languages: updatedLanguages });
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = biodataData.languages.filter((_, i) => i !== index);
    onUpdate({ languages: updatedLanguages });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">👤 Biodata Details</h2>
        <p className="text-slate-600">Add your personal and family information</p>
      </div>

      {/* Personal Details Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
          <Button onClick={addPersonalDetail} variant="outline" size="sm">
            + Add Detail
          </Button>
        </div>
        
        <div className="space-y-4">
          {biodataData.personalDetails.map((detail, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Detail {index + 1}</h4>
                <Button 
                  onClick={() => removePersonalDetail(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`detail-field-${index}`}>Field *</Label>
                  <Input
                    id={`detail-field-${index}`}
                    value={detail.field}
                    onChange={(e) => updatePersonalDetail(index, 'field', e.target.value)}
                    placeholder="e.g., Date of Birth, Blood Group"
                    list="personal-fields"
                  />
                  <datalist id="personal-fields">
                    {DEFAULT_PERSONAL_FIELDS.map(field => (
                      <option key={field} value={field} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor={`detail-value-${index}`}>Value *</Label>
                  <Input
                    id={`detail-value-${index}`}
                    value={detail.value}
                    onChange={(e) => updatePersonalDetail(index, 'value', e.target.value)}
                    placeholder="Enter the value"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Family Members Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Family Members</h3>
          <Button onClick={addFamilyMember} variant="outline" size="sm">
            + Add Family Member
          </Button>
        </div>
        
        <div className="space-y-4">
          {biodataData.familyMembers.map((member, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Family Member {index + 1}</h4>
                <Button 
                  onClick={() => removeFamilyMember(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`member-name-${index}`}>Name *</Label>
                  <Input
                    id={`member-name-${index}`}
                    value={member.name}
                    onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-relationship-${index}`}>Relationship *</Label>
                  <Input
                    id={`member-relationship-${index}`}
                    value={member.relationship}
                    onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                    placeholder="Father, Mother, Spouse, etc."
                  />
                </div>
                <div>
                  <Label htmlFor={`member-age-${index}`}>Age</Label>
                  <Input
                    id={`member-age-${index}`}
                    value={member.age || ''}
                    onChange={(e) => updateFamilyMember(index, 'age', e.target.value)}
                    placeholder="Age"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-occupation-${index}`}>Occupation</Label>
                  <Input
                    id={`member-occupation-${index}`}
                    value={member.occupation || ''}
                    onChange={(e) => updateFamilyMember(index, 'occupation', e.target.value)}
                    placeholder="Job title or occupation"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`member-education-${index}`}>Education</Label>
                  <Input
                    id={`member-education-${index}`}
                    value={member.education || ''}
                    onChange={(e) => updateFamilyMember(index, 'education', e.target.value)}
                    placeholder="Highest education level"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hobbies Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Hobbies & Interests</h3>
          <Button onClick={addHobby} variant="outline" size="sm">
            + Add Hobby
          </Button>
        </div>
        
        <div className="space-y-3">
          {biodataData.hobbies.map((hobby, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                value={hobby}
                onChange={(e) => updateHobby(index, e.target.value)}
                placeholder="e.g., Reading, Swimming, Photography"
                className="flex-1"
              />
              <Button 
                onClick={() => removeHobby(index)} 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Languages Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Languages Known</h3>
          <Button onClick={addLanguage} variant="outline" size="sm">
            + Add Language
          </Button>
        </div>
        
        <div className="space-y-3">
          {biodataData.languages.map((language, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                value={language}
                onChange={(e) => updateLanguage(index, e.target.value)}
                placeholder="e.g., English (Fluent), Hindi (Native)"
                className="flex-1"
              />
              <Button 
                onClick={() => removeLanguage(index)} 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button onClick={onNext} className="bg-gradient-to-r from-primary-500 to-primary-600">
          Next
        </Button>
      </div>
    </div>
  );
}; 