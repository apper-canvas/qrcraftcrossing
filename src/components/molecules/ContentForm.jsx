import { useState, useEffect } from "react"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ContentForm = ({ type, content, onChange, onGenerate, isDynamic = false, isEditing = false }) => {
  const [formData, setFormData] = useState(content || {})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(content || getDefaultContent(type))
  }, [type, content])

  const getDefaultContent = (type) => {
    switch (type) {
      case "url":
        return { url: "" }
      case "vcard":
        return { firstName: "", lastName: "", phone: "", email: "", organization: "" }
      case "wifi":
        return { ssid: "", password: "", security: "WPA" }
      case "text":
        return { text: "" }
      default:
        return {}
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    switch (type) {
      case "url":
        if (!formData.url) newErrors.url = "URL is required"
        else if (!/^https?:\/\/.+/.test(formData.url)) newErrors.url = "Please enter a valid URL"
        break
      case "vcard":
        if (!formData.firstName && !formData.lastName) newErrors.firstName = "Name is required"
        break
      case "wifi":
        if (!formData.ssid) newErrors.ssid = "Network name is required"
        break
      case "text":
        if (!formData.text) newErrors.text = "Text content is required"
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange(newData)
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onGenerate(formData)
    }
  }

  const renderForm = () => {
    switch (type) {
      case "url":
        return (
          <div className="space-y-6">
            <Input
              label="Website URL"
              placeholder="https://example.com"
              value={formData.url || ""}
              onChange={(e) => handleChange("url", e.target.value)}
              error={errors.url}
              icon="Globe"
            />
          </div>
        )
        
      case "vcard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                icon="User"
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                icon="User"
              />
            </div>
            <Input
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              icon="Phone"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              icon="Mail"
            />
            <Input
              label="Organization"
              placeholder="Company Name"
              value={formData.organization || ""}
              onChange={(e) => handleChange("organization", e.target.value)}
              icon="Building"
            />
          </div>
        )
        
      case "wifi":
        return (
          <div className="space-y-6">
            <Input
              label="Network Name (SSID)"
              placeholder="My WiFi Network"
              value={formData.ssid || ""}
              onChange={(e) => handleChange("ssid", e.target.value)}
              error={errors.ssid}
              icon="Wifi"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Network password"
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              icon="Lock"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["WPA", "WEP", "None"].map((security) => (
                  <button
                    key={security}
                    type="button"
                    onClick={() => handleChange("security", security)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors",
                      formData.security === security
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary-300"
                    )}
                  >
                    {security}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
        
      case "text":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <textarea
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 resize-none"
                rows={4}
                placeholder="Enter any text content..."
                value={formData.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
              />
              {errors.text && (
                <p className="text-sm text-red-600 flex items-center mt-2">
                  <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                  {errors.text}
                </p>
              )}
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  if (!type) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <div className="text-center">
          <ApperIcon name="ArrowUp" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Select a QR code type to get started</p>
        </div>
      </div>
    )
  }

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isDynamic && !isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Dynamic QR Code</h4>
              <p className="text-xs text-blue-700 mt-1">
                This QR code can be edited after creation without changing the physical code
              </p>
            </div>
          </div>
        </div>
      )}
      
      {renderForm()}
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" size="lg" className="btn-glow">
          <ApperIcon name={isEditing ? "Save" : "Zap"} className="w-5 h-5 mr-2" />
          {isEditing ? "Update Content" : "Generate QR Code"}
        </Button>
      </div>
    </form>
  )
}

export default ContentForm