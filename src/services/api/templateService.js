import templatesData from "@/services/mockData/templates.json"

class TemplateService {
  constructor() {
    this.data = [...templatesData]
  }

  async getAll() {
    await this.simulateDelay()
    return [...this.data]
  }

  async getById(id) {
    await this.simulateDelay()
    return this.data.find(item => item.Id === parseInt(id))
  }

  async create(template) {
    await this.simulateDelay()
    const newTemplate = {
      ...template,
      Id: Math.max(...this.data.map(item => item.Id), 0) + 1
    }
    this.data.push(newTemplate)
    return { ...newTemplate }
  }

  async update(id, template) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Template not found")
    
    this.data[index] = { ...this.data[index], ...template }
    return { ...this.data[index] }
  }

  async delete(id) {
    await this.simulateDelay()
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) throw new Error("Template not found")
    
    this.data.splice(index, 1)
    return true
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const templateService = new TemplateService()