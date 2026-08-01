# Domain: `exercises`

**Qué es:** UI de ejercicios interactivos del producto.

**Qué no es:** páginas de ejercicio (`pages/ExercisePage`), demos de diagrama.

## Layout

| Ruta | Rol |
|---|---|
| `ui/` | componentes de ejercicio |
| `constants.ts` | defaults editables |

Preferir composición desde `pages/` / MDX; no deep-import desde otras features.
