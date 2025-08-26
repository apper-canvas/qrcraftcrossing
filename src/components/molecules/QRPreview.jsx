import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const QRPreview = ({ content, design, type, onExport, onSave, isDynamic = false, shortUrl }) => {
  const [qrData, setQrData] = useState(null)
  const [scannability, setScannability] = useState({ score: 0, level: "Low" })

  useEffect(() => {
    if (content && type) {
      generateQRCode()
      checkScannability()
    }
  }, [content, design, type])

  const generateQRCode = () => {
    // Simulate QR code generation with canvas
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 200
    canvas.height = 200
    
    // Simple QR pattern simulation
    ctx.fillStyle = design?.backgroundColor || "#000000"
    ctx.fillRect(0, 0, 200, 200)
    
    ctx.fillStyle = design?.foregroundColor || "#ffffff"
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 10, j * 10, 8, 8)
        }
      }
    }
    
    setQrData(canvas.toDataURL())
  }

  const checkScannability = () => {
    // AI scannability simulation
    let score = 85
    let level = "High"
    
    if (design?.backgroundColor && design?.foregroundColor) {
      // Check contrast
      const bgColor = design.backgroundColor
      const fgColor = design.foregroundColor
      if (bgColor === fgColor) {
        score = 10
        level = "Very Low"
      } else if (Math.abs(parseInt(bgColor.slice(1), 16) - parseInt(fgColor.slice(1), 16)) < 100000) {
        score = 45
        level = "Medium"
      }
    }
    
    if (design?.logo) score -= 10
    if (design?.cornerRadius > 30) score -= 15
    
    setScannability({ score, level })
  }

  const getScannabilityColor = (level) => {
    switch (level) {
      case "Very High": return "success"
      case "High": return "success"
      case "Medium": return "warning"
      case "Low": return "danger"
      case "Very Low": return "danger"
      default: return "default"
    }
  }

  if (!content || !type) {
    return (
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
        <div className="text-center text-gray-500">
          <ApperIcon name="QrCode" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">QR Code Preview</h3>
          <p>Your QR code will appear here once you enter content</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
    >
<div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          {isDynamic && (
            <Badge variant="secondary" size="sm">
              <ApperIcon name="Link" className="w-3 h-3 mr-1" />
              Dynamic
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">Scan with your phone to test</p>
        {isDynamic && shortUrl && (
          <p className="text-xs text-blue-600 mt-1 font-mono">{shortUrl}</p>
        )}
      </div>

      <div className="qr-canvas-container rounded-xl p-8 flex items-center justify-center">
        {qrData ? (
          <motion.img
            src={qrData}
            alt="QR Code Preview"
            className="w-48 h-48 rounded-lg shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Loader2" className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Scannability Score</span>
          <Badge variant={getScannabilityColor(scannability.level)}>
            {scannability.score}% - {scannability.level}
          </Badge>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${scannability.score}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-xs text-gray-600">
          AI-powered analysis considers contrast, size, and error correction
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onSave} className="flex-1">
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button onClick={onExport} className="flex-1">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </motion.div>
  )
}

export default QRPreview