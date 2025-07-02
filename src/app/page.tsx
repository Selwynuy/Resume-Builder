"use client"

import Header from "@/components/layout/Header"
import HeroSection from "@/components/landing/HeroSection"
import StatsSection from "@/components/landing/StatsSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import AIATSSection from "@/components/landing/AIATSSection"
import FreeModelSection from "@/components/landing/FreeModelSection"
import ComingSoonSection from "@/components/landing/ComingSoonSection"
import TestimonialsSection from "@/components/landing/TestimonialsSection"
import FAQSection from "@/components/landing/FAQSection"
import FinalCTASection from "@/components/landing/FinalCTASection"
import FooterSection from "@/components/landing/FooterSection"

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