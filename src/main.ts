import './style.css';
import { Application, Sprite, Texture } from 'pixi.js';
import { Pane } from 'tweakpane';

// Estructura de un nodo para la cuadrícula y los algoritmos
interface Node {
    row: number;
    col: number;
    isWall: boolean;
    sprite: Sprite;
    gDistance: number;
    hDistance: number;
    fDistance: number;
    previous: Node | null;
}

const COLOR_EMPTY = 0x313244;   // Fondo base (Gris oscuro)
const COLOR_WALL = 0x6c7086;    // Muro (Gris claro)
const COLOR_START = 0xa6e3a1;   // Punto Inicio (Verde)
const COLOR_END = 0xf38ba8;     // Punto Destino (Rojo)
const COLOR_PATH = 0x89b4fa;    // Camino encontrado (Azul)

async function init() {
    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundColor: 0x1e1e2e,
        antialias: true,
    });

    document.body.appendChild(app.canvas);

    const COLS = 30;
    const ROWS = 20;
    const CELL_SIZE = 28;
    const GAP = 2;

    const grid: Node[][] = [];
    let startNode: Node | null = null;
    let endNode: Node | null = null;

    for (let r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (let c = 0; c < COLS; c++) {
            const cellSprite = new Sprite(Texture.WHITE);
            cellSprite.width = CELL_SIZE;
            cellSprite.height = CELL_SIZE;
            cellSprite.x = c * (CELL_SIZE + GAP) + 50;
            cellSprite.y = r * (CELL_SIZE + GAP) + 50;
            cellSprite.tint = COLOR_EMPTY;

            const node: Node = {
                row: r,
                col: c,
                isWall: false,
                sprite: cellSprite,
                gDistance: Infinity,
                hDistance: Infinity,
                fDistance: Infinity,
                previous: null,
            };

            cellSprite.eventMode = 'static';
            cellSprite.cursor = 'pointer';

            cellSprite.on('pointerdown', () => {
                if (node === startNode || node === endNode) return;

                if (!startNode) {
                    startNode = node;
                    node.isWall = false;
                    node.sprite.tint = COLOR_START;
                } else if (!endNode) {
                    endNode = node;
                    node.isWall = false;
                    node.sprite.tint = COLOR_END;
                } else {
                    node.isWall = !node.isWall;
                    node.sprite.tint = node.isWall ? COLOR_WALL : COLOR_EMPTY;
                }
            });

            grid[r][c] = node;
            app.stage.addChild(cellSprite);
        }
    }

    function getNeighbors(node: Node): Node[] {
        const neighbors: Node[] = [];
        const { row, col } = node;

        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

        return neighbors.filter(n => !n.isWall);
    }

    function heuristic(a: Node, b: Node): number {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    function resetAlgorithmData() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const n = grid[r][c];
                n.gDistance = Infinity;
                n.hDistance = Infinity;
                n.fDistance = Infinity;
                n.previous = null;
                
                if (!n.isWall && n !== startNode && n !== endNode) {
                    n.sprite.tint = COLOR_EMPTY;
                }
            }
        }
    }

    function solvePathfinding(type: 'dijkstra' | 'astar') {
        if (!startNode || !endNode) {
            alert('Por favor selecciona primero un Punto de Inicio (1er clic) y un Destino (2do clic).');
            return;
        }

        resetAlgorithmData();

        const openSet: Node[] = [];
        startNode.gDistance = 0;
        startNode.hDistance = heuristic(startNode, endNode);
        startNode.fDistance = type === 'astar' ? startNode.hDistance : 0;
        openSet.push(startNode);

        const visitedSet = new Set<Node>();

        while (openSet.length > 0) {
            openSet.sort((a, b) => 
                type === 'astar' ? a.fDistance - b.fDistance : a.gDistance - b.gDistance
            );

            const current = openSet.shift()!;

            if (current === endNode) {
                drawPath(endNode);
                return;
            }

            visitedSet.add(current);

            const neighbors = getNeighbors(current);
            for (const neighbor of neighbors) {
                if (visitedSet.has(neighbor)) continue;

                const tentativeG = current.gDistance + 1;

                if (tentativeG < neighbor.gDistance) {
                    neighbor.previous = current;
                    neighbor.gDistance = tentativeG;
                    neighbor.hDistance = heuristic(neighbor, endNode);
                    neighbor.fDistance = type === 'astar' 
                        ? neighbor.gDistance + neighbor.hDistance 
                        : neighbor.gDistance;

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        alert('No existe un camino posible hasta el destino.');
    }

    function drawPath(end: Node) {
        let curr: Node | null = end.previous;
        while (curr && curr !== startNode) {
            curr.sprite.tint = COLOR_PATH;
            curr = curr.previous;
        }
    }

    const pane = new Pane({ title: 'Controles RouteFinder' });
    const params = { algoritmo: 'astar' };

    pane.addBinding(params, 'algoritmo', {
        options: { 'A* (A-Star)': 'astar', 'Dijkstra': 'dijkstra' },
    });

    pane.addButton({ title: 'Iniciar Recorrido' }).on('click', () => {
        solvePathfinding(params.algoritmo as 'dijkstra' | 'astar');
    });

    pane.addButton({ title: 'Limpiar Todo' }).on('click', () => {
        startNode = null;
        endNode = null;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                grid[r][c].isWall = false;
                grid[r][c].sprite.tint = COLOR_EMPTY;
            }
        }
    });
}

init();