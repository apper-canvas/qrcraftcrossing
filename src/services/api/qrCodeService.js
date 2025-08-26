import qrCodesData from "@/services/mockData/qrCodes.json";
import { offlineStorageService } from "@/services/offlineStorageService";

class QRCodeService {
constructor() {
    this.data = [...qrCodesData]
    this.isOffline = !navigator.onLine
  }

  setOfflineMode(offline) {
    this.isOffline = offline
  }

async getAll() {
    if (this.isOffline) {
      return await offlineStorageService.getAll()
    }
    
    await this.simulateDelay()
    const data = [...this.data]
    
    // Save to offline storage for offline access
    await offlineStorageService.syncFromAPI(data)
    
    return data
  }

async getById(id) {
    if (this.isOffline) {
      return await offlineStorageService.getById(parseInt(id))
    }
    
    await this.simulateDelay()
    return this.data.find(item => item.Id === parseInt(id))
  }

async create(qrCode) {
    if (this.isOffline) {
      const newQrCode = await offlineStorageService.create(qrCode)
      return newQrCode
    }
    
    await this.simulateDelay()
    const newQrCode = {
      ...qrCode,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      isDynamic: qrCode.isDynamic || false,
      shortUrl: qrCode.isDynamic ? qrCode.shortUrl : null
    }
    this.data.push(newQrCode)
    
    // Save to offline storage
    await offlineStorageService.create(newQrCode)
    
    return { ...newQrCode }
  }

async createBulk(qrCodes) {
    if (this.isOffline) {
      const results = []
      for (const qrCode of qrCodes) {
        const newQrCode = await offlineStorageService.create(qrCode)
        results.push(newQrCode)
      }
      return results
    }
    
    await this.simulateDelay()
    const results = []
    for (const qrCode of qrCodes) {
      const newQrCode = await this.create(qrCode)
      results.push(newQrCode)
    }
    return results
  }

async update(id, qrCode) {
    if (this.isOffline) {
      return await offlineStorageService.update(parseInt(id), qrCode)
    }
    
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("QR code not found")
    
    this.data[index] = { ...this.data[index], ...qrCode }
    
    // Update offline storage
    await offlineStorageService.update(parseInt(id), this.data[index])
    
    return { ...this.data[index] }
  }

async updateContent(id, newContent) {
    if (this.isOffline) {
      const qrCode = await offlineStorageService.getById(parseInt(id))
      if (!qrCode) throw new Error("QR code not found")
      if (!qrCode.isDynamic) {
        throw new Error("Cannot update content of static QR code")
      }
      
      const updatedQrCode = {
        ...qrCode,
        content: newContent,
        updatedAt: new Date().toISOString()
      }
      
      return await offlineStorageService.update(parseInt(id), updatedQrCode)
    }
    
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("QR code not found")
    
    const qrCode = this.data[index]
    if (!qrCode.isDynamic) {
      throw new Error("Cannot update content of static QR code")
    }

    this.data[index] = {
      ...qrCode,
      content: newContent,
      updatedAt: new Date().toISOString()
    }
    
    // Update offline storage
    await offlineStorageService.update(parseInt(id), this.data[index])
    
    return { ...this.data[index] }
  }

async delete(id) {
    if (this.isOffline) {
      return await offlineStorageService.delete(parseInt(id))
    }
    
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("QR code not found")
    
    this.data.splice(index, 1)
    
    // Delete from offline storage
    await offlineStorageService.delete(parseInt(id))
    
    return true
  }

async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

// Create singleton instance
const qrCodeService = new QRCodeService()

// Listen for online/offline events
window.addEventListener('online', () => {
  qrCodeService.setOfflineMode(false)
})

window.addEventListener('offline', () => {
  qrCodeService.setOfflineMode(true)
})

export { qrCodeService }