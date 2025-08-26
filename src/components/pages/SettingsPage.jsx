import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import { teamService } from '@/services/api/teamService'
import { folderService } from '@/services/api/folderService'
import { cn } from '@/utils/cn'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account")

  const tabs = [
    { id: "account", label: "Account", icon: "User" },
    { id: "team", label: "Team", icon: "Users" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "export", label: "Export", icon: "Download" },
    { id: "api", label: "API", icon: "Code" }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <ApperIcon name={tab.icon} className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "account" && <AccountTab />}
        {activeTab === "team" && <TeamTab />}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "export" && <ExportTab />}
        {activeTab === "api" && <APITab />}
      </div>
    </div>
  )
}

// Account Tab Component
const AccountTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JD</span>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-900">John Doe</h2>
            <p className="text-gray-600">john.doe@example.com</p>
            <Badge variant="success" className="mt-2">Pro Plan</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Input defaultValue="John" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Input defaultValue="Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input type="email" defaultValue="john.doe@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <Input defaultValue="QRCraft Inc." />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => toast.success("Account settings saved!")}>
            Save Changes
          </Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your password regularly for better security</p>
            </div>
            <Button variant="secondary" onClick={() => toast.info("Password change initiated")}>
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="secondary" onClick={() => toast.info("2FA setup initiated")}>
              Enable
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Team Tab Component
const TeamTab = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [sharedFolders, setSharedFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteData, setInviteData] = useState({ email: "", permission: "view" })

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      const [members, folders] = await Promise.all([
        teamService.getAll(),
        folderService.getAll()
      ])
      setTeamMembers(members)
      setSharedFolders(folders.filter(folder => folder.teamMembers && folder.teamMembers.length > 0))
    } catch (error) {
      toast.error("Failed to load team data")
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteData.email) {
      toast.error("Please enter an email address")
      return
    }
    
    try {
      const newMember = await teamService.invite({
        email: inviteData.email,
        permission: inviteData.permission,
        role: teamService.getRoleFromPermission(inviteData.permission)
      })
      
      setTeamMembers([...teamMembers, newMember])
      setInviteData({ email: "", permission: "view" })
      setShowInviteForm(false)
      toast.success(`Invitation sent to ${inviteData.email}`)
    } catch (error) {
      toast.error("Failed to send invitation")
    }
  }

  const handleRemove = async (id) => {
    try {
      await teamService.remove(id)
      setTeamMembers(teamMembers.filter(member => member.Id !== id))
      toast.success("Team member removed successfully")
    } catch (error) {
      toast.error("Failed to remove team member")
    }
  }

  const handlePermissionChange = async (id, permission) => {
    try {
      const updatedMember = await teamService.updatePermission(id, permission)
      setTeamMembers(teamMembers.map(member =>
        member.Id === id ? updatedMember : member
      ))
      toast.success("Permission updated successfully")
    } catch (error) {
      toast.error("Failed to update permission")
    }
  }

  const handleResendInvite = async (id) => {
    try {
      await teamService.resendInvite(id)
      toast.success("Invitation resent successfully")
    } catch (error) {
      toast.error("Failed to resend invitation")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <p className="text-gray-600">Manage who has access to your QR codes and folders</p>
          </div>
          <Button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">Invite Team Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  placeholder="colleague@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Level
                </label>
                <select
                  value={inviteData.permission}
                  onChange={(e) => setInviteData({...inviteData, permission: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="view">Viewer - Can view QR codes</option>
                  <option value="edit">Editor - Can create and edit</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowInviteForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleInvite}>
                Send Invitation
              </Button>
            </div>
          </Card>
        )}

        {/* Team Members List */}
        <div className="space-y-4">
          {teamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Users" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No team members yet. Invite your first team member to get started!</p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div key={member.Id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    {member.invitedAt && (
                      <p className="text-xs text-gray-500">
                        Invited {new Date(member.invitedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={member.status === "active" ? "success" : "secondary"}
                  >
                    {member.status === "active" ? "Active" : "Pending"}
                  </Badge>
                  
                  <select
                    value={member.permission}
                    onChange={(e) => handlePermissionChange(member.Id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={member.status !== "active"}
                  >
                    <option value="view">Viewer</option>
                    <option value="edit">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    {member.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResendInvite(member.Id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Resend invitation"
                      >
                        <ApperIcon name="Send" className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(member.Id)}
                      className="text-red-600 hover:text-red-700"
                      title="Remove member"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Shared Folders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Shared Folders</h3>
            <p className="text-gray-600">Folders currently shared with team members</p>
          </div>
          <Button variant="secondary" size="sm">
            <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
            Share Folder
          </Button>
        </div>
        
        <div className="space-y-4">
          {sharedFolders.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <ApperIcon name="FolderOpen" className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No shared folders yet. Share a folder to enable team collaboration!</p>
            </div>
          ) : (
            sharedFolders.map((folder) => (
              <div key={folder.Id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3" 
                    style={{ backgroundColor: folder.color }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{folder.name}</h4>
                    <div className="flex items-center mt-1 space-x-4">
                      <p className="text-sm text-gray-600">
                        {folder.teamMembers.length} team member{folder.teamMembers.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        {folder.qrCount} QR code{folder.qrCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {folder.teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center"
                        title={member.name}
                      >
                        <span className="text-xs text-white font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {folder.teamMembers.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          +{folder.teamMembers.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => toast.info(`Managing sharing for ${folder.name}`)}
                  >
                    <ApperIcon name="Settings" className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

// Other tab components remain the same...
const PreferencesTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive updates about your QR codes</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
                  onChange={() => toast.success("Notification preference updated")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Updates</h4>
                  <p className="text-sm text-gray-600">Get news about new features and tips</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  onChange={() => toast.success("Notification preference updated")}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

const ExportTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Data</h2>
        <p className="text-gray-600 mb-6">Download your QR codes and analytics data</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">QR Codes</h3>
              <p className="text-sm text-gray-600">Export all your QR code data as CSV</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => toast.success("QR codes exported successfully!")}
            >
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Download scan analytics and reports</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => toast.success("Analytics exported successfully!")}
            >
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

const APITab = () => {
  const copyApiKey = () => {
    navigator.clipboard.writeText("qrc_1234567890abcdef")
    toast.success("API key copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Access</h2>
        <p className="text-gray-600 mb-6">Manage your API keys and integrations</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">API Key</h3>
              <p className="text-sm text-gray-600 font-mono">qrc_1234567890abcdef</p>
            </div>
            <Button variant="secondary" onClick={copyApiKey}>
              <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPage
const tabs = [
    { id: "account", label: "Account", icon: "User" },
    { id: "team", label: "Team", icon: "Users" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "export", label: "Export", icon: "Download" },
    { id: "api", label: "API", icon: "Code" }
  ]