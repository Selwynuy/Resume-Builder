'use client'

import { motion } from "framer-motion"
import { FileText, Upload, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

const FinalCTASection = () => (
  <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Land Your Dream Job?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who&apos;ve successfully created ATS-optimized resumes with our AI-powered
          platform. Start building your perfect resume today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/templates?modal=open">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Create Resume Free
            </Button>
          </a>
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="lg"
              disabled
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent cursor-not-allowed"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload My Resume
            </Button>
            <span className="text-xs text-blue-100 mt-1">Coming soon</span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-8 mt-8 text-blue-100">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>ATS Optimized</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

export default FinalCTASection 