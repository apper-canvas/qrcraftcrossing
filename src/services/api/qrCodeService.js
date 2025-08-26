import qrCodesData from "@/services/mockData/qrCodes.json"

class QRCodeService {
  constructor() {
    this.data = [...qrCodesData]
  }

  async getAll() {
    await this.simulateDelay()
    return [...this.data]
  }

  async getById(id) {
    await this.simulateDelay()
    return this.data.find(item => item.Id === parseInt(id))
  }

async create(qrCode) {
    await this.simulateDelay()
    const newQrCode = {
      ...qrCode,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      isDynamic: qrCode.isDynamic || false,
      shortUrl: qrCode.isDynamic ? qrCode.shortUrl : null
    }
    this.data.push(newQrCode)
    return { ...newQrCode }
  }

async update(id, qrCode) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("QR code not found")
    
    this.data[index] = { ...this.data[index], ...qrCode }
    return { ...this.data[index] }
  }

  async updateContent(id, newContent) {
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
    return { ...this.data[index] }
  }

  async delete(id) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("QR code not found")
    
    this.data.splice(index, 1)
    return true
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const qrCodeService = new QRCodeService()