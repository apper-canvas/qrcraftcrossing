import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { qrCodeService } from "@/services/api/qrCodeService"
import { folderService } from "@/services/api/folderService"
import { formatDistanceToNow } from "date-fns"

const QRLibrary = () => {
const [qrCodes, setQrCodes] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [editingQR, setEditingQR] = useState(null)
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError(null)
      setLoading(true)
      const [qrData, folderData] = await Promise.all([
        qrCodeService.getAll(),
        folderService.getAll()
      ])
      setQrCodes(qrData)
      setFolders(folderData)
    } catch (err) {
      setError("Failed to load QR codes")
    } finally {
      setLoading(false)
    }
  }

const handleEdit = (qrCode) => {
    setEditingQR(qrCode)
  }

  const handleEditComplete = (updatedQR) => {
    setQrCodes(qrCodes.map(qr => qr.Id === updatedQR.Id ? updatedQR : qr))
    setEditingQR(null)
  }

  const handleDelete = async (id) => {
    try {
      await qrCodeService.delete(id)
      setQrCodes(qrCodes.filter(qr => qr.Id !== id))
      toast.success("QR code deleted successfully")
    } catch (err) {
      toast.error("Failed to delete QR code")
    }
  }

  const handleDownload = (qrCode) => {
    // Simulate download
    toast.success(`Downloaded ${qrCode.content?.url || "QR code"}`)
  }

  const filteredQrCodes = qrCodes.filter(qr => {
    const matchesSearch = !searchQuery || 
      qr.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(qr.content).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFolder = selectedFolder === "all" || qr.folderId === selectedFolder
    
    return matchesSearch && matchesFolder
  })

  const getQRTypeIcon = (type) => {
    switch (type) {
      case "url": return "Globe"
      case "vcard": return "User"
      case "wifi": return "Wifi"
      case "text": return "Type"
      default: return "QrCode"
    }
  }

  const getQRTypeLabel = (type) => {
    switch (type) {
      case "url": return "Website URL"
      case "vcard": return "vCard Contact"
      case "wifi": return "WiFi Network"
      case "text": return "Plain Text"
      default: return "QR Code"
    }
  }

  const getContentPreview = (qrCode) => {
    switch (qrCode.type) {
      case "url":
        return qrCode.content?.url
      case "vcard":
        return `${qrCode.content?.firstName || ""} ${qrCode.content?.lastName || ""}`.trim()
      case "wifi":
        return qrCode.content?.ssid
      case "text":
        return qrCode.content?.text
      default:
        return "QR Code"
    }
  }

  if (loading) return <Loading variant="card" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Library</h2>
          <p className="text-gray-600 mt-1">Manage and organize your QR codes</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Search QR codes..."
            className="w-64"
          />
          
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ApperIcon name="Grid3X3" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ApperIcon name="List" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Folders</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder("all")}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedFolder === "all" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name="FolderOpen" className="w-4 h-4 mr-3" />
                All QR Codes
                <Badge variant="default" size="sm" className="ml-auto">
                  {qrCodes.length}
                </Badge>
              </button>
              
              {folders.map((folder) => (
                <button
                  key={folder.Id}
                  onClick={() => setSelectedFolder(folder.Id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedFolder === folder.Id 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded mr-3" 
                    style={{ backgroundColor: folder.color }}
                  />
                  {folder.name}
                  <Badge variant="default" size="sm" className="ml-auto">
                    {folder.qrCount}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {filteredQrCodes.length === 0 ? (
            <Empty
              title="No QR codes found"
              description={searchQuery ? "Try adjusting your search terms" : "Create your first QR code to get started"}
              actionLabel="Create QR Code"
              icon="QrCode"
              onAction={() => window.location.href = "/"}
            />
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQrCodes.map((qrCode, index) => (
                    <motion.div
                      key={qrCode.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card hover className="p-6">
<div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                              <ApperIcon name={getQRTypeIcon(qrCode.type)} className="w-4 h-4 text-primary-600" />
                            </div>
                            <div className="ml-3 flex items-center gap-2">
                              <Badge variant="primary" size="sm">
                                {getQRTypeLabel(qrCode.type)}
                              </Badge>
                              {qrCode.isDynamic && (
                                <Badge variant="secondary" size="sm">
                                  <ApperIcon name="Link" className="w-3 h-3 mr-1" />
                                  Dynamic
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {qrCode.isDynamic && (
                              <button
                                onClick={() => handleEdit(qrCode)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit content"
                              >
                                <ApperIcon name="Edit3" className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDownload(qrCode)}
                              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Download" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(qrCode.Id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="w-20 h-20 bg-white rounded border mx-auto flex items-center justify-center">
                            <ApperIcon name="QrCode" className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {getContentPreview(qrCode)}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatDistanceToNow(new Date(qrCode.createdAt), { addSuffix: true })}</span>
                            <div className="flex items-center">
                              <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                              {qrCode.scanCount}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Content</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900">Scans</th>
                          <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
{filteredQrCodes.map((qrCode) => (
                          <tr key={qrCode.Id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 rounded border mr-3 flex items-center justify-center">
                                  <ApperIcon name="QrCode" className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 truncate max-w-xs">
                                    {getContentPreview(qrCode)}
                                  </div>
                                  {qrCode.isDynamic && (
                                    <div className="text-xs text-gray-500 font-mono mt-1">
                                      {qrCode.shortUrl}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Badge variant="primary" size="sm">
                                  {getQRTypeLabel(qrCode.type)}
                                </Badge>
                                {qrCode.isDynamic && (
                                  <Badge variant="secondary" size="sm">
                                    <ApperIcon name="Link" className="w-3 h-3 mr-1" />
                                    Dynamic
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-600">
                              {formatDistanceToNow(new Date(qrCode.createdAt), { addSuffix: true })}
                            </td>
                            <td className="py-4 px-6 text-gray-600">
                              {qrCode.scanCount}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end space-x-2">
                                {qrCode.isDynamic && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(qrCode)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <ApperIcon name="Edit3" className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(qrCode)}
                                >
                                  <ApperIcon name="Download" className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(qrCode.Id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <ApperIcon name="Trash2" className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRLibrary