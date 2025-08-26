import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import CreatePage from "@/components/pages/CreatePage"
import LibraryPage from "@/components/pages/LibraryPage"
import TemplatesPage from "@/components/pages/TemplatesPage"
import AnalyticsPage from "@/components/pages/AnalyticsPage"
import SettingsPage from "@/components/pages/SettingsPage"
import BulkImportPage from "@/components/pages/BulkImportPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CreatePage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="bulk" element={<BulkImportPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  )
}

export default App