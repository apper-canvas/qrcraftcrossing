import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: "Create", href: "/", icon: "Plus" },
    { name: "Library", href: "/library", icon: "FolderOpen" },
    { name: "Templates", href: "/templates", icon: "Layout" },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ]

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/"
    return location.pathname.startsWith(href)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <ApperIcon name="QrCode" className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold gradient-text font-display">QRCraft Pro</h1>
                <p className="text-xs text-gray-500 font-medium">AI-Powered QR Generator</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button size="sm" className="hidden sm:inline-flex">
              <ApperIcon name="Sparkles" className="w-4 h-4 mr-2" />
              Upgrade Pro
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                <Button size="sm" className="w-full">
                  <ApperIcon name="Sparkles" className="w-4 h-4 mr-2" />
                  Upgrade Pro
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header