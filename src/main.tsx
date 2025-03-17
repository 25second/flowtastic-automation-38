
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wrap render in try-catch to help with debugging
try {
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(container);
  root.render(<App />);
  
  console.log("Application successfully rendered");
} catch (error) {
  console.error("Failed to render application:", error);
}
