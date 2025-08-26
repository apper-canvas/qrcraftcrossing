import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ContentForm from "@/components/molecules/ContentForm"
import { qrCodeService } from "@/services/api/qrCodeService"

const EditQRModal = ({ qrCode, isOpen, onClose, onUpdate }) => {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (qrCode && isOpen) {
      setContent(qrCode.content || {})
    }
  }, [qrCode, isOpen])

  const handleContentChange = (newContent) => {
    setContent(newContent)
  }

  const handleSave = async (formData) => {
    try {
      setLoading(true)
      const updatedQR = await qrCodeService.updateContent(qrCode.Id, formData)
      onUpdate(updatedQR)
      toast.success("QR code content updated successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to update QR code content")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !qrCode) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Dynamic QR Code</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update the content without changing the QR code
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {/* QR Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="Link" className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Short URL</h4>
                    <p className="text-xs text-blue-700 font-mono">{qrCode.shortUrl}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-700">Scans</div>
                  <div className="text-sm font-semibold text-blue-900">{qrCode.scanCount}</div>
                </div>
              </div>
            </div>

            {/* Content Form */}
            <ContentForm
              type={qrCode.type}
              content={content}
              onChange={handleContentChange}
              onGenerate={handleSave}
              isDynamic={true}
              isEditing={true}
            />
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EditQRModal