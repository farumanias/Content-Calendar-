# Calendario de Contenido

Sistema práctico para planificar y organizar contenido de redes sociales. Es una aplicación web que corre en el navegador, sin necesidad de backend ni base de datos: todo se guarda en el `localStorage` del navegador.

## Funcionalidades

- **Vista de calendario mensual**: navega entre meses, ve las publicaciones de cada día y arrástralas para reprogramarlas.
- **Tablero Kanban**: columnas por estado (Idea → En diseño → Programado → Publicado), arrastra las tarjetas entre columnas.
- **Editor de publicaciones**: título, texto/copy, redes sociales (Instagram, Facebook, X/Twitter, TikTok, LinkedIn, YouTube, Pinterest), tipo de contenido (post, reel, historia, video, carrusel, en vivo, artículo), fecha y hora, hashtags, enlace y notas internas.
- **Filtros y búsqueda**: por texto libre, red social y estado.
- **Panel de estadísticas**: total de publicaciones, próximas en 7 días y desglose por estado.
- **Exportar/Importar**: exporta a CSV o JSON, e importa un JSON previamente exportado (útil como respaldo o para compartir el calendario).
- **Duplicar publicaciones**: para reutilizar contenido recurrente rápidamente.

## Requisitos

- Node.js 18 o superior.

## Instalación y uso

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Otros comandos

```bash
npm run build    # compila la app para producción en dist/
npm run preview  # sirve la build de producción localmente
npm run lint     # revisa el código con ESLint
```

## Datos y respaldo

Los datos se guardan automáticamente en el `localStorage` del navegador (clave `content-calendar:posts:v1`), por lo que persisten entre sesiones en el mismo navegador/dispositivo. Para respaldar o mover tu calendario a otro navegador, usa **Exportar JSON** y luego **Importar JSON** en el destino.

## Stack técnico

- React 18 + TypeScript
- Vite
- Sin dependencias de UI externas (CSS propio, ligero y responsivo)
