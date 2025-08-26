import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ReactApexChart from "react-apexcharts"
import { analyticsService } from "@/services/api/analyticsService"
import { formatDistanceToNow } from "date-fns"

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ["#7c3aed"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: analytics?.scansByDay?.map(item => item.date) || []
    },
    yaxis: {
      title: { text: "Scans" }
    },
    tooltip: {
      theme: "light"
    },
    grid: {
      borderColor: "#f1f5f9"
    }
  }

  const chartSeries = [{
    name: "Scans",
    data: analytics?.scansByDay?.map(item => item.scans) || []
  }]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadAnalytics} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your QR code performance and insights</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="QrCode" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalQrCodes || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Eye" className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalScans || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Scans/QR</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.avgScansPerQr || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Period</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.periodScans || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan Trends Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Scan Trends</h3>
            {analytics?.scansByDay ? (
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No scan data available</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Top Performing QR Codes */}
        <div>
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing</h3>
            <div className="space-y-4">
              {analytics?.topQrCodes?.map((qr, index) => (
                <div key={qr.Id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? "bg-yellow-500" : 
                      index === 1 ? "bg-gray-400" : 
                      index === 2 ? "bg-amber-600" : "bg-gray-300"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 text-sm truncate max-w-32">
                        {qr.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(qr.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">
                    {qr.scans}
                  </Badge>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">
                  <ApperIcon name="BarChart3" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No data available</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* QR Type Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">QR Code Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics?.typeDistribution?.map((type) => (
            <div key={type.type} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon 
                  name={type.type === "url" ? "Globe" : type.type === "vcard" ? "User" : type.type === "wifi" ? "Wifi" : "Type"} 
                  className="w-8 h-8 text-primary-600" 
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">{type.count}</p>
              <p className="text-sm text-gray-600 capitalize">{type.type}</p>
            </div>
          )) || (
            <div className="col-span-full text-center text-gray-500 py-8">
              <ApperIcon name="PieChart" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No type data available</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard