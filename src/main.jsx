import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Rendu principal pour l'application complète
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
