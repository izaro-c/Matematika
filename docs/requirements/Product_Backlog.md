# Product Backlog

Este documento contiene las Historias de Usuario (User Stories) pendientes para el proyecto Matematika, ordenadas estrictamente por prioridad. Los criterios de aceptación de cada historia están clasificados por requisitos funcionales, no funcionales y de modelo de datos.

---

### US-01: Registro de Usuarios
- **Descripción:** Como usuario visitante, quiero poder registrarme en la plataforma utilizando un correo electrónico y contraseña para tener mi propio perfil personal.
- **Prioridad:** Alta (Crítica)
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - El formulario debe validar el formato correcto del email y comprobar que las contraseñas coincidan.
    - Al completar el registro, el sistema debe iniciar la sesión automáticamente y redirigir al panel principal.
  - **No Funcionales:**
    - (Seguridad) La contraseña debe ser procesada y encriptada utilizando algoritmos seguros (ej. bcrypt) antes del almacenamiento.
    - (Usabilidad) El sistema debe mostrar mensajes claros si el usuario ya existe o la contraseña es débil.
  - **De Modelo:**
    - Crear la entidad `User` en la base de datos con atributos: `id` (UUID), `email` (String, Unique), `passwordHash` (String), y `createdAt` (Timestamp).

### US-02: Inicio de Sesión (Autenticación)
- **Descripción:** Como usuario registrado, quiero poder iniciar sesión de forma segura para acceder a mi progreso y a funcionalidades exclusivas según mi rol.
- **Prioridad:** Alta (Crítica)
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - Debe permitir la entrada de credenciales y autenticar contra la base de datos.
    - Debe proveer una función de "Cerrar sesión" para terminar el acceso.
  - **No Funcionales:**
    - (Seguridad) El sistema debe utilizar JWT (JSON Web Tokens) o Cookies HTTP-Only para mantener la sesión.
    - (Rendimiento) El proceso de autenticación debe resolverse en menos de 500ms.
  - **De Modelo:**
    - Modificar la entidad `User` o crear una tabla `Session` temporal para manejar tokens activos si es necesario, incluyendo atributos como `lastLogin` (Timestamp).

### US-03: Asignación de Roles Básicos
- **Descripción:** Como administrador/sistema, quiero asignar a los usuarios el rol de 'Alumno' o 'Profesor' para otorgar permisos y vistas diferenciadas.
- **Prioridad:** Alta
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - Durante el registro o desde un panel de admin, debe ser posible seleccionar el rol del usuario.
    - La interfaz de navegación (Sidebar/Navbar) debe ocultar opciones exclusivas del profesor a los alumnos.
  - **No Funcionales:**
    - (Seguridad) Las rutas protegidas del CMS deben verificar el rol del usuario en el backend para evitar accesos no autorizados mediante manipulaciones en el frontend.
  - **De Modelo:**
    - Extender la entidad `User` con el atributo `role` (Enum: `STUDENT`, `TEACHER`, `ADMIN`).

### US-04: Editor Simplificado de Contenido (CMS)
- **Descripción:** Como profesor, quiero disponer de un editor web integrado e intuitivo para añadir nuevos teoremas, definiciones y ejercicios fácilmente sin necesidad de programar en MDX o tocar el código fuente del proyecto.
- **Prioridad:** Alta
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - Proveer un formulario WYSIWYG que abstraiga la creación del contenido Markdown.
    - Generar el Frontmatter automáticamente en base a campos de entrada de texto (Título, Tags).
  - **No Funcionales:**
    - (Usabilidad) El sistema debe previsualizar el renderizado matemático ($\LaTeX$) en tiempo real.
    - (Mantenibilidad) El contenido generado debe adherirse estrictamente a las validaciones de Zod preexistentes.
  - **De Modelo:**
    - Definir la entidad `ContentNode` (si se traslada a BDD) con atributos `id`, `title`, `body_mdx`, `authorId` (Relación con `User`), `type` (Enum: teorema, definicion, etc).

### US-05: Vinculación Alumno-Profesor
- **Descripción:** Como profesor, quiero poder generar un código o enlace de invitación para que mis alumnos se vinculen a mis clases virtuales.
- **Prioridad:** Media
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - El profesor puede crear una "Clase" y obtener un código único.
    - El alumno puede usar el botón "Unirse a una clase" e introducir el código para ser vinculado.
  - **No Funcionales:**
    - (Rendimiento) La validación del código debe ser inmediata mediante debounce en el frontend.
  - **De Modelo:**
    - Crear la entidad `Classroom` con atributos `id`, `teacherId`, `inviteCode`, `name`.
    - Crear la tabla intermedia (Relación N:M o 1:N) `ClassroomEnrollment` relacionando `classroomId` y `studentId`.

### US-06: Panel de Seguimiento del Profesor
- **Descripción:** Como profesor, quiero ver un panel de control con la lista de mis alumnos vinculados para confirmar quiénes están registrados en mi clase.
- **Prioridad:** Media
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - El dashboard debe mostrar una tabla paginada con todos los alumnos inscritos en las clases del profesor.
    - El profesor puede buscar por nombre o remover alumnos de su clase.
  - **No Funcionales:**
    - (Diseño) La tabla debe ser "responsive" y funcional en tablets.
  - **De Modelo:**
    - No requiere nuevas tablas. Se nutre de la consulta sobre `ClassroomEnrollment` y `User`.

### US-07: Analíticas de Progreso de Alumnos
- **Descripción:** Como profesor, quiero poder hacer click en un alumno de mi lista para ver sus métricas de progreso (nodos leídos, ejercicios completados) y así identificar si necesitan ayuda en algún tema específico.
- **Prioridad:** Media
- **Estado:** To Do
- **Criterios de Aceptación:**
  - **Funcionales:**
    - Renderizar métricas como % del contenido completado y ejercicios superados.
    - Presentar la lista de los últimos nodos visitados por el alumno.
  - **No Funcionales:**
    - (Rendimiento) Las agregaciones de progreso deben ser rápidas o estar cacheadas si el número de datos es grande.
  - **De Modelo:**
    - Migrar el actual `ProgressStore` (localStorage) a una entidad persistente de backend `UserProgress` con atributos `id`, `userId`, `nodeId`, `status` (Enum: READ, EXERCISE_PASSED), `updatedAt`.
