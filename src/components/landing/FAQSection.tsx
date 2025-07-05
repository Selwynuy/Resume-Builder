import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 mb-4">FAQ</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-slate-600">Everything you need to know about our resume builder.</p>
      </div>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  </section>
)

export default FAQSection 