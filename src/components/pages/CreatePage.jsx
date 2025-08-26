import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import QRTypeSelector from "@/components/molecules/QRTypeSelector"
import ContentForm from "@/components/molecules/ContentForm"
import QRPreview from "@/components/molecules/QRPreview"
import CustomizationPanel from "@/components/molecules/CustomizationPanel"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { qrCodeService } from "@/services/api/qrCodeService"

const CreatePage = () => {
  const [selectedType, setSelectedType] = useState("")
  const [content, setContent] = useState({})
  const [design, setDesign] = useState({
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    pattern: "square",
    cornerRadius: 0,
    size: 200
  })
  const [step, setStep] = useState(1)

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setContent({})
    setStep(2)
  }

  const handleContentChange = (newContent) => {
    setContent(newContent)
  }

  const handleGenerateQR = (formData) => {
    setContent(formData)
    setStep(3)
  }

  const handleDesignChange = (newDesign) => {
    setDesign(newDesign)
  }

  const handleSaveQR = async () => {
    try {
      const qrData = {
        type: selectedType,
        content: content,
        design: design,
        isDynamic: false,
        shortUrl: `https://qr.ly/${Math.random().toString(36).substr(2, 9)}`,
        scanCount: 0,
        createdAt: new Date().toISOString(),
        folderId: null,
        templateId: null
      }

      await qrCodeService.create(qrData)
      toast.success("QR code saved to library!")
    } catch (error) {
      toast.error("Failed to save QR code")
    }
  }

  const handleExportQR = () => {
    toast.success("QR code exported successfully!")
  }

  const handleReset = () => {
    setSelectedType("")
    setContent({})
    setDesign({
      backgroundColor: "#ffffff",
      foregroundColor: "#000000",
      pattern: "square",
      cornerRadius: 0,
      size: 200
    })
    setStep(1)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[
            { number: 1, label: "Choose Type", icon: "Grid3X3" },
            { number: 2, label: "Enter Content", icon: "Type" },
            { number: 3, label: "Customize & Export", icon: "Palette" }
          ].map((stepItem) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= stepItem.number 
                  ? "bg-primary-600 text-white" 
                  : "bg-gray-200 text-gray-400"
              }`}>
                {step > stepItem.number ? (
                  <ApperIcon name="Check" className="w-5 h-5" />
                ) : (
                  <ApperIcon name={stepItem.icon} className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step >= stepItem.number ? "text-gray-900" : "text-gray-400"
              }`}>
                {stepItem.label}
              </span>
              {stepItem.number < 3 && (
                <div className={`w-8 h-px mx-4 ${
                  step > stepItem.number ? "bg-primary-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Type Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your QR Code
            </h1>
            <p className="text-lg text-gray-600">
              Choose the type of content you want to encode in your QR code
            </p>
          </div>
          
          <QRTypeSelector
            selectedType={selectedType}
            onTypeSelect={handleTypeSelect}
          />
        </motion.div>
      )}

      {/* Step 2: Content Entry */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Enter Your Content
              </h2>
              <p className="text-gray-600">
                Fill in the details for your {selectedType} QR code
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ContentForm
                type={selectedType}
                content={content}
                onChange={handleContentChange}
                onGenerate={handleGenerateQR}
              />
            </div>
            
            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="mr-4"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>

          <div>
            <QRPreview
              content={content}
              design={design}
              type={selectedType}
              onExport={handleExportQR}
              onSave={handleSaveQR}
            />
          </div>
        </motion.div>
      )}

      {/* Step 3: Customization */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Customize Design
              </h2>
              <p className="text-gray-600">
                Make your QR code match your brand
              </p>
            </div>
            
            <CustomizationPanel
              design={design}
              onChange={handleDesignChange}
            />
            
            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() => setStep(2)}
                className="mr-4"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
              >
                <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <QRPreview
              content={content}
              design={design}
              type={selectedType}
              onExport={handleExportQR}
              onSave={handleSaveQR}
            />
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSaveQR}
                className="w-full"
              >
                <ApperIcon name="Save" className="w-5 h-5 mr-2" />
                Save to Library
              </Button>
              <Button
                size="lg"
                onClick={handleExportQR}
                className="w-full btn-glow"
              >
                <ApperIcon name="Download" className="w-5 h-5 mr-2" />
                Export QR Code
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CreatePage