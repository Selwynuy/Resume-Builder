"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Play,
  Star,
  Users,
  FileText,
  Zap,
  Brain,
  Target,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Download,
  Eye,
  Briefcase,
  Globe,
  ChevronRight,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      content:
        "This resume builder helped me land my dream job! The AI suggestions were spot-on and the ATS optimization really worked.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Growth Inc",
      content:
        "The templates are professional and the free model with ads is perfect for job seekers on a budget. Highly recommended!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Design Studio",
      content:
        "Love the clean interface and the AI-powered content suggestions. Made creating my resume so much easier!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      dropdown: [
        { name: "My Resumes", href: "/dashboard/resumes" },
        { name: "Analytics", href: "/dashboard/analytics" },
        { name: "Settings", href: "/dashboard/settings" },
      ],
    },
    {
      name: "Templates",
      href: "/templates",
      dropdown: [
        { name: "Professional", href: "/templates/professional" },
        { name: "Creative", href: "/templates/creative" },
        { name: "Modern", href: "/templates/modern" },
        { name: "Executive", href: "/templates/executive" },
      ],
    },
    {
      name: "Create Resume",
      href: "/create",
      dropdown: [
        { name: "From Scratch", href: "/create/new" },
        { name: "Import LinkedIn", href: "/create/linkedin" },
        { name: "Upload Resume", href: "/create/upload" },
      ],
    },
    {
      name: "Resources",
      href: "/resources",
      dropdown: [
        { name: "Resume Tips", href: "/resources/tips" },
        { name: "Cover Letters", href: "/resources/cover-letters" },
        { name: "Interview Prep", href: "/resources/interviews" },
        { name: "Career Advice", href: "/resources/career" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI-Powered Resume Builder
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Create Your{" "}
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
            </div>

            <div className="relative">
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
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500K+", label: "Resumes Created" },
              { number: "95%", label: "Success Rate" },
              { number: "50+", label: "Templates" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 mb-4">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Create Your Resume in 4 Simple Steps</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our streamlined process makes it easy to create a professional resume that gets results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          </div>
        </div>
      </section>

      {/* AI & ATS Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
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
            </div>

            <div className="relative">
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
            </div>
          </div>
        </div>
      </section>

      {/* Free Model Explanation */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-4">
            <CheckCircle className="w-4 h-4 mr-1" />
            100% Free
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Completely Free Resume Builder</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            We believe everyone deserves access to professional resume tools. That's why our platform is completely free
            - just watch a short ad to unlock premium templates and PDF downloads.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Free Templates</h3>
                <p className="text-slate-600">Access to 10+ professional templates completely free</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Watch Ad for Premium</h3>
                <p className="text-slate-600">30-second ad unlocks premium templates and PDF export</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Hidden Fees</h3>
                <p className="text-slate-600">No subscriptions, no credit cards, no surprises</p>
              </CardContent>
            </Card>
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Building for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-4">
              <Clock className="w-4 h-4 mr-1" />
              Coming Soon
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Exciting Features on the Horizon</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're constantly innovating to make your job search even more effective. Here's what's coming next!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Job Matching</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Automatically find and apply to relevant jobs on LinkedIn, Jobs.ph, Indeed, and other major job boards
                  based on your resume.
                </p>
                <Badge className="bg-orange-100 text-orange-700">Q2 2024</Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Global Job Search</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Expand your search internationally with region-specific resume optimization and job board integration.
                </p>
                <Badge className="bg-purple-100 text-purple-700">Q3 2024</Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-teal-50">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Interview Prep AI</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Practice interviews with AI-powered mock interviews tailored to your industry and role.
                </p>
                <Badge className="bg-green-100 text-green-700">Q4 2024</Badge>
              </CardContent>
            </Card>
          </div>

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

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">
              <Star className="w-4 h-4 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Loved by Job Seekers Worldwide</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of professionals who've landed their dream jobs using our platform.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="text-center">
                  <Quote className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                  <p className="text-xl text-slate-700 leading-relaxed mb-8">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
                      <div className="text-sm text-slate-500">{testimonials[currentTestimonial].company}</div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-1 mt-6">
                    {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 mb-4">FAQ</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know about our resume builder.</p>
          </div>

          <div className="space-y-6">
            {[
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
            ].map((faq, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've successfully created ATS-optimized resumes with our AI-powered
            platform. Start building your perfect resume today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Create Resume Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </footer>
    </div>
  )
}
