import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Publication } from '@/components/document-builder/types';

interface PublicationsStepProps {
  publications: Publication[];
  onUpdate: (publications: Publication[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PublicationsStep = ({ publications, onUpdate, onNext, onPrevious }: PublicationsStepProps) => {
  const addPublication = () => {
    const newPublication: Publication = {
      title: '',
      authors: '',
      journal: '',
      year: '',
      doi: ''
    };
    onUpdate([...publications, newPublication]);
  };

  const updatePublication = (index: number, field: keyof Publication, value: string) => {
    const updatedPublications = [...publications];
    updatedPublications[index] = { ...updatedPublications[index], [field]: value };
    onUpdate(updatedPublications);
  };

  const removePublication = (index: number) => {
    const updatedPublications = publications.filter((_, i) => i !== index);
    onUpdate(updatedPublications);
  };

  const canProceed = () => {
    return publications.length > 0 && publications.every(pub => 
      pub.title.trim() && pub.authors.trim() && pub.journal.trim() && pub.year.trim()
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">📚 Publications</h2>
        <p className="text-slate-600">Add your academic publications and research papers</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Publications</h3>
          <Button onClick={addPublication} variant="outline" size="sm">
            + Add Publication
          </Button>
        </div>
        
        <div className="space-y-4">
          {((publications && publications.length > 0)
            ? publications
            : [{ title: '', authors: '', journal: '', year: '', doi: '' }]
          ).map((publication, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Publication {index + 1}</h4>
                <Button 
                  onClick={() => removePublication(index)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  data-testid={`remove-publication-${index}`}
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