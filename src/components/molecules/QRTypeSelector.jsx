import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const QRTypeSelector = ({ selectedType, onTypeSelect }) => {
  const qrTypes = [
    {
      id: "url",
      name: "Website URL",
      icon: "Globe",
      description: "Link to website or webpage",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "vcard",
      name: "vCard Contact",
      icon: "User",
      description: "Share contact information",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      id: "wifi",
      name: "WiFi Network",
      icon: "Wifi",
      description: "Connect to WiFi network",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "text",
      name: "Plain Text",
      icon: "Type",
      description: "Any text content",
      gradient: "from-amber-500 to-orange-500"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {qrTypes.map((type, index) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onTypeSelect(type.id)}
          className={cn(
            "p-6 rounded-xl border-2 transition-all duration-200 text-left group",
            selectedType === type.id
              ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg"
              : "border-gray-200 bg-white hover:border-primary-300 hover:shadow-md"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
            selectedType === type.id
              ? `bg-gradient-to-br ${type.gradient}`
              : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:" + type.gradient
          )}>
            <ApperIcon 
              name={type.icon} 
              className={cn(
                "w-6 h-6",
                selectedType === type.id ? "text-white" : "text-gray-600 group-hover:text-white"
              )} 
            />
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{type.description}</p>
          
          {selectedType === type.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Check" className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  )
}

export default QRTypeSelector