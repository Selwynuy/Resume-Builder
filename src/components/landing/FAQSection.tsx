'use client'

import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Is ResumeAI really free?",
    answer:
      "Yes! Our core features are completely free. You can create resumes, use basic templates, and access AI suggestions without paying anything. Premium templates and PDF downloads require watching a short 30-second ad.",
  },
  {
    question: "How does the ATS optimization work?",
    answer:
      "Our AI analyzes your resume against ATS requirements, checking for proper formatting, keyword usage, and structure. You'll get a real-time score and specific recommendations to improve your resume's chances of passing through applicant tracking systems.",
  },
  {
    question: "What makes your AI suggestions different?",
    answer:
      "Our AI is trained on millions of successful resumes and job postings across industries. It provides personalized suggestions based on your specific role, experience level, and target industry, not generic advice.",
  },
  {
    question: "Can I use my resume on multiple job boards?",
    answer:
      "Our resumes are optimized for all major job boards and ATS systems. You can export in multiple formats (PDF, Word, plain text) to ensure compatibility everywhere you apply.",
  },
  {
    question: "When will the job matching feature be available?",
    answer:
      "We're planning to launch our smart job matching feature in Q2 2024. This will automatically find relevant positions on LinkedIn, Jobs.ph, Indeed, and other major job boards based on your resume. Join our waitlist to be notified!",
  },
]

const FAQSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-slate-600">Everything you need to know about our resume builder.</p>
      </div>
      <motion.div
        className="mx-auto w-full max-w-2xl divide-y divide-slate-200"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {faqs.map((faq, index) => {
          const [open, setOpen] = useState(false)
          return (
            <div key={index}>
              <button
                className="w-full flex items-center justify-between py-6 px-4 text-left focus:outline-none group"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
              >
                <span className="text-base md:text-lg font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-blue-500 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="px-4 pb-6 text-slate-600 text-base leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </motion.div>
    </div>
  </section>
)

export default FAQSection 