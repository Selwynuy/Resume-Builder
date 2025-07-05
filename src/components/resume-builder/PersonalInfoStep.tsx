'use client'

import { PersonalInfo } from './types'
import { INPUT_LIMITS } from '@/lib/security'
import { useState } from 'react'
import { ValidatedInput, MultiStyleSummaryModal, validatePersonalInfoField } from './'

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
}

export const PersonalInfoStep = ({ 
  personalInfo,
  updatePersonalInfo 
}: PersonalInfoStepProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [multiSummaries, setMultiSummaries] = useState<null | {
    professional: string;
    creative: string;
    friendly: string;
    technical: string;
  }>(null);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiError, setMultiError] = useState<string | null>(null);
  const [showMultiModal, setShowMultiModal] = useState(false);

  // Helper to get/set multi-summaries in localStorage
  const MULTI_SUMMARY_KEY = 'ai_summary_multi_suggestions';
  function saveMultiSummariesToStorage(summaries: {
    professional: string;
    creative: string;
    friendly: string;
    technical: string;
  }) {
    try { localStorage.setItem(MULTI_SUMMARY_KEY, JSON.stringify(summaries)); } catch { /* ignore localStorage errors */ }
  }
  function getMultiSummariesFromStorage(): {
    professional: string;
    creative: string;
    friendly: string;
    technical: string;
  } | null {
    try {
      const raw = localStorage.getItem(MULTI_SUMMARY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.professional === 'string' &&
          typeof parsed.creative === 'string' &&
          typeof parsed.friendly === 'string' &&
          typeof parsed.technical === 'string'
        ) {
          return parsed;
        }
      }
    } catch { /* ignore localStorage/JSON errors */ }
    return null;
  }

  const validateAndUpdate = (field: keyof PersonalInfo, value: string) => {
    const newErrors = { ...errors }
    try {
      const error = validatePersonalInfoField(field, value);
      
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
    } catch { /* ignore errors from validatePersonalInfoField */ }

    setErrors(newErrors)
    updatePersonalInfo(field, value)
  }

  const handleMultiSuggest = async (force = false) => {
    const cached = !force && getMultiSummariesFromStorage();
    setShowMultiModal(true);
    setMultiError(null);
    if (cached) {
      setMultiSummaries(cached);
      setMultiLoading(false);
      return;
    }
    setMultiSummaries(null);
    setMultiLoading(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: personalInfo.summary ? 'improve' : 'generate', text: personalInfo.summary }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.summaries) {
        setMultiSummaries(data.summaries);
        saveMultiSummariesToStorage(data.summaries);
      } else setMultiError(data.error || 'AI error');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setMultiError(e.message || 'AI error');
      } else {
        setMultiError('An unexpected error occurred');
      }
    } finally {
      setMultiLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-6">
        <ValidatedInput
          label="Full Name"
          type="text"
          placeholder="e.g. John Doe"
          value={personalInfo.name}
          onChange={(value) => validateAndUpdate('name', value)}
          error={errors.name}
          maxLength={INPUT_LIMITS.NAME}
          pattern="[a-zA-Z .']*-"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput
            label="Email Address"
            type="email"
            placeholder="e.g. john@example.com"
            value={personalInfo.email}
            onChange={(value) => validateAndUpdate('email', value)}
            error={errors.email}
            maxLength={INPUT_LIMITS.EMAIL}
            required
          />

          <ValidatedInput
            label="Phone Number"
            type="tel"
            placeholder="e.g. (555) 123-4567"
            value={personalInfo.phone}
            onChange={(value) => validateAndUpdate('phone', value)}
            error={errors.phone}
            maxLength={INPUT_LIMITS.PHONE}
            pattern="[\+]?[\d\s\-\(\)]*"
          />
        </div>

        <ValidatedInput
          label="Location"
          type="text"
          placeholder="e.g. New York, NY"
          value={personalInfo.location}
          onChange={(value) => validateAndUpdate('location', value)}
          error={errors.location}
          maxLength={INPUT_LIMITS.LOCATION}
          pattern="[a-zA-Z0-9 ,.'-]*"
        />

        <ValidatedInput
          label="Professional Summary"
          type="textarea"
          placeholder="Briefly describe your professional background and goals..."
          value={personalInfo.summary}
          onChange={(value) => validateAndUpdate('summary', value)}
          error={errors.summary}
          maxLength={INPUT_LIMITS.SUMMARY}
          rows={4}
        >
          <button
            type="button"
            className="ml-2 text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-200 rounded px-2 py-1 transition-all duration-200"
            onClick={() => handleMultiSuggest()}
          >
            AI Suggest
          </button>
        </ValidatedInput>
        
        <p className="text-sm text-slate-500 mt-2">
          2-3 sentences highlighting your key strengths and career objectives 
          ({personalInfo.summary.length}/{INPUT_LIMITS.SUMMARY} characters)
        </p>
      </div>

      {/* Multi-Style Summary Modal */}
      <MultiStyleSummaryModal
        isOpen={showMultiModal}
        onClose={() => setShowMultiModal(false)}
        onRegenerate={() => handleMultiSuggest(true)}
        onSelectSummary={(summary) => updatePersonalInfo('summary', summary)}
        summaries={multiSummaries}
        loading={multiLoading}
        error={multiError}
        currentSummary={personalInfo.summary}
      />
    </div>
  )
} 