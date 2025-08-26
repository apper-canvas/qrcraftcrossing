import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import QRScanner from "@/components/molecules/QRScanner"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { offlineStorageService } from "@/services/offlineStorageService"
import { formatDistanceToNow } from "date-fns"

const OfflinePage = () => {
  const [qrCodes, setQrCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [showScanner, setShowScanner] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState("idle")

  useEffect(() => {
    loadOfflineData()
    
    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingChanges()
    }
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineData = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await offlineStorageService.getAll()
      setQrCodes(data)
    } catch (err) {
      setError("Failed to load offline QR codes")
    } finally {
      setLoading(false)
    }
  }

  const syncPendingChanges = async () => {
    try {
      setSyncStatus("syncing")
      const pendingSync = await offlineStorageService.getPendingSync()
      
      if (pendingSync.length > 0) {
        toast.info(`Syncing ${pendingSync.length} offline changes...`)
        await offlineStorageService.syncToAPI()
        await loadOfflineData()
        toast.success("Offline changes synced successfully!")
      }
      
      setSyncStatus("synced")
    } catch (err) {
      setSyncStatus("error")
      toast.error("Failed to sync offline changes")
    }
  }

  const handleScanResult = (result) => {
    const scannedData = {
      type: "text",
      content: { text: result },
      scannedAt: new Date().toISOString()
    }
    
    toast.success(`QR Code scanned: ${result}`)
    setShowScanner(false)
    
    // You could add logic here to save scanned codes or perform actions
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return
    
    try {
      await offlineStorageService.delete(id)
      await loadOfflineData()
      toast.success("QR code deleted from offline storage")
    } catch (err) {
      toast.error("Failed to delete QR code")
    }
  }

  const handleDownload = (qrCode) => {
    // Create a simple text file with QR code data
    const content = JSON.stringify(qrCode, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-code-${qrCode.Id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success("QR code data downloaded")
  }

  const getQRTypeIcon = (type) => {
    switch (type) {
      case "url": return "Link"
      case "vcard": return "User"
      case "wifi": return "Wifi"
      case "text": return "Type"
      default: return "QrCode"
    }
  }

  const getQRTypeLabel = (type) => {
    switch (type) {
      case "url": return "URL"
      case "vcard": return "Contact"
      case "wifi": return "WiFi"
      case "text": return "Text"
      default: return type.toUpperCase()
    }
  }

  const getContentPreview = (qrCode) => {
    switch (qrCode.type) {
      case "url":
        return qrCode.content?.url || "No URL"
      case "vcard":
        return `${qrCode.content?.firstName} ${qrCode.content?.lastName}` || "Contact"
      case "wifi":
        return qrCode.content?.ssid || "WiFi Network"
      case "text":
        return qrCode.content?.text?.substring(0, 50) + (qrCode.content?.text?.length > 50 ? "..." : "") || "Text Content"
      default:
        return "QR Code"
    }
  }

  const filteredQRCodes = qrCodes.filter(qr => 
    getContentPreview(qr).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getQRTypeLabel(qr.type).toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <Loading variant="offline" />
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadOfflineData}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Offline QR Codes</h1>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
              <span className="text-sm font-medium text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {syncStatus === "syncing" && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <motion.div 
                    className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Syncing...
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">
            Access and scan QR codes without internet connection. 
            {!isOnline && " Your changes will sync when you're back online."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ScanLine" size={16} />
            Scan QR Code
          </Button>
          
          {isOnline && (
            <Button
              variant="outline"
              onClick={syncPendingChanges}
              disabled={syncStatus === "syncing"}
              className="flex items-center gap-2"
            >
              <ApperIcon name="RefreshCw" size={16} />
              Sync Now
            </Button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search offline QR codes..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Grid3X3" size={16} />
            Grid
          </Button>
          
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="List" size={16} />
            List
          </Button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanResult={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Content */}
      {filteredQRCodes.length === 0 ? (
        <Empty
          icon="WifiOff"
          title="No offline QR codes"
          description="QR codes you create will be saved here for offline access"
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQRCodes.map((qrCode, index) => (
            <motion.div
              key={qrCode.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <ApperIcon name={getQRTypeIcon(qrCode.type)} size={48} className="text-gray-400 mx-auto mb-2" />
                    <Badge variant="secondary" className="text-xs">
                      {getQRTypeLabel(qrCode.type)}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {getContentPreview(qrCode)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ApperIcon name="Calendar" size={14} />
                        {formatDistanceToNow(new Date(qrCode.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <ApperIcon name="Eye" size={14} />
                          {qrCode.scanCount || 0}
                        </div>
                        {!isOnline && (
                          <Badge variant="warning" className="text-xs">
                            Offline
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(qrCode)}
                        >
                          <ApperIcon name="Download" size={16} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(qrCode.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredQRCodes.map((qrCode, index) => (
              <motion.div
                key={qrCode.Id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getQRTypeIcon(qrCode.type)} size={20} className="text-gray-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {getContentPreview(qrCode)}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="secondary" className="text-xs">
                          {getQRTypeLabel(qrCode.type)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={14} />
                          {formatDistanceToNow(new Date(qrCode.createdAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Eye" size={14} />
                          {qrCode.scanCount || 0} scans
                        </div>
                        {!isOnline && (
                          <Badge variant="warning" className="text-xs">
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(qrCode)}
                    >
                      <ApperIcon name="Download" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(qrCode.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default OfflinePage