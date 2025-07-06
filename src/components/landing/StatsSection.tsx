'use client'

import { motion } from "framer-motion"

const stats = [
  { number: "500K+", label: "Resumes Created" },
  { number: "95%", label: "Success Rate" },
  { number: "50+", label: "Templates" },
  { number: "24/7", label: "Support" },
]

const StatsSection = () => (
  <section className="py-16 bg-white/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
            <div className="text-slate-600">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
)

export default StatsSection 