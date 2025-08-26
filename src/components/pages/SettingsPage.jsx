import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account")

  const tabs = [
    { id: "account", label: "Account", icon: "User" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "export", label: "Export", icon: "Download" },
    { id: "api", label: "API", icon: "Code" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="p-6 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "account" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">John Doe</h4>
                    <p className="text-gray-600">john@example.com</p>
                    <Badge variant="success" size="sm" className="mt-2">Pro Plan</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    defaultValue="John"
                  />
                  <Input
                    label="Last Name"
                    defaultValue="Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    defaultValue="john@example.com"
                  />
                  <Input
                    label="Company"
                    defaultValue="QRCraft Inc."
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Default QR Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Default Size</p>
                        <p className="text-sm text-gray-600">Default size for new QR codes</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>200px</option>
                        <option>300px</option>
                        <option>400px</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Error Correction</p>
                        <p className="text-sm text-gray-600">Default error correction level</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Medium</option>
                        <option>Low</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Notifications</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Email notifications for new scans", description: "Get notified when your QR codes are scanned" },
                      { label: "Weekly analytics reports", description: "Receive weekly performance summaries" },
                      { label: "Account and billing updates", description: "Important account notifications" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "export" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Default Export Format</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {["PNG", "SVG", "PDF"].map((format) => (
                      <label key={format} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300">
                        <input type="radio" name="format" className="text-primary-600" defaultChecked={format === "PNG"} />
                        <span className="ml-3 font-medium text-gray-900">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Export Sizes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["256px", "512px", "1024px", "2048px"].map((size) => (
                      <label key={size} className="flex items-center">
                        <input type="checkbox" className="text-primary-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save Export Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "api" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">API Configuration</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">API Key</h4>
                  <div className="flex items-center space-x-3">
                    <Input
                      value="qr_sk_1234567890abcdef"
                      readOnly
                      className="flex-1"
                    />
                    <Button variant="secondary">
                      <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="secondary">
                      <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Keep your API key secure. Don't share it in publicly accessible areas.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Usage Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                      <p className="text-sm text-gray-600">API Requests This Month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">8,766</p>
                      <p className="text-sm text-gray-600">Requests Remaining</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">99.9%</p>
                      <p className="text-sm text-gray-600">Uptime</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Documentation</h4>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                      <ApperIcon name="Book" className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">API Documentation</span>
                      <ApperIcon name="ExternalLink" className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                    <a href="#" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                      <ApperIcon name="Code" className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">Code Examples</span>
                      <ApperIcon name="ExternalLink" className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage