import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LanguagesStepProps {
  languages: string[];
  onUpdate: (languages: string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
  'Bengali', 'Urdu', 'Turkish', 'Dutch', 'Swedish', 'Norwegian',
  'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian'
];

export const LanguagesStep = ({ languages, onUpdate, onNext, onPrevious }: LanguagesStepProps) => {
  const addLanguage = () => {
    onUpdate([...languages, '']);
  };

  const updateLanguage = (index: number, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = value;
    onUpdate(updatedLanguages);
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    onUpdate(updatedLanguages);
  };

  const canProceed = () => {
    return languages.length > 0 && languages.every(lang => lang.trim());
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">🗣️ Languages</h2>
        <p className="text-slate-600">Add the languages you speak, read, or write</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Languages</h3>
          <Button onClick={addLanguage} variant="outline" size="sm">
            + Add Language
          </Button>
        </div>
        
        <div className="space-y-4">
          {((languages && languages.length > 0)
            ? languages
            : ['']
          ).map((language, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-700">Language {index + 1}</h4>
                <Button
                  onClick={() => removeLanguage(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  data-testid={`remove-language-${index}`}
                >
                  Remove
                </Button>
              </div>
              
              <div>
                <Label htmlFor={`language-${index}`}>Language *</Label>
                <Input
                  id={`language-${index}`}
                  value={language}
                  onChange={(e) => updateLanguage(index, e.target.value)}
                  placeholder="e.g., English, Spanish, French"
                  list="common-languages"
                />
                <datalist id="common-languages">
                  {COMMON_LANGUAGES.map(lang => (
                    <option key={lang} value={lang} />
                  ))}
                </datalist>
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