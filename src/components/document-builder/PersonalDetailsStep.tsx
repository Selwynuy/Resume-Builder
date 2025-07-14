import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonalDetail } from '@/components/document-builder/types';

interface PersonalDetailsStepProps {
  personalDetails: PersonalDetail[];
  onUpdate: (personalDetails: PersonalDetail[]) => void;
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
  'Permanent Address',
  'Father\'s Name',
  'Mother\'s Name',
  'Passport Number',
  'Driver\'s License',
  'PAN Number',
  'Aadhar Number'
];

export const PersonalDetailsStep = ({ personalDetails, onUpdate, onNext, onPrevious }: PersonalDetailsStepProps) => {
  const addPersonalDetail = () => {
    const newDetail: PersonalDetail = {
      field: '',
      value: ''
    };
    onUpdate([...personalDetails, newDetail]);
  };

  const updatePersonalDetail = (index: number, field: keyof PersonalDetail, value: string) => {
    const updatedDetails = [...personalDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    onUpdate(updatedDetails);
  };

  const removePersonalDetail = (index: number) => {
    const updatedDetails = personalDetails.filter((_, i) => i !== index);
    onUpdate(updatedDetails);
  };

  const canProceed = () => {
    return personalDetails.length > 0 && personalDetails.every(detail => 
      detail.field.trim() && detail.value.trim()
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">👤 Personal Details</h2>
        <p className="text-slate-600">Add your personal information and identification details</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
          <Button onClick={addPersonalDetail} variant="outline" size="sm">
            + Add Detail
          </Button>
        </div>
        
        <div className="space-y-4">
          {((personalDetails && personalDetails.length > 0)
            ? personalDetails
            : [{ field: '', value: '' }]
          ).map((detail, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Detail {index + 1}</h4>
                <Button
                  onClick={() => removePersonalDetail(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  data-testid={`remove-personal-detail-${index}`}
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

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!canProceed()}>
          Next
        </Button>
      </div>
    </div>
  );
}; 