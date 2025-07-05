"use client"

import AIATSSection from "@/components/landing/AIATSSection"
import ComingSoonSection from "@/components/landing/ComingSoonSection"
import FAQSection from "@/components/landing/FAQSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import FinalCTASection from "@/components/landing/FinalCTASection"
import FooterSection from "@/components/landing/FooterSection"
import FreeModelSection from "@/components/landing/FreeModelSection"
import HeroSection from "@/components/landing/HeroSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import StatsSection from "@/components/landing/StatsSection"
import TestimonialsSection from "@/components/landing/TestimonialsSection"
import Header from "@/components/layout/Header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AIATSSection />
      <FreeModelSection />
      <ComingSoonSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </div>
  )
}