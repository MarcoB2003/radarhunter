import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Renderiza a aplicação imediatamente
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
