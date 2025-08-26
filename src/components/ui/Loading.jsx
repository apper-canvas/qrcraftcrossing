import { motion } from "framer-motion"

const Loading = ({ variant = "default" }) => {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 animate-shimmer" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded-lg mb-3 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-lg mb-2 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-lg w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded-lg w-2/3 animate-pulse" />
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <motion.div 
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-gray-600 font-medium">Loading...</div>
        <div className="text-sm text-gray-400 mt-1">Please wait while we process your request</div>
      </div>
    </div>
  )
}

export default Loading