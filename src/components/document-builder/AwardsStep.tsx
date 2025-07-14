import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AcademicAchievement } from '@/components/document-builder/types';

interface AwardsStepProps {
  academicAchievements: AcademicAchievement[];
  onUpdate: (academicAchievements: AcademicAchievement[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const AwardsStep = ({ academicAchievements, onUpdate, onNext, onPrevious }: AwardsStepProps) => {
  const addAcademicAchievement = () => {
    const newAchievement: AcademicAchievement = {
      title: '',
      institution: '',
      year: '',
      description: ''
    };
    onUpdate([...academicAchievements, newAchievement]);
  };

  const updateAcademicAchievement = (index: number, field: keyof AcademicAchievement, value: string) => {
    const updatedAchievements = [...academicAchievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    onUpdate(updatedAchievements);
  };

  const removeAcademicAchievement = (index: number) => {
    const updatedAchievements = academicAchievements.filter((_, i) => i !== index);
    onUpdate(updatedAchievements);
  };

  const canProceed = () => {
    return academicAchievements.length > 0 && academicAchievements.every(achievement => 
      achievement.title.trim() && achievement.institution.trim() && achievement.year.trim()
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">🏆 Awards & Achievements</h2>
        <p className="text-slate-600">Add your academic awards, honors, and recognitions</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Academic Achievements</h3>
          <Button onClick={addAcademicAchievement} variant="outline" size="sm">
            + Add Achievement
          </Button>
        </div>
        
        <div className="space-y-4">
          {((academicAchievements && academicAchievements.length > 0)
            ? academicAchievements
            : [{ title: '', institution: '', year: '', description: '' }]
          ).map((achievement, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Achievement {index + 1}</h4>
                <Button 
                  onClick={() => removeAcademicAchievement(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  data-testid={`remove-achievement-${index}`}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`achievement-title-${index}`}>Award/Title *</Label>
                  <Input
                    id={`achievement-title-${index}`}
                    value={achievement.title}
                    onChange={(e) => updateAcademicAchievement(index, 'title', e.target.value)}
                    placeholder="e.g., Dean's List, Best Paper Award"
                  />
                </div>
                <div>
                  <Label htmlFor={`achievement-institution-${index}`}>Institution *</Label>
                  <Input
                    id={`achievement-institution-${index}`}
                    value={achievement.institution}
                    onChange={(e) => updateAcademicAchievement(index, 'institution', e.target.value)}
                    placeholder="University or organization"
                  />
                </div>
                <div>
                  <Label htmlFor={`achievement-year-${index}`}>Year *</Label>
                  <Input
                    id={`achievement-year-${index}`}
                    value={achievement.year}
                    onChange={(e) => updateAcademicAchievement(index, 'year', e.target.value)}
                    placeholder="2024"
                    type="number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`achievement-description-${index}`}>Description (Optional)</Label>
                  <textarea
                    id={`achievement-description-${index}`}
                    value={achievement.description || ''}
                    onChange={(e) => updateAcademicAchievement(index, 'description', e.target.value)}
                    placeholder="Brief description of the achievement, criteria, or significance..."
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
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