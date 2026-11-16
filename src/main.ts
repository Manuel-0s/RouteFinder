import './style.css';
import { Application, Sprite, Texture } from 'pixi.js';
import { Pane } from 'tweakpane';

async function init() {
    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundColor: 0x1e1e2e,
        antialias: true,
    });

    // Agregar el canvas generado al HTML
    document.body.appendChild(app.canvas);

    // 2. Configuración básica de la cuadrícula
    const COLS = 30;
    const ROWS = 20;
    const CELL_SIZE = 28;
    const GAP = 2; 

    // 3. Dibujar las celdas usando Sprites (muy rápido en GPU)
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
        // Texture.WHITE es un cuadrado blanco de 1x1 en memoria que podemos teñir (tint)
        const cell = new Sprite(Texture.WHITE);
        
        cell.width = CELL_SIZE;
        cell.height = CELL_SIZE;
        cell.x = col * (CELL_SIZE + GAP) + 50;
        cell.y = row * (CELL_SIZE + GAP) + 50;
        cell.tint = 0x313244; // Color gris oscuro inicial

        // Hacer la celda interactiva al clic
        cell.eventMode = 'static';
        cell.cursor = 'pointer';
        
        cell.on('pointerdown', () => {
            // Alternar color (simulando poner/quitar un muro)
            cell.tint = cell.tint === 0x313244 ? 0xf38ba8 : 0x313244;
        });

        app.stage.addChild(cell);
        }
    }

    // 4. Crear el panel de control flotante
    const pane = new Pane({ title: 'Controles' });
    const params = { algoritmo: 'A*', velocidad: 50 };

    pane.addBinding(params, 'algoritmo', {
        options: { Dijkstra: 'dijkstra', 'A* (A-Star)': 'astar' },
    });
    pane.addBinding(params, 'velocidad', { min: 1, max: 100 });
    pane.addButton({ title: 'Iniciar Recorrido' }).on('click', () => {
        console.log('Ejecutando:', params.algoritmo);
    });
}

init();