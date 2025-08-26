import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import OfflinePage from "@/components/pages/OfflinePage";
import React from "react";
import BulkImportPage from "@/components/pages/BulkImportPage";
import CreatePage from "@/components/pages/CreatePage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import LibraryPage from "@/components/pages/LibraryPage";
import TemplatesPage from "@/components/pages/TemplatesPage";
import SettingsPage from "@/components/pages/SettingsPage";
import Layout from "@/components/organisms/Layout";

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
            <Route path="offline" element={<OfflinePage />} />
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