import type { Sprite } from 'pixi.js';

export type AlgorithmType = 'dijkstra' | 'astar';

export interface Node {
    row: number;
    col: number;
    isWall: boolean;
    sprite: Sprite;
    glowSprite: Sprite;
    gDistance: number;
    hDistance: number;
    fDistance: number;
    previous: Node | null;
    targetScale: number;
}

export interface PathfindingResult {
    visitedOrder: Node[];
    path: Node[];
}