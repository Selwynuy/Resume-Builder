'use client'

import { motion } from "framer-motion"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <FileText className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-[7rem] sm:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none mb-4">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            We&apos;re sorry, but the page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
} 