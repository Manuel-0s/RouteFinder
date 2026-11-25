export const GRID_CONFIG = {
    COLS: 30,
    ROWS: 20,
    CELL_SIZE: 28,
    GAP: 2,
    OFFSET_X: 50,
    OFFSET_Y: 50,
} as const;

export const COLORS = {
    BACKGROUND: 0x1e1e2e,
    EMPTY: 0x313244,   // Fondo base (Gris oscuro)
    WALL: 0x6c7086,    // Muro (Gris claro)
    START: 0xa6e3a1,   // Punto Inicio (Verde)
    END: 0xf38ba8,     // Punto Destino (Rojo)
    PATH: 0x89b4fa,    // Camino encontrado (Azul)
} as const;