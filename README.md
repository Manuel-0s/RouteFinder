# RouteFinder

Visualizador interactivo de algoritmos de búsqueda de rutas sobre una cuadrícula. El proyecto está construido con TypeScript, Vite, PixiJS y Tweakpane.

## Requisitos

- Node.js 18 o una versión posterior.
- npm, incluido con Node.js.
- Git.

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

---

# Flujo de trabajo con Git

**Regla de oro: nunca trabajes directamente en `main`.** Cada tarea se hace en su propia rama.

Cada vez que vayas a trabajar, sigue estos pasos en orden.

## 1. Entra a la carpeta del proyecto

```bash
cd RouteFinder
git status
```

## 2. Ve a `main` y descarga lo más reciente

```bash
git checkout main
git pull origin main
```

Hazlo siempre antes de empezar, para partir de lo último que subió tu compañero.

## 3. Crea una rama nueva para tu tarea

```bash
git checkout -b feature/nombre-de-la-tarea
```

Ejemplos: `feature/metricas`, `fix/centrar-zoom`. Usa minúsculas, sin espacios ni acentos.

## 4. Trabaja y prueba

```bash
npm run dev
```

## 5. Revisa qué cambiaste

```bash
git status
git diff
```

`git diff` se cierra con la tecla `q`.

## 6. Guarda tus cambios (commit)

```bash
git add .
git commit -m "Agrega contador de nodos visitados"
```

Mensajes cortos que digan qué hiciste. Mal: `cambios`. Bien: `Corrige el centrado de la cámara`. Haz commits pequeños y frecuentes.

## 7. Sube tu rama a GitHub

```bash
git push -u origin feature/nombre-de-la-tarea
```

La primera vez lleva `-u`; las siguientes basta con `git push`.

## 8. Abre un Pull Request en GitHub

1. Entra al repositorio en GitHub y pulsa **Compare & pull request**.
2. Escribe un título y una breve descripción.
3. Pulsa **Create pull request**.
4. Avisa a tu compañero para que lo revise.
5. Cuando esté aprobado, pulsa **Merge pull request**.

## 9. Actualiza tu copia local

```bash
git checkout main
git pull origin main
git branch -d feature/nombre-de-la-tarea
```

---

## Resumen

```text
git checkout main
git pull origin main
git checkout -b feature/algo
   ... trabajar y probar ...
git add .
git commit -m "Mensaje claro"
git push -u origin feature/algo
   ... Pull Request en GitHub y merge ...
git checkout main
git pull origin main
```
