import { GRID_CONFIG } from '../config/constants';
import type { AlgorithmType, Node } from '../types/grid.types';

export function getNeighbors(grid: Node[][], node: Node): Node[] {
    const neighbors: Node[] = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < GRID_CONFIG.ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < GRID_CONFIG.COLS - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(n => !n.isWall);
}

export function heuristic(a: Node, b: Node): number {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function solvePathfinding(
    grid: Node[][],
    startNode: Node,
    endNode: Node,
    type: AlgorithmType
): Node | null {
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
            return endNode;
        }

        visitedSet.add(current);

        const neighbors = getNeighbors(grid, current);
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

    return null;
}