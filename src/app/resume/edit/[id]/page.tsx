'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

// Import all your interfaces from the new resume page
interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  summary: string
}

interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  school: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export default function EditResumePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '', email: '', phone: '', location: '', summary: ''
  })

  const [experiences, setExperiences] = useState<Experience[]>([
    { company: '', position: '', startDate: '', endDate: '', description: '' }
  ])

  const [education, setEducation] = useState<Education[]>([
    { school: '', degree: '', field: '', graduationDate: '', gpa: '' }
  ])

  const [skills, setSkills] = useState<Skill[]>([
    { name: '', level: 'Intermediate' }
  ])

  const [title, setTitle] = useState('')

  const [currentTemplate, setCurrentTemplate] = useState('')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
    else fetchResume()
  }, [session, status, router, params.id])

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${params.id}`)
      if (response.ok) {
        const resume = await response.json()
        setTitle(resume.title)
        setPersonalInfo(resume.personalInfo)
        setExperiences(resume.experiences.length > 0 ? resume.experiences : [{ company: '', position: '', startDate: '', endDate: '', description: '' }])
        setEducation(resume.education.length > 0 ? resume.education : [{ school: '', degree: '', field: '', graduationDate: '', gpa: '' }])
        setSkills(resume.skills.length > 0 ? resume.skills : [{ name: '', level: 'Intermediate' }])
        setCurrentTemplate(resume.template || '')
      } else if (response.status === 404) {
        alert('Resume not found')
        router.push('/dashboard')
      }
    } catch (error) {
      alert('Error loading resume')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const saveResume = async () => {
    setSaving(true)
    const resumeData = {
      title,
      personalInfo,
      experiences: experiences.filter(exp => exp.company || exp.position),
      education: education.filter(edu => edu.school || edu.degree),
      skills: skills.filter(skill => skill.name),
      template: currentTemplate
    }
    
    try {
      const response = await fetch(`/api/resumes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      })

      if (response.ok) {
        alert('Resume updated successfully!')
        router.push('/dashboard')
      } else {
        alert('Error updating resume')
      }
    } catch (error) {
      alert('Error updating resume')
    } finally {
      setSaving(false)
    }
  }

  const switchTemplate = (templateId: string) => {
    setCurrentTemplate(templateId)
    setShowTemplateSelector(false)
  }

  // Include all your existing helper functions (addExperience, updatePersonalInfo, etc.)
  // ... copy them from your new resume page

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  // Use the same JSX as your new resume page, but:
  // 1. Change the title to "Edit Resume"
  // 2. Add a title input field
  // 3. Change the save button to show "Update Resume"
  // 4. Add saving state to the button

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Resume</h1>
        <div className="space-x-3">
          <input
            type="text"
            placeholder="Resume Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={saveResume}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Resume'}
          </button>
        </div>
      </div>
      
      {/* Include all your form sections here - same as new resume page */}
    </div>
  )
} 