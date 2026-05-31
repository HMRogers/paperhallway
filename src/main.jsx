import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import './index.css'
import PaperHallway from './PaperHallway.jsx'

inject();
injectSpeedInsights();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaperHallway />
  </StrictMode>,
)
