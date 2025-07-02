import { FileText } from "lucide-react"
import { motion } from "framer-motion"

const FooterSection = () => (
  <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            The AI-powered resume builder that helps you land your dream job. Create professional, ATS-optimized
            resumes in minutes.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <div className="space-y-2">
            <a href="/templates" className="block text-slate-400 hover:text-white transition-colors">
              Templates
            </a>
            <a href="/create" className="block text-slate-400 hover:text-white transition-colors">
              Resume Builder
            </a>
            <a href="/ats-checker" className="block text-slate-400 hover:text-white transition-colors">
              ATS Checker
            </a>
            <a href="/cover-letter" className="block text-slate-400 hover:text-white transition-colors">
              Cover Letters
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <div className="space-y-2">
            <a href="/blog" className="block text-slate-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="/resume-tips" className="block text-slate-400 hover:text-white transition-colors">
              Resume Tips
            </a>
            <a href="/career-advice" className="block text-slate-400 hover:text-white transition-colors">
              Career Advice
            </a>
            <a href="/help" className="block text-slate-400 hover:text-white transition-colors">
              Help Center
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <div className="space-y-2">
            <a href="/about" className="block text-slate-400 hover:text-white transition-colors">
              About Us
            </a>
            <a href="/contact" className="block text-slate-400 hover:text-white transition-colors">
              Contact
            </a>
            <a href="/privacy" className="block text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="block text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-slate-400">© 2024 ResumeAI. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">
            Facebook
          </a>
        </div>
      </div>
    </motion.div>
  </footer>
)

export default FooterSection 