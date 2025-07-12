import React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
}

interface ResearchExperience {
  institution: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  funding?: string;
}

interface AcademicAchievement {
  title: string;
  institution: string;
  year: string;
  description?: string;
}

interface CVData {
  publications: Publication[];
  researchExperience: ResearchExperience[];
  academicAchievements: AcademicAchievement[];
  teachingExperience: any[];
  grants: any[];
  conferences: any[];
}

interface CVStepProps {
  cvData: CVData;
  onUpdate: (data: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const CVStep = ({ cvData, onUpdate, onNext, onPrevious }: CVStepProps) => {
  const addPublication = () => {
    const newPublication: Publication = {
      title: '',
      authors: '',
      journal: '',
      year: '',
      doi: ''
    };
    onUpdate({ publications: [...cvData.publications, newPublication] });
  };

  const updatePublication = (index: number, field: keyof Publication, value: string) => {
    const updatedPublications = [...cvData.publications];
    updatedPublications[index] = { ...updatedPublications[index], [field]: value };
    onUpdate({ publications: updatedPublications });
  };

  const removePublication = (index: number) => {
    const updatedPublications = cvData.publications.filter((_, i) => i !== index);
    onUpdate({ publications: updatedPublications });
  };

  const addResearchExperience = () => {
    const newResearch: ResearchExperience = {
      institution: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      funding: ''
    };
    onUpdate({ researchExperience: [...cvData.researchExperience, newResearch] });
  };

  const updateResearchExperience = (index: number, field: keyof ResearchExperience, value: string) => {
    const updatedResearch = [...cvData.researchExperience];
    updatedResearch[index] = { ...updatedResearch[index], [field]: value };
    onUpdate({ researchExperience: updatedResearch });
  };

  const removeResearchExperience = (index: number) => {
    const updatedResearch = cvData.researchExperience.filter((_, i) => i !== index);
    onUpdate({ researchExperience: updatedResearch });
  };

  const addAcademicAchievement = () => {
    const newAchievement: AcademicAchievement = {
      title: '',
      institution: '',
      year: '',
      description: ''
    };
    onUpdate({ academicAchievements: [...cvData.academicAchievements, newAchievement] });
  };

  const updateAcademicAchievement = (index: number, field: keyof AcademicAchievement, value: string) => {
    const updatedAchievements = [...cvData.academicAchievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    onUpdate({ academicAchievements: updatedAchievements });
  };

  const removeAcademicAchievement = (index: number) => {
    const updatedAchievements = cvData.academicAchievements.filter((_, i) => i !== index);
    onUpdate({ academicAchievements: updatedAchievements });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">📋 CV Details</h2>
        <p className="text-slate-600">Add your academic and research credentials</p>
      </div>

      {/* Publications Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Publications</h3>
          <Button onClick={addPublication} variant="outline" size="sm">
            + Add Publication
          </Button>
        </div>
        
        <div className="space-y-4">
          {cvData.publications.map((publication, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Publication {index + 1}</h4>
                <Button 
                  onClick={() => removePublication(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`pub-title-${index}`}>Title *</Label>
                  <Input
                    id={`pub-title-${index}`}
                    value={publication.title}
                    onChange={(e) => updatePublication(index, 'title', e.target.value)}
                    placeholder="Publication title"
                  />
                </div>
                <div>
                  <Label htmlFor={`pub-authors-${index}`}>Authors *</Label>
                  <Input
                    id={`pub-authors-${index}`}
                    value={publication.authors}
                    onChange={(e) => updatePublication(index, 'authors', e.target.value)}
                    placeholder="Author names"
                  />
                </div>
                <div>
                  <Label htmlFor={`pub-journal-${index}`}>Journal/Conference *</Label>
                  <Input
                    id={`pub-journal-${index}`}
                    value={publication.journal}
                    onChange={(e) => updatePublication(index, 'journal', e.target.value)}
                    placeholder="Journal or conference name"
                  />
                </div>
                <div>
                  <Label htmlFor={`pub-year-${index}`}>Year *</Label>
                  <Input
                    id={`pub-year-${index}`}
                    value={publication.year}
                    onChange={(e) => updatePublication(index, 'year', e.target.value)}
                    placeholder="2024"
                    type="number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`pub-doi-${index}`}>DOI (Optional)</Label>
                  <Input
                    id={`pub-doi-${index}`}
                    value={publication.doi || ''}
                    onChange={(e) => updatePublication(index, 'doi', e.target.value)}
                    placeholder="10.1000/example"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Research Experience Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Research Experience</h3>
          <Button onClick={addResearchExperience} variant="outline" size="sm">
            + Add Research Experience
          </Button>
        </div>
        
        <div className="space-y-4">
          {cvData.researchExperience.map((research, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Research Experience {index + 1}</h4>
                <Button 
                  onClick={() => removeResearchExperience(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
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
                    placeholder="University name"
                  />
                </div>
                <div>
                  <Label htmlFor={`research-position-${index}`}>Position *</Label>
                  <Input
                    id={`research-position-${index}`}
                    value={research.position}
                    onChange={(e) => updateResearchExperience(index, 'position', e.target.value)}
                    placeholder="Research Assistant, Postdoc, etc."
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
                    placeholder="NSF Grant, NIH, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`research-description-${index}`}>Description *</Label>
                  <textarea
                    id={`research-description-${index}`}
                    value={research.description}
                    onChange={(e) => updateResearchExperience(index, 'description', e.target.value)}
                    placeholder="Describe your research role, projects, and contributions"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Academic Achievements Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Academic Achievements</h3>
          <Button onClick={addAcademicAchievement} variant="outline" size="sm">
            + Add Achievement
          </Button>
        </div>
        
        <div className="space-y-4">
          {cvData.academicAchievements.map((achievement, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Achievement {index + 1}</h4>
                <Button 
                  onClick={() => removeAcademicAchievement(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`achievement-title-${index}`}>Title *</Label>
                  <Input
                    id={`achievement-title-${index}`}
                    value={achievement.title}
                    onChange={(e) => updateAcademicAchievement(index, 'title', e.target.value)}
                    placeholder="Award, honor, or achievement name"
                  />
                </div>
                <div>
                  <Label htmlFor={`achievement-institution-${index}`}>Institution *</Label>
                  <Input
                    id={`achievement-institution-${index}`}
                    value={achievement.institution}
                    onChange={(e) => updateAcademicAchievement(index, 'institution', e.target.value)}
                    placeholder="Awarding institution"
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
                    placeholder="Brief description of the achievement"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>
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