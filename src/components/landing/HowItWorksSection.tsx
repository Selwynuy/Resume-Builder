'use client'

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: "01",
    title: "Start from Landing Page",
    description: "Click 'Build My Resume Now' or 'Upload My Existing Resume' to begin.",
  },
  {
    number: "02",
    title: "Select Document Type & Template",
    description: "Pick your document type (Resume, CV, Biodata) and choose a template you like.",
  },
  {
    number: "03",
    title: "Fill in Details with AI Help",
    description: "Enter your info and use AI-powered suggestions for each section.",
  },
  {
    number: "04",
    title: "Preview & Customize",
    description: "See your resume live, tweak the design, and make final edits.",
  },
  {
    number: "05",
    title: "Download & Use",
    description: "Export your resume in PDF, Word, or TXT and start applying!",
  },
]

const HowItWorksSection = () => (
  <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 mb-4">How It Works</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Create Your Resume in 5 Simple Steps</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Our streamlined process makes it easy to create a professional resume that gets results.
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center px-2 min-h-[260px] justify-start">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-5">
              {step.number}
            </div>
            <div className="flex flex-col justify-start h-full w-full">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-tight min-h-[48px] flex items-center justify-center">{step.title}</h3>
              <p className="text-base text-slate-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
)

export default HowItWorksSection 