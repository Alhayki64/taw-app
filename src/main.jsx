import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthProvider'
import { PointsProvider } from './contexts/PointsProvider'
import { I18nProvider } from './contexts/I18nProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PointsProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </PointsProvider>
    </AuthProvider>
  </React.StrictMode>
)
