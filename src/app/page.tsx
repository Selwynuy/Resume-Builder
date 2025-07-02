import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb]">
      {/* Main Content */}
      <main className="flex-1 pt-28">
        <div className="container mx-auto px-6 py-16 text-center">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Professional Resume Builder
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Create a job-winning resume in minutes with our easy-to-use builder and modern templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resume/new" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-full px-8 py-4 text-lg shadow transition">
                Create Your Resume Now
              </Link>
              <Link href="/templates" className="bg-white text-blue-700 border border-blue-200 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition">
                Browse Templates
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
            <div className="bg-white p-8 rounded-2xl text-center shadow hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Easy to Use</h3>
              <p className="text-gray-600">
                Build your resume step-by-step with a simple, intuitive interface.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Modern Templates</h3>
              <p className="text-gray-600">
                Choose from a collection of professional, ATS-friendly templates.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Mobile Optimized</h3>
              <p className="text-gray-600">
                Build your resume anywhere, anytime. Our responsive design works on all devices.
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold">Resume Builder</span>
          </div>
          <nav>
            <ul className="flex flex-wrap gap-6 text-lg font-medium">
              <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link href="/templates" className="hover:underline">Templates</Link></li>
              <li><Link href="/resume/new" className="hover:underline">Create Resume</Link></li>
              <li><Link href="/login" className="hover:underline">Login</Link></li>
            </ul>
          </nav>
        </div>
        <div className="text-center text-blue-100 text-sm mt-6">&copy; {new Date().getFullYear()} Resume Builder. All rights reserved.</div>
      </footer>
    </div>
  )
} 