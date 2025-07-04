import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Eye, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const FreeModelSection = () => (
  <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-4">
        <CheckCircle className="w-4 h-4 mr-1" />
        100% Free
      </Badge>
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Completely Free Resume Builder</h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
        We believe everyone deserves access to professional resume tools. That&apos;s why our platform is completely free
        - just watch a short ad to unlock premium templates and PDF downloads.
      </p>
      <motion.div
        className="grid md:grid-cols-3 gap-8 mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
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
      </motion.div>
      <Button
        size="lg"
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Start Building for Free
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  </section>
)

export default FreeModelSection 