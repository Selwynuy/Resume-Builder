import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen pt-28">
      <div className="container mx-auto px-6 py-16 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text mb-6">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Create stunning, professional resumes with our intelligent builder. 
            Choose from modern templates and let AI help you craft the perfect resume.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/templates" className="btn-gradient text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link href="/templates" className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-xl font-medium hover:bg-white/90 transition-all duration-300">
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">AI-Powered</h3>
            <p className="text-slate-600">
              Get intelligent suggestions for content, formatting, and optimization to make your resume stand out.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Professional Templates</h3>
            <p className="text-slate-600">
              Choose from a collection of modern, ATS-friendly templates designed by professionals.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Mobile Optimized</h3>
            <p className="text-slate-600">
              Build your resume anywhere, anytime. Our responsive design works perfectly on all devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 