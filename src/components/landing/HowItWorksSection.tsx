import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Choose Template",
    description: "Select from our collection of ATS-friendly templates",
  },
  {
    number: "02",
    title: "Add Your Info",
    description: "Fill in your details with AI-powered suggestions",
  },
  {
    number: "03",
    title: "Optimize & Score",
    description: "Get your ATS score and optimization tips",
  },
  {
    number: "04",
    title: "Download & Apply",
    description: "Export your resume and start applying!",
  },
]

const HowItWorksSection = () => (
  <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 mb-4">How It Works</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Create Your Resume in 4 Simple Steps</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Our streamlined process makes it easy to create a professional resume that gets results.
        </p>
      </div>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-full w-full">
                <ArrowRight className="w-6 h-6 text-blue-400 mx-auto" />
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
)

export default HowItWorksSection 