import teamMembersData from "@/services/mockData/teamMembers.json"

class TeamService {
  constructor() {
    this.data = [...teamMembersData]
  }

  async getAll() {
    await this.simulateDelay()
    return [...this.data]
  }

  async getById(id) {
    await this.simulateDelay()
    return this.data.find(item => item.Id === parseInt(id))
  }

  async invite(memberData) {
    await this.simulateDelay()
    const newMember = {
      ...memberData,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1,
      status: "pending",
      invitedAt: new Date().toISOString(),
      invitedBy: "current-user@example.com"
    }
    this.data.push(newMember)
    return { ...newMember }
  }

  async updatePermission(id, permission) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Team member not found")
    
    this.data[index] = { ...this.data[index], permission, role: this.getRoleFromPermission(permission) }
    return { ...this.data[index] }
  }

  async acceptInvite(id) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Team member not found")
    
    this.data[index] = { 
      ...this.data[index], 
      status: "active",
      joinedAt: new Date().toISOString()
    }
    return { ...this.data[index] }
  }

  async remove(id) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Team member not found")
    
    this.data.splice(index, 1)
    return true
  }

  async resendInvite(id) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Team member not found")
    
    this.data[index] = { 
      ...this.data[index], 
      invitedAt: new Date().toISOString()
    }
    return { ...this.data[index] }
  }

  getRoleFromPermission(permission) {
    const roleMap = {
      'admin': 'Administrator',
      'edit': 'Editor',
      'view': 'Viewer'
    }
    return roleMap[permission] || 'Viewer'
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const teamService = new TeamService()