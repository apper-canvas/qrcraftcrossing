import analyticsData from "@/services/mockData/analytics.json"

class AnalyticsService {
  constructor() {
    this.data = { ...analyticsData }
  }

  async getAnalytics(timeRange = "7d") {
    await this.simulateDelay()
    
    // Simulate different data based on time range
    const baseData = { ...this.data }
    
    if (timeRange === "30d") {
      baseData.totalScans = Math.floor(baseData.totalScans * 4.2)
      baseData.periodScans = Math.floor(baseData.periodScans * 3.8)
    } else if (timeRange === "90d") {
      baseData.totalScans = Math.floor(baseData.totalScans * 12.5)
      baseData.periodScans = Math.floor(baseData.periodScans * 11.2)
    }
    
    return baseData
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 300))
  }
}

export const analyticsService = new AnalyticsService()