'use client'

import { motion } from "framer-motion"
import { FileText, Play, CheckCircle, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const HeroSection = () => (
  <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Powered Resume Builder
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Create Your {" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Perfect Resume
              </span>{" "}
              in Minutes
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Build ATS-optimized resumes with AI assistance. Get hired faster with our professional templates and
              smart content suggestions.
              <span className="font-semibold text-blue-600"> Completely free</span> - just watch a short ad to
              unlock premium features!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Create Resume Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>ATS Optimized</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full"></div>
                <div>
                  <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded w-4/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-blue-100 rounded w-20"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl transform -rotate-6 opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl transform rotate-12 opacity-10"></div>
        </motion.div>
      </div>
    </div>
  </section>
)

export default HeroSection 