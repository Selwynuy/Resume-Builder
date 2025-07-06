'use client'

import { motion } from "framer-motion"
import { Clock, Briefcase, Globe, Users, ChevronRight } from "lucide-react"

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

const ComingSoonSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-4">
          <Clock className="w-4 h-4 mr-1" />
          Coming Soon
        </Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Exciting Features on the Horizon</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          We&apos;re constantly innovating to make your job search even more effective. Here&apos;s what&apos;s coming next!
        </p>
      </div>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 ${feature.card}`}
          >
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">{feature.description}</p>
              <Badge className={feature.badge.color}>{feature.badge.text}</Badge>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      <div className="text-center mt-12">
        <p className="text-slate-600 mb-6">Want to be notified when these features launch?</p>
        <Button
          variant="outline"
          className="border-2 border-orange-300 hover:border-orange-500 hover:text-orange-600 bg-transparent"
        >
          Join the Waitlist
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </section>
)

export default ComingSoonSection 