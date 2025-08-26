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
      // Scale location data for 30 days
      baseData.locationData.countries = baseData.locationData.countries.map(country => ({
        ...country,
        scans: Math.floor(country.scans * 4.2)
      }))
      baseData.locationData.cities = baseData.locationData.cities.map(city => ({
        ...city,
        scans: Math.floor(city.scans * 4.2)
      }))
    } else if (timeRange === "90d") {
      baseData.totalScans = Math.floor(baseData.totalScans * 12.5)
      baseData.periodScans = Math.floor(baseData.periodScans * 11.2)
      // Scale location data for 90 days
      baseData.locationData.countries = baseData.locationData.countries.map(country => ({
        ...country,
        scans: Math.floor(country.scans * 12.5)
      }))
      baseData.locationData.cities = baseData.locationData.cities.map(city => ({
        ...city,
        scans: Math.floor(city.scans * 12.5)
      }))
    }
    
    return baseData
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 300))
  }
}

export const analyticsService = new AnalyticsService()