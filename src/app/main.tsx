import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import { publicAsset } from '@/shared/lib/routeHelper';

// Configurar las dos texturas con BASE_URL. El tema elige cuál queda activa
// desde CSS, de modo que el atributo inline no bloquee el cambio a modo oscuro.
document.documentElement.style.setProperty('--bg-arts-and-crafts-light-url', `url(${publicAsset('/images/bg-arts-crafts-1.png')})`);
document.documentElement.style.setProperty('--bg-arts-and-crafts-dark-url', `url(${publicAsset('/images/bg-arts-crafts-dark.jpg')})`);

/**
 * Punto de entrada principal de la aplicación React.
 * Inicializa el árbol de componentes dentro de `StrictMode`.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
