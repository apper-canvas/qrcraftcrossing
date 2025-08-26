class OfflineStorageService {
  constructor() {
    this.storageKey = "qrcraft_offline_data"
    this.pendingSyncKey = "qrcraft_pending_sync"
    this.init()
  }

  init() {
    // Ensure storage exists
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]))
    }
    if (!localStorage.getItem(this.pendingSyncKey)) {
      localStorage.setItem(this.pendingSyncKey, JSON.stringify([]))
    }
  }

  async getAll() {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || "[]")
      return data
    } catch (err) {
      console.error("Failed to load offline data:", err)
      return []
    }
  }

  async getById(id) {
    try {
      const data = await this.getAll()
      return data.find(item => item.Id === parseInt(id))
    } catch (err) {
      console.error("Failed to get offline item:", err)
      return null
    }
  }

  async create(qrCode) {
    try {
      const data = await this.getAll()
      const newQrCode = {
        ...qrCode,
        Id: Math.max(...data.map(item => item.Id), 0) + 1,
        createdAt: new Date().toISOString(),
        isDynamic: qrCode.isDynamic || false,
        shortUrl: qrCode.isDynamic ? qrCode.shortUrl : null,
        _offlineCreated: true
      }

      data.push(newQrCode)
      localStorage.setItem(this.storageKey, JSON.stringify(data))

      // Add to pending sync
      await this.addToPendingSync({
        action: "create",
        data: newQrCode,
        timestamp: Date.now()
      })

      return { ...newQrCode }
    } catch (err) {
      console.error("Failed to create offline QR code:", err)
      throw new Error("Failed to save QR code offline")
    }
  }

  async update(id, qrCode) {
    try {
      const data = await this.getAll()
      const index = data.findIndex(item => item.Id === parseInt(id))
      
      if (index === -1) {
        throw new Error("QR code not found")
      }

      const updatedQrCode = { 
        ...data[index], 
        ...qrCode, 
        updatedAt: new Date().toISOString(),
        _offlineModified: true
      }
      
      data[index] = updatedQrCode
      localStorage.setItem(this.storageKey, JSON.stringify(data))

      // Add to pending sync if not originally created offline
      if (!data[index]._offlineCreated) {
        await this.addToPendingSync({
          action: "update",
          id: parseInt(id),
          data: qrCode,
          timestamp: Date.now()
        })
      }

      return { ...updatedQrCode }
    } catch (err) {
      console.error("Failed to update offline QR code:", err)
      throw new Error("Failed to update QR code offline")
    }
  }

  async delete(id) {
    try {
      const data = await this.getAll()
      const index = data.findIndex(item => item.Id === parseInt(id))
      
      if (index === -1) {
        throw new Error("QR code not found")
      }

      const qrCode = data[index]
      data.splice(index, 1)
      localStorage.setItem(this.storageKey, JSON.stringify(data))

      // Add to pending sync if not originally created offline
      if (!qrCode._offlineCreated) {
        await this.addToPendingSync({
          action: "delete",
          id: parseInt(id),
          timestamp: Date.now()
        })
      }

      return true
    } catch (err) {
      console.error("Failed to delete offline QR code:", err)
      throw new Error("Failed to delete QR code offline")
    }
  }

  async syncFromAPI(apiData) {
    try {
      // Merge API data with offline-only data
      const offlineData = await this.getAll()
      const offlineOnlyData = offlineData.filter(item => item._offlineCreated)
      
      // Combine API data with offline-created items
      const mergedData = [...apiData, ...offlineOnlyData]
      
      localStorage.setItem(this.storageKey, JSON.stringify(mergedData))
      return true
    } catch (err) {
      console.error("Failed to sync from API:", err)
      return false
    }
  }

  async syncToAPI() {
    try {
      const pendingSync = await this.getPendingSync()
      
      for (const syncItem of pendingSync) {
        try {
          // In a real app, you would make API calls here
          // For now, we'll just simulate the sync
          console.log(`Syncing ${syncItem.action}:`, syncItem)
          
          // Remove offline flags after successful sync
          if (syncItem.action === "create" || syncItem.action === "update") {
            const data = await this.getAll()
            const item = data.find(qr => 
              syncItem.action === "create" ? 
                qr._offlineCreated && JSON.stringify(qr.content) === JSON.stringify(syncItem.data.content) :
                qr.Id === syncItem.id
            )
            
            if (item) {
              delete item._offlineCreated
              delete item._offlineModified
              localStorage.setItem(this.storageKey, JSON.stringify(data))
            }
          }
        } catch (syncErr) {
          console.error("Failed to sync item:", syncItem, syncErr)
          // In a real app, you might keep failed items for retry
        }
      }

      // Clear pending sync after successful sync
      localStorage.setItem(this.pendingSyncKey, JSON.stringify([]))
      return true
    } catch (err) {
      console.error("Failed to sync to API:", err)
      throw new Error("Sync failed")
    }
  }

  async getPendingSync() {
    try {
      return JSON.parse(localStorage.getItem(this.pendingSyncKey) || "[]")
    } catch (err) {
      console.error("Failed to get pending sync:", err)
      return []
    }
  }

  async addToPendingSync(syncItem) {
    try {
      const pendingSync = await this.getPendingSync()
      pendingSync.push(syncItem)
      localStorage.setItem(this.pendingSyncKey, JSON.stringify(pendingSync))
    } catch (err) {
      console.error("Failed to add to pending sync:", err)
    }
  }

  async clearOfflineData() {
    try {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.pendingSyncKey)
      this.init()
      return true
    } catch (err) {
      console.error("Failed to clear offline data:", err)
      return false
    }
  }

  async getStorageInfo() {
    try {
      const data = await this.getAll()
      const pendingSync = await this.getPendingSync()
      
      return {
        totalItems: data.length,
        offlineCreated: data.filter(item => item._offlineCreated).length,
        offlineModified: data.filter(item => item._offlineModified).length,
        pendingSync: pendingSync.length,
        storageSize: new Blob([JSON.stringify(data)]).size
      }
    } catch (err) {
      console.error("Failed to get storage info:", err)
      return {
        totalItems: 0,
        offlineCreated: 0,
        offlineModified: 0,
        pendingSync: 0,
        storageSize: 0
      }
    }
  }
}

// Create singleton instance
const offlineStorageService = new OfflineStorageService()

export { offlineStorageService }