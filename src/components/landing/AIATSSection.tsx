'use client'

import { motion } from "framer-motion"
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const AIATSSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 mb-4">
              <Brain className="w-4 h-4 mr-1" />
              AI Technology
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Smart AI That Understands Your Career
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Our advanced AI analyzes millions of successful resumes and job postings to provide personalized
              suggestions that match your industry and experience level.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Intelligent Content Suggestions</h3>
                <p className="text-slate-600">
                  Get AI-powered bullet points and achievements tailored to your role and industry.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">ATS Score & Optimization</h3>
                <p className="text-slate-600">
                  Real-time ATS compatibility scoring with specific recommendations for improvement.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Industry-Specific Keywords</h3>
                <p className="text-slate-600">
                  Automatically identify and suggest relevant keywords for your target role.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">ATS Compatibility Score</h3>
                <Badge className="bg-green-100 text-green-700">Excellent</Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Keyword Optimization</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full">
                      <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Format Compatibility</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full">
                      <div className="w-22 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Content Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full">
                      <div className="w-full h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">98%</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">AI Suggestion</p>
                    <p className="text-sm text-blue-700">
                      Add 2 more technical skills to improve keyword matching for Software Engineer roles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

export default AIATSSection 