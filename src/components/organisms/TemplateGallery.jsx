import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { templateService } from "@/services/api/templateService"

const TemplateGallery = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await templateService.getAll()
      setTemplates(data)
    } catch (err) {
      setError("Failed to load templates")
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (template) => {
    toast.success(`Applied template: ${template.name}`)
    // Navigate to create page with template applied
    // In a real app, you'd pass the template data
  }

  const handleDeleteTemplate = async (id) => {
    try {
      await templateService.delete(id)
      setTemplates(templates.filter(t => t.Id !== id))
      toast.success("Template deleted successfully")
    } catch (err) {
      toast.error("Failed to delete template")
    }
  }

  const filteredTemplates = templates.filter(template => 
    !searchQuery || 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <Loading variant="card" />
  if (error) return <Error message={error} onRetry={loadTemplates} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Templates</h2>
          <p className="text-gray-600 mt-1">Reusable design templates for your QR codes</p>
        </div>
        
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search templates..."
          className="w-64"
        />
      </div>

      {filteredTemplates.length === 0 ? (
        <Empty
          title="No templates found"
          description={searchQuery ? "Try adjusting your search terms" : "Create your first template to get started"}
          actionLabel="Create Template"
          icon="Layout"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                {/* Template Preview */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 p-6 flex items-center justify-center">
                  {template.thumbnail ? (
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                      <ApperIcon name="QrCode" className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                    {template.isDefault && (
                      <Badge variant="primary" size="sm">Default</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Palette" className="w-4 h-4 mr-2" />
                      <span>Custom Design</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleUseTemplate(template)}
                        size="sm"
                        className="flex-1"
                      >
                        <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                        Use Template
                      </Button>
                      
                      {!template.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateGallery