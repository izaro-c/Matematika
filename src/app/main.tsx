import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import { publicAsset } from '@/shared/lib/routeHelper';

// Configurar variables CSS globales que dependen de BASE_URL
document.documentElement.style.setProperty('--bg-arts-and-crafts-url', `url(${publicAsset('/images/bg-arts-crafts-1.png')})`);

/**
 * Punto de entrada principal de la aplicación React.
 * Inicializa el árbol de componentes dentro de `StrictMode`.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
