
import React from 'react' // Explicitly import React at the top
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { suppressGrafanaErrors } from './utils/errorSuppressions'

// Подавление специфических ошибок, связанных с Grafana
suppressGrafanaErrors()

// Функция для логирования начальной загрузки
console.log('Application initialization started')

// Обработка глобальных ошибок
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error)
})

// Обработка непойманных промисов
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

try {
  const rootElement = document.getElementById("root")
  if (!rootElement) {
    throw new Error("Root element not found")
  }
  
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary onReset={() => window.location.reload()}>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
  
  console.log('React successfully mounted')
} catch (error) {
  console.error('Error during application initialization:', error)
  
  // Обработка критической ошибки - показать пользователю сообщение
  const root = document.getElementById("root")
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: system-ui, sans-serif;">
        <h2>Произошла ошибка при запуске приложения</h2>
        <p>Пожалуйста, обновите страницу или попробуйте позже.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #4f46e5; color: white; border: 0; border-radius: 4px; cursor: pointer;">
          Обновить страницу
        </button>
        <p style="color: #888; margin-top: 20px;">Технические детали: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
      </div>
    `
  }
}
