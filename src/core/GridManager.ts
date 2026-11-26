import { COLORS, GRID_CONFIG } from '../config/constants';
import type { Node } from '../types/grid.types';

export class GridManager {
    public grid: Node[][] = [];
    public startNode: Node | null = null;
    public endNode: Node | null = null;

    public handleNodeClick(node: Node): void {
        if (node === this.startNode || node === this.endNode) return;

        node.sprite.scale.set(0.5);
        node.targetScale = 1;

        if (!this.startNode) {
            this.startNode = node;
            node.isWall = false;
            node.sprite.tint = COLORS.START;
            node.glowSprite.visible = true;
            node.glowSprite.tint = COLORS.START;
        } else if (!this.endNode) {
            this.endNode = node;
            node.isWall = false;
            node.sprite.tint = COLORS.END;
            node.glowSprite.visible = true;
            node.glowSprite.tint = COLORS.END;
        } else {
            node.isWall = !node.isWall;
            node.sprite.tint = node.isWall ? COLORS.WALL : COLORS.EMPTY;
            node.glowSprite.visible = false;
        }
    }

    public resetAlgorithmData(): void {
        for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
            for (let c = 0; c < GRID_CONFIG.COLS; c++) {
                const n = this.grid[r][c];
                n.gDistance = Infinity;
                n.hDistance = Infinity;
                n.fDistance = Infinity;
                n.previous = null;

                if (!n.isWall && n !== this.startNode && n !== this.endNode) {
                    n.sprite.tint = COLORS.EMPTY;
                    n.sprite.rotation = 0;
                    n.glowSprite.visible = false;
                }
            }
        }
    }

    public clearAll(): void {
        this.startNode = null;
        this.endNode = null;
        for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
            for (let c = 0; c < GRID_CONFIG.COLS; c++) {
                const n = this.grid[r][c];
                n.isWall = false;
                n.sprite.tint = COLORS.EMPTY;
                n.sprite.rotation = 0;
                n.sprite.scale.set(0.85);
                n.targetScale = 1;
                n.glowSprite.visible = false;
            }
        }
    }
}