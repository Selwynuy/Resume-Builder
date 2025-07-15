'use client'

import { motion } from "framer-motion"
import { Brain, Target, FileText, Zap, Shield, Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Content",
    description: "Smart suggestions for bullet points, skills, and achievements tailored to your industry",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Built-in ATS scanner ensures your resume passes through applicant tracking systems",
  },
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from 50+ professionally designed templates that recruiters love",
  },
  {
    icon: Zap,
    title: "Real-time Preview",
    description: "See your changes instantly with our live preview feature",
  },
  {
    icon: Shield,
    title: "Privacy Secure",
    description: "Your data is encrypted and secure. We never share your information",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Export in PDF, Word, or plain text formats",
  },
]

const FeaturesSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Features</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
          Everything You Need to Land Your Dream Job
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Our AI-powered platform combines cutting-edge technology with proven resume strategies to help you stand
          out from the competition.
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
          >
            <CardContent className="p-6 flex flex-row items-start gap-4">
              <div className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center mt-1"
                style={{ background: index === 0 ? '#F3F6FF' : index === 1 ? '#FFF6E5' : index === 2 ? '#FFF3F0' : index === 3 ? '#F3F6FF' : index === 4 ? '#F3F6FF' : '#FFFBEA' }}>
                <feature.icon className={`w-8 h-8 ${index === 0 ? 'text-blue-800' : index === 1 ? 'text-orange-500' : index === 2 ? 'text-orange-500' : index === 3 ? 'text-blue-800' : index === 4 ? 'text-blue-800' : 'text-yellow-500'}`} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-1">{feature.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  </section>
)

export default FeaturesSection 