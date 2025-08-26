import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  icon,
  rightIcon,
  ...props 
}, ref) => {
  const inputClasses = cn(
    "w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200",
    "placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100",
    "disabled:bg-gray-50 disabled:cursor-not-allowed",
    error && "border-red-300 focus:border-red-500 focus:ring-red-100",
    icon && "pl-11",
    rightIcon && "pr-11",
    className
  )

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={rightIcon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input