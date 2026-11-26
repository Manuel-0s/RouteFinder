# RouteFinder

Visualizador interactivo de algoritmos de búsqueda de rutas sobre una cuadrícula. El proyecto está construido con TypeScript, Vite, PixiJS y Tweakpane.

## Requisitos

- Node.js 18 o una versión posterior.
- npm, incluido con Node.js.

## Instalación

1. Clona el repositorio y entra en su directorio:

   ```bash
   git clone https://github.com/Manuel-0s/RouteFinder.git
   cd RouteFinder
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Ejecutar en desarrollo

Inicia el servidor de Vite:

```bash
npm run dev
```

Abre la dirección que muestre Vite en la terminal, normalmente `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con Vite. |
| `npm run build` | Comprueba los tipos de TypeScript y genera la compilación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación existente de `dist/`. |

Antes de ejecutar `npm run preview`, genera primero una compilación con `npm run build`.
