'use client'

import { motion } from "framer-motion"
import { Clock, Briefcase, Globe, Users, ChevronRight, ShieldCheck, FileText, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


const features = [
  {
    icon: Briefcase,
    title: "Smart Job Matching",
    description:
      "Automatically find and apply to relevant jobs on LinkedIn, Jobs.ph, Indeed, and other major job boards based on your resume.",
    badge: { text: "Q2 2024", color: "bg-orange-100 text-orange-700" },
    card: "bg-gradient-to-br from-orange-50 to-red-50",
  },
  {
    icon: Globe,
    title: "Global Job Search",
    description:
      "Expand your search internationally with region-specific resume optimization and job board integration.",
    badge: { text: "Q3 2024", color: "bg-purple-100 text-purple-700" },
    card: "bg-gradient-to-br from-purple-50 to-indigo-50",
  },
  {
    icon: Users,
    title: "Interview Prep AI",
    description:
      "Practice interviews with AI-powered mock interviews tailored to your industry and role.",
    badge: { text: "Q4 2024", color: "bg-green-100 text-green-700" },
    card: "bg-gradient-to-br from-green-50 to-teal-50",
  },
]

const comingSoonFeatures = [
  {
    icon: ShieldCheck,
    title: 'ATS Optimization',
    description: 'Advanced resume scanning and optimization to help you pass applicant tracking systems.'
  },
  {
    icon: FileText,
    title: 'CV & Letter Creation',
    description: 'Easily generate CVs and cover letters tailored to your job search.'
  },
  {
    icon: Search,
    title: 'Job Matching',
    description: 'Get matched with jobs from top sites like LinkedIn, Jobs.ph, and more.'
  },
]

const ComingSoonSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Coming Soon</h2>
      <p className="text-lg text-slate-600 mb-12">We’re working on powerful new features to make your job search even easier.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {comingSoonFeatures.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow p-8">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default ComingSoonSection 