'use client'

import { motion, useAnimation } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import React from 'react'

const HeroSection = () => {
  const robotRef = useRef(null)
  const controls = useAnimation()
  const router = useRouter()

  const handleCreateNewDocument = () => {
    router.push('/templates?modal=open')
  }

  useEffect(() => {
    controls.start({
      y: [ -24, 24, -24 ],
      transition: { duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
    })
  }, [controls])

  return (
    <section className="relative overflow-hidden pt-24 pb-10 px-4 sm:px-6 lg:px-8 h-screen bg-gradient-radial from-blue-50 via-white to-white">
      {/* Big heading behind robot */}
      <h1
        className="absolute z-10 left-1/2 top-16 -translate-x-1/2 text-[clamp(2.5rem,10vw,6rem)] font-extrabold text-slate-800 select-none pointer-events-none whitespace-nowrap tracking-tight opacity-95"
        style={{ textShadow: '0 4px 24px rgba(0,0,0,0.18), 0 1.5px 0 #fff' }}
      >
        Build Your Future
      </h1>
      {/* Animated blue blob background */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-400/70 rounded-full blur-3xl opacity-80 animate-pulse z-0 pointer-events-none" />
      {/* Animated purple blob */}
      <div className="absolute top-40 -left-40 w-[400px] h-[300px] bg-purple-400/60 rounded-full blur-3xl opacity-70 animate-pulse z-0 pointer-events-none" />
      {/* Animated teal blob */}
      <div className="absolute bottom-0 right-0 w-[350px] h-[250px] bg-teal-400/60 rounded-full blur-3xl opacity-70 animate-pulse z-0 pointer-events-none" />
      {/* Animated bubble blobs */}
      <div className="absolute z-0 pointer-events-none w-full h-full">
        <div className="absolute left-20 top-24 w-12 h-12 bg-blue-300/70 rounded-full blur-md opacity-80 animate-bounce" />
        <div className="absolute left-1/4 top-2/3 w-8 h-8 bg-indigo-200/80 rounded-full blur-sm opacity-70 animate-bounce" style={{ left: '25%', top: '66%' }} />
        <div className="absolute right-40 top-1/3 w-10 h-10 bg-cyan-200/80 rounded-full blur-md opacity-60 animate-bounce" />
        <div className="absolute right-1/4 bottom-24 w-7 h-7 bg-blue-200/80 rounded-full blur-sm opacity-70 animate-bounce" style={{ right: '25%' }} />
        <div className="absolute left-1/2 bottom-10 w-9 h-9 bg-indigo-300/70 rounded-full blur-md opacity-60 animate-bounce" style={{ left: '50%' }} />
      </div>
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left value prop */}
        <div className="flex-1 max-w-md text-slate-700 font-semibold text-lg mb-8 lg:mb-0">
          <div className="bg-white/30 rounded-xl p-6">
            Create stunning, ATS-optimized resumes with AI-powered suggestions and a futuristic design.<br />Free, fast, and easy.
          </div>
        </div>
        {/* Robot + ellipse */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Ellipse */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-72 h-32 bg-gradient-to-r from-blue-400/60 to-indigo-400/60 rounded-full blur-2xl z-0" data-testid="hero-ellipse" />
          {/* Robot */}
          <motion.img
            ref={robotRef}
            src="/images/Roboto.png"
            alt="AI Robot holding resume"
            width={420}
            height={420}
            className="relative z-10 drop-shadow-xl"
            animate={controls}
          />
        </div>
        {/* Right features */}
        <div className="flex-1 max-w-md text-slate-700 font-semibold text-lg flex flex-col gap-4 items-end">
          <div className="bg-white/30 rounded-xl p-6 w-full">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              100% Free Forever
            </div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              ATS Optimized
            </div>
          </div>
        </div>
      </div>
      {/* CTA Buttons below hero */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
        <motion.div
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          className=""
        >
          <Button
            size="lg"
            variant="outline"
            onClick={handleCreateNewDocument}
            className="border-2 border-slate-300 hover:border-slate-400 bg-white/80 backdrop-blur-sm text-slate-700 hover:text-slate-800 px-10 py-5 text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-300 hover:shadow-[0_0_24px_4px_rgba(0,0,0,0.1)] hover:scale-105"
          >
            Create New Document
          </Button>
        </motion.div>
      </div>
      {/* Trust badges & testimonial */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-14">
      </div>
    </section>
  )
}

export default HeroSection 