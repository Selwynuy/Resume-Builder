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
    <section className="relative overflow-hidden pt-24 pb-10 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-white">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left column: text and buttons */}
        <div className="flex-1 flex flex-col items-start justify-center text-left max-w-xl">
          <span className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs tracking-wider border border-blue-200">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
            PROFESSIONAL AI RESUME BUILDER
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-2 leading-tight">
            Make your professional resume<br />
            <span className="text-blue-600">in minutes</span>
          </h1>
          <p className="mt-4 mb-8 text-lg text-slate-600 font-normal">
            Try our free resume builder and create a resume with the power of AI. Let the Genius resume maker help build your resume quickly and effortlessly.
          </p>
          <div className="flex flex-row gap-4 w-full mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-5 text-lg font-bold rounded-xl shadow-md transition-all duration-200"
              onClick={handleCreateNewDocument}
            >
              Build My Resume Now
            </Button>
            <div className="flex flex-col items-center">
              <Button
                size="lg"
                variant="outline"
                disabled
                className="border border-slate-300 bg-white text-slate-400 px-8 py-5 text-lg font-bold rounded-xl shadow-md cursor-not-allowed"
              >
                Upload My Existing Resume
              </Button>
              <span className="text-xs text-slate-400 mt-1">Coming soon</span>
            </div>
          </div>
        </div>
        {/* Right column: robot image */}
        <div className="flex-1 flex items-center justify-center relative">
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
      </div>
    </section>
  )
}

export default HeroSection 