import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { COLORS, GRID_CONFIG } from '../config/constants';
import type { GridManager } from '../core/GridManager';
import type { Node, PathfindingResult } from '../types/grid.types';
import { CameraController } from './CameraController';

export class GridRenderer {
    public app: Application;
    public worldContainer: Container;
    public camera!: CameraController;

    private cellTexture!: Texture;
    private glowTexture!: Texture;

    private animationQueue: { node: Node; type: 'visit' | 'path' }[] = [];
    private animationSpeed = 2;
    private isAnimating = false;

    constructor() {
        this.app = new Application();
        this.worldContainer = new Container();
    }

    public async init(gridManager: GridManager): Promise<void> {
        await this.app.init({
            resizeTo: window,
            backgroundColor: COLORS.BACKGROUND,
            antialias: true,
        });

        document.body.appendChild(this.app.canvas);
        this.app.stage.addChild(this.worldContainer);

        this.createTextures();
        this.buildGridSprites(gridManager);
        this.camera = new CameraController(this.worldContainer);

        this.app.ticker.add(() => this.updateFrame(gridManager));
    }

    private createTextures(): void {
        const cellGfx = new Graphics()
            .roundRect(0, 0, GRID_CONFIG.CELL_SIZE, GRID_CONFIG.CELL_SIZE, 6)
            .fill(0xffffff);
        this.cellTexture = this.app.renderer.generateTexture(cellGfx);

        const glowGfx = new Graphics()
            .circle(GRID_CONFIG.CELL_SIZE, GRID_CONFIG.CELL_SIZE, GRID_CONFIG.CELL_SIZE * 0.9)
            .fill({ color: 0xffffff, alpha: 0.35 });
        this.glowTexture = this.app.renderer.generateTexture(glowGfx);
    }

    private buildGridSprites(gridManager: GridManager): void {
        const totalWidth = GRID_CONFIG.COLS * (GRID_CONFIG.CELL_SIZE + GRID_CONFIG.GAP);
        const totalHeight = GRID_CONFIG.ROWS * (GRID_CONFIG.CELL_SIZE + GRID_CONFIG.GAP);

        const startX = -totalWidth / 2 + GRID_CONFIG.CELL_SIZE / 2;
        const startY = -totalHeight / 2 + GRID_CONFIG.CELL_SIZE / 2;

        for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
            gridManager.grid[r] = [];
            for (let c = 0; c < GRID_CONFIG.COLS; c++) {
                const posX = startX + c * (GRID_CONFIG.CELL_SIZE + GRID_CONFIG.GAP);
                const posY = startY + r * (GRID_CONFIG.CELL_SIZE + GRID_CONFIG.GAP);

                const glowSprite = new Sprite(this.glowTexture);
                glowSprite.anchor.set(0.5);
                glowSprite.x = posX;
                glowSprite.y = posY;
                glowSprite.blendMode = 'add';
                glowSprite.visible = false;

                const cellSprite = new Sprite(this.cellTexture);
                cellSprite.anchor.set(0.5);
                cellSprite.x = posX;
                cellSprite.y = posY;
                cellSprite.tint = COLORS.EMPTY;

                const node: Node = {
                    row: r,
                    col: c,
                    isWall: false,
                    sprite: cellSprite,
                    glowSprite,
                    gDistance: Infinity,
                    hDistance: Infinity,
                    fDistance: Infinity,
                    previous: null,
                    targetScale: 1,
                };

                cellSprite.eventMode = 'static';
                cellSprite.cursor = 'pointer';
                cellSprite.on('pointerdown', (e) => {
                    if (e.button === 0 && !e.shiftKey) {
                        gridManager.handleNodeClick(node);
                    }
                });

                gridManager.grid[r][c] = node;
                this.worldContainer.addChild(glowSprite);
                this.worldContainer.addChild(cellSprite);
            }
        }
    }

    public animateSearch(result: PathfindingResult): void {
        this.animationQueue = [];

        for (const node of result.visitedOrder) {
            this.animationQueue.push({ node, type: 'visit' });
        }

        for (const node of result.path) {
            this.animationQueue.push({ node, type: 'path' });
        }

        this.isAnimating = true;
    }

    public stopAnimation(): void {
        this.animationQueue = [];
        this.isAnimating = false;
    }

    public setAnimationSpeed(speed: number): void {
        this.animationSpeed = speed;
    }

    private updateFrame(gridManager: GridManager): void {
        if (this.isAnimating && this.animationQueue.length > 0) {
            for (let i = 0; i < this.animationSpeed; i++) {
                const step = this.animationQueue.shift();
                if (!step) {
                    this.isAnimating = false;
                    break;
                }

                const { node, type } = step;
                if (node === gridManager.startNode || node === gridManager.endNode) continue;

                if (type === 'visit') {
                    node.sprite.tint = COLORS.VISITED;
                    node.sprite.scale.set(0.4); 
                    node.sprite.rotation = Math.PI / 6;
                } else if (type === 'path') {
                    node.sprite.tint = COLORS.PATH;
                    node.sprite.scale.set(1.25); 
                }
            }
        }

        for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
            for (let c = 0; c < GRID_CONFIG.COLS; c++) {
                const s = gridManager.grid[r][c].sprite;
                const target = gridManager.grid[r][c].targetScale;

                s.scale.x += (target - s.scale.x) * 0.18;
                s.scale.y += (target - s.scale.y) * 0.18;
                s.rotation += (0 - s.rotation) * 0.15;
            }
        }
    }
}