import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import PaperHallway from './PaperHallway.jsx'
import AetherPage from './AetherPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main Paper Hallway site */}
        <Route path="/" element={<PaperHallway />} />

        {/* Aether product page — paperhallway.com/office/aether */}
        <Route path="/office/aether" element={<AetherPage />} />

        {/* Fallback */}
        <Route path="*" element={<PaperHallway />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
