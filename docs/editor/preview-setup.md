# Guía de Ejecución: `npm run preview` con Editor API Funcional

En desarrollo (`npm run dev`), Vite inyecta las rutas `/api/*` mediante su middleware de desarrollo. En modo `preview` (producción empaquetada), el bundle estático en `dist/` requiere un servidor de API independiente y la URL configurada en tiempo de compilación.

---

## Requisitos y Flujo de Comunicación

- **Frontend (Vite Preview)**: Puerto `4173` (`http://localhost:4173/Matematika/`)
- **Backend API (Editor Server)**: Puerto `8787` (`http://localhost:8787`)
- **CORS**: [`scripts/editor/editorApiServer.ts`](file:///home/izaro/Proiektuak/Matematika_Drafts/scripts/editor/editorApiServer.ts) permite peticiones desde `http://localhost:4173` por defecto.

---

## Pasos de Ejecución

### 1. Compilar el proyecto con la URL de la API

Dado que `VITE_EDITOR_API_URL` se embebe durante el build de Vite:

```bash
VITE_EDITOR_API_URL=http://localhost:8787 npm run build
```

*(Alternativa: crear un archivo `.env.local` con `VITE_EDITOR_API_URL=http://localhost:8787` y ejecutar `npm run build`).*

---

### 2. Iniciar el servidor API del editor (Terminal 1)

Ejecuta el servidor backend standalone:

```bash
npm run editor:server
```

> **Opcional (Protección de escritura):**
> Si defines un token de seguridad:
> ```bash
> EDITOR_API_TOKEN=mi-clave-secreta npm run editor:server
> ```
> Deberás ingresar el mismo token en la interfaz del editor para poder guardar cambios.

---

### 3. Iniciar el servidor de preview (Terminal 2)

Lanza el servidor estático de producción:

```bash
npm run preview
```

---

### 4. Acceso y Verificación

1. Abre el navegador en: `http://localhost:4173/Matematika/`
2. Accede al editor en: `http://localhost:4173/Matematika/editor`
3. Comprueba que el banner de estado del editor confirme la conexión con `http://localhost:8787`.
