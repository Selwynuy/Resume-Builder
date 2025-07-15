import { Metadata } from 'next'

import FAQSection from '@/components/landing/FAQSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import FinalCTASection from '@/components/landing/FinalCTASection'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import FooterSection from '@/components/landing/FooterSection'
import ComingSoonSection from '@/components/landing/ComingSoonSection'

export const metadata: Metadata = {
  title: 'Resume Builder - Create Professional Resumes in Minutes',
  description: 'Build professional resumes with AI-powered suggestions. Choose from modern templates, customize content, and export to PDF. Free to use with premium features available.',
  keywords: 'resume builder, professional resume, CV maker, job application, career tools',
  openGraph: {
    title: 'Resume Builder - Create Professional Resumes in Minutes',
    description: 'Build professional resumes with AI-powered suggestions. Choose from modern templates, customize content, and export to PDF.',
    type: 'website',
    url: 'https://resumebuilder.com',
  },
}

// Static generation for landing page - content doesn't change frequently
export const revalidate = 3600 // Revalidate every hour

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ComingSoonSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </main>
  )
}