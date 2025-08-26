import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center py-20"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
        
        {onAction && (
          <Button onClick={onAction} size="lg" className="btn-glow">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center">
            <ApperIcon name="Zap" className="w-4 h-4 mr-1" />
            AI Optimized
          </div>
          <div className="flex items-center">
            <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
            Secure
          </div>
          <div className="flex items-center">
            <ApperIcon name="Smartphone" className="w-4 h-4 mr-1" />
            Mobile Ready
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty