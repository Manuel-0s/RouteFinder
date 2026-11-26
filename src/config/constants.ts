export const GRID_CONFIG = {
    COLS: 30,
    ROWS: 20,
    CELL_SIZE: 28,
    GAP: 3,
} as const;

export const COLORS = {
    BACKGROUND: 0x1e1e2e,
    EMPTY: 0x313244,    // Fondo base
    WALL: 0x6c7086,     // Muro
    START: 0xa6e3a1,    // Inicio (Verde)
    END: 0xf38ba8,      // Destino (Rojo)
    VISITED: 0x45475a,  // Nodo explorado
    PATH: 0x89b4fa,     // Camino óptimo (Azul)
    GLOW: 0xb4befe,     // Iluminación del recorrido
} as const;