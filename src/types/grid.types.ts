import type { Sprite } from 'pixi.js';

export type AlgorithmType = 'dijkstra' | 'astar';

export interface Node {
    row: number;
    col: number;
    isWall: boolean;
    sprite: Sprite;
    gDistance: number;
    hDistance: number;
    fDistance: number;
    previous: Node | null;
}