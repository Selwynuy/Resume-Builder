import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResearchExperience } from '@/components/document-builder/types';

interface ResearchStepProps {
  researchExperience: ResearchExperience[];
  onUpdate: (researchExperience: ResearchExperience[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ResearchStep = ({ researchExperience, onUpdate, onNext, onPrevious }: ResearchStepProps) => {
  const addResearchExperience = () => {
    const newResearch: ResearchExperience = {
      institution: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      funding: ''
    };
    onUpdate([...researchExperience, newResearch]);
  };

  const updateResearchExperience = (index: number, field: keyof ResearchExperience, value: string) => {
    const updatedResearch = [...researchExperience];
    updatedResearch[index] = { ...updatedResearch[index], [field]: value };
    onUpdate(updatedResearch);
  };

  const removeResearchExperience = (index: number) => {
    const updatedResearch = researchExperience.filter((_, i) => i !== index);
    onUpdate(updatedResearch);
  };

  const canProceed = () => {
    return researchExperience.length > 0 && researchExperience.every(research => 
      research.institution.trim() && research.position.trim() && 
      research.startDate.trim() && research.description.trim()
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">🔬 Research Experience</h2>
        <p className="text-slate-600">Add your research positions and academic work</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Research Experience</h3>
          <Button onClick={addResearchExperience} variant="outline" size="sm">
            + Add Research Position
          </Button>
        </div>
        
        <div className="space-y-4">
          {((researchExperience && researchExperience.length > 0)
            ? researchExperience
            : [{ institution: '', position: '', startDate: '', endDate: '', description: '', funding: '' }]
          ).map((research, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Research Position {index + 1}</h4>
                <Button 
                  onClick={() => removeResearchExperience(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  data-testid={`remove-research-${index}`}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`research-institution-${index}`}>Institution *</Label>
                  <Input
                    id={`research-institution-${index}`}
                    value={research.institution}
                    onChange={(e) => updateResearchExperience(index, 'institution', e.target.value)}
                    placeholder="University or research institute"
                  />
                </div>
                <div>
                  <Label htmlFor={`research-position-${index}`}>Position *</Label>
                  <Input
                    id={`research-position-${index}`}
                    value={research.position}
                    onChange={(e) => updateResearchExperience(index, 'position', e.target.value)}
                    placeholder="e.g., Research Assistant, Postdoc"
                  />
                </div>
                <div>
                  <Label htmlFor={`research-start-${index}`}>Start Date *</Label>
                  <Input
                    id={`research-start-${index}`}
                    value={research.startDate}
                    onChange={(e) => updateResearchExperience(index, 'startDate', e.target.value)}
                    placeholder="MM/YYYY"
                  />
                </div>
                <div>
                  <Label htmlFor={`research-end-${index}`}>End Date</Label>
                  <Input
                    id={`research-end-${index}`}
                    value={research.endDate}
                    onChange={(e) => updateResearchExperience(index, 'endDate', e.target.value)}
                    placeholder="MM/YYYY or Present"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`research-funding-${index}`}>Funding Source (Optional)</Label>
                  <Input
                    id={`research-funding-${index}`}
                    value={research.funding || ''}
                    onChange={(e) => updateResearchExperience(index, 'funding', e.target.value)}
                    placeholder="e.g., NSF Grant, NIH Fellowship"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`research-description-${index}`}>Description *</Label>
                  <textarea
                    id={`research-description-${index}`}
                    value={research.description}
                    onChange={(e) => updateResearchExperience(index, 'description', e.target.value)}
                    placeholder="Describe your research responsibilities, methodologies, and key findings..."
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
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