import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const CustomizationPanel = ({ design, onChange }) => {
  const [activeTab, setActiveTab] = useState("colors")

  const tabs = [
    { id: "colors", label: "Colors", icon: "Palette" },
    { id: "style", label: "Style", icon: "Shapes" },
    { id: "logo", label: "Logo", icon: "Image" }
  ]

  const colorPresets = [
    { name: "Classic", bg: "#ffffff", fg: "#000000" },
    { name: "Ocean", bg: "#dbeafe", fg: "#1e40af" },
    { name: "Forest", bg: "#dcfce7", fg: "#166534" },
    { name: "Sunset", bg: "#fed7aa", fg: "#c2410c" },
    { name: "Purple", bg: "#f3e8ff", fg: "#7c3aed" },
    { name: "Dark", bg: "#1f2937", fg: "#ffffff" }
  ]

  const patterns = [
    { name: "Square", value: "square" },
    { name: "Rounded", value: "rounded" },
    { name: "Dots", value: "dots" },
    { name: "Circles", value: "circles" }
  ]

  const handleColorChange = (preset) => {
    onChange({
      ...design,
      backgroundColor: preset.bg,
      foregroundColor: preset.fg
    })
  }

  const handleStyleChange = (property, value) => {
    onChange({
      ...design,
      [property]: value
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors",
                activeTab === tab.id
                  ? "text-primary-600 bg-primary-50 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "colors" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Color Presets</h4>
              <div className="grid grid-cols-3 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleColorChange(preset)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors text-center group"
                  >
                    <div className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-gray-200 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 w-1/2" 
                        style={{ backgroundColor: preset.bg }}
                      />
                      <div 
                        className="absolute inset-0 w-1/2 right-0" 
                        style={{ backgroundColor: preset.fg }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-gray-900">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Custom Colors</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                  <input
                    type="color"
                    value={design?.backgroundColor || "#ffffff"}
                    onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Foreground</label>
                  <input
                    type="color"
                    value={design?.foregroundColor || "#000000"}
                    onChange={(e) => handleStyleChange("foregroundColor", e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Pattern Style</h4>
              <div className="grid grid-cols-2 gap-2">
                {patterns.map((pattern) => (
                  <button
                    key={pattern.value}
                    onClick={() => handleStyleChange("pattern", pattern.value)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-colors",
                      design?.pattern === pattern.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary-300"
                    )}
                  >
                    {pattern.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Corner Radius</h4>
              <input
                type="range"
                min="0"
                max="50"
                value={design?.cornerRadius || 0}
                onChange={(e) => handleStyleChange("cornerRadius", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sharp</span>
                <span>{design?.cornerRadius || 0}%</span>
                <span>Rounded</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Size</h4>
              <div className="grid grid-cols-3 gap-2">
                {[200, 300, 400].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleStyleChange("size", size)}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                      design?.size === size
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary-300"
                    )}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "logo" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Add Logo</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ApperIcon name="Upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">Drop your logo here or click to browse</p>
                <Button variant="secondary" size="sm">
                  <ApperIcon name="Image" className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>

            {design?.logo && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Logo Size</h4>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={design?.logoSize || 20}
                  onChange={(e) => handleStyleChange("logoSize", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Small</span>
                  <span>{design?.logoSize || 20}%</span>
                  <span>Large</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomizationPanel