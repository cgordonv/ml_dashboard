import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './services/supabaseClient';  // ensures Supabase is initialized



// Import Tailwind build + your project globals
import './index.css'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
