import foldersData from "@/services/mockData/folders.json"

class FolderService {
  constructor() {
    this.data = [...foldersData]
  }

  async getAll() {
    await this.simulateDelay()
    return [...this.data]
  }

  async getById(id) {
    await this.simulateDelay()
    return this.data.find(item => item.Id === parseInt(id))
  }

  async create(folder) {
    await this.simulateDelay()
    const newFolder = {
      ...folder,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      teamMembers: folder.teamMembers || [],
      owner: folder.owner || "current-user@example.com"
    }
    this.data.push(newFolder)
    return { ...newFolder }
  }

  async update(id, folder) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Folder not found")
    
    this.data[index] = { ...this.data[index], ...folder }
    return { ...this.data[index] }
  }

  async updateSharing(id, shareData) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Folder not found")
    
    this.data[index] = {
      ...this.data[index],
      teamMembers: shareData.teamMembers || [],
      sharedWith: shareData.sharedWith || []
    }
    return { ...this.data[index] }
  }

  async addTeamMember(id, memberData) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Folder not found")
    
    const folder = this.data[index]
    if (!folder.teamMembers) folder.teamMembers = []
    
    const newMember = {
      id: Date.now(),
      ...memberData,
      addedAt: new Date().toISOString()
    }
    
    folder.teamMembers.push(newMember)
    return { ...folder }
  }

  async removeTeamMember(id, memberId) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Folder not found")
    
    const folder = this.data[index]
    if (folder.teamMembers) {
      folder.teamMembers = folder.teamMembers.filter(member => member.id !== memberId)
    }
    return { ...folder }
  }

  async delete(id) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Folder not found")
    
    this.data.splice(index, 1)
    return true
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const folderService = new FolderService()