import { Application, Sprite, Texture } from 'pixi.js';
import { COLORS, GRID_CONFIG } from '../config/constants';
import type { GridManager } from '../core/GridManager';
import type { Node } from '../types/grid.types';

export class GridRenderer {
    private app: Application;

    constructor() {
        this.app = new Application();
    }

    public async init(gridManager: GridManager): Promise<void> {
        await this.app.init({
            resizeTo: window,
            backgroundColor: COLORS.BACKGROUND,
            antialias: true,
        });

        document.body.appendChild(this.app.canvas);
        this.buildGridSprites(gridManager);
    }

    private buildGridSprites(gridManager: GridManager): void {
        for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
            gridManager.grid[r] = [];
            for (let c = 0; c < GRID_CONFIG.COLS; c++) {
                const cellSprite = new Sprite(Texture.WHITE);
                cellSprite.width = GRID_CONFIG.CELL_SIZE;
                cellSprite.height = GRID_CONFIG.CELL_SIZE;
                cellSprite.x = c * (GRID_CONFIG.CELL_SIZE + GRID_CONFIG.GAP) + GRID_CONFIG.OFFSET_X;
                cellSprite.y = r * (GRID_CONFIG.CELL_SIZE + GRID_CONFIG.GAP) + GRID_CONFIG.OFFSET_Y;
                cellSprite.tint = COLORS.EMPTY;

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
                cellSprite.on('pointerdown', () => gridManager.handleNodeClick(node));

                gridManager.grid[r][c] = node;
                this.app.stage.addChild(cellSprite);
            }
        }
    }

    public drawPath(endNode: Node, startNode: Node | null): void {
        let curr: Node | null = endNode.previous;
        while (curr && curr !== startNode) {
            curr.sprite.tint = COLORS.PATH;
            curr = curr.previous;
        }
    }
}