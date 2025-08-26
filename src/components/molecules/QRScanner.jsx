import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"

const QRScanner = ({ onScanResult, onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [stream, setStream] = useState(null)
  const [scanResult, setScanResult] = useState(null)

  useEffect(() => {
    initializeCamera()
    return () => {
      stopCamera()
    }
  }, [selectedDevice])

  const initializeCamera = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          deviceId: selectedDevice?.deviceId
        } 
      })
      
      setHasPermission(true)
      setStream(stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Get available cameras
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setDevices(videoDevices)
      
      if (!selectedDevice && videoDevices.length > 0) {
        // Prefer back camera if available
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        )
        setSelectedDevice(backCamera || videoDevices[0])
      }

    } catch (err) {
      console.error("Camera access error:", err)
      setHasPermission(false)
      toast.error("Camera access denied or not available")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    scanQRCode()
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for QR code detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    
    // Simple QR code detection simulation
    // In a real implementation, you would use a QR code detection library
    // like jsQR or qr-scanner
    const simulateQRDetection = () => {
      // This is a simulation - replace with actual QR detection library
      const mockQRData = [
        "https://example.com",
        "Sample QR Code Text",
        "Contact: John Doe, john@example.com",
        "WiFi:SSID:MyNetwork;Password:password123;Security:WPA;",
        "QR Craft Pro - Offline Scanner Test"
      ]
      
      // Randomly detect QR codes (simulation)
      if (Math.random() > 0.95) { // 5% chance per frame
        const randomData = mockQRData[Math.floor(Math.random() * mockQRData.length)]
        return randomData
      }
      return null
    }

    const detectedData = simulateQRDetection()
    
    if (detectedData) {
      setScanResult(detectedData)
      setIsScanning(false)
      return
    }

    // Continue scanning if no QR code detected
    if (isScanning) {
      requestAnimationFrame(scanQRCode)
    }
  }

  const handleScanResult = () => {
    if (scanResult && onScanResult) {
      onScanResult(scanResult)
    }
    handleClose()
  }

  const handleClose = () => {
    setIsScanning(false)
    stopCamera()
    if (onClose) {
      onClose()
    }
  }

  const switchCamera = (device) => {
    setSelectedDevice(device)
    stopCamera()
  }

  if (hasPermission === false) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <Card className="max-w-md mx-auto p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CameraOff" size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Camera Access Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please allow camera access to scan QR codes. Check your browser settings and try again.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={initializeCamera}>
                  Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Scanner</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Camera View */}
            <div className="relative">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                {hasPermission === null ? (
                  <div className="text-center text-white">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p>Initializing camera...</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                    />
                    
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-64 h-64 border-2 border-white border-opacity-50 rounded-lg relative">
                          {/* Corner indicators */}
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
                          
                          {/* Scanning line animation */}
                          {isScanning && (
                            <motion.div
                              className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                              animate={{
                                top: ["0%", "100%", "0%"]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            />
                          )}
                        </div>
                        
                        {/* Instructions */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center text-white">
                          <p className="text-sm">
                            {isScanning ? "Scanning for QR codes..." : "Position QR code within the frame"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4">
              {/* Camera selection */}
              {devices.length > 1 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Camera:</label>
                  <select
                    value={selectedDevice?.deviceId || ""}
                    onChange={(e) => {
                      const device = devices.find(d => d.deviceId === e.target.value)
                      if (device) switchCamera(device)
                    }}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    {devices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                
                {!isScanning ? (
                  <Button
                    onClick={startScanning}
                    disabled={hasPermission !== true}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="ScanLine" size={16} />
                    Start Scanning
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => setIsScanning(false)}
                  >
                    Stop Scanning
                  </Button>
                )}
              </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <motion.div
                className="p-4 bg-green-50 border-t border-green-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-1">QR Code Detected!</h4>
                    <p className="text-sm text-green-700 break-all mb-3">{scanResult}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleScanResult}
                      >
                        Use Result
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setScanResult(null)
                          startScanning()
                        }}
                      >
                        Scan Another
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QRScanner