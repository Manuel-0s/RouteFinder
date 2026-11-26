import { GRID_CONFIG } from '../config/constants';
import type { AlgorithmType, Node, PathfindingResult } from '../types/grid.types';

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

function reconstructPath(endNode: Node): Node[] {
    const path: Node[] = [];
    let curr: Node | null = endNode;
    while (curr) {
        path.unshift(curr);
        curr = curr.previous;
    }
    return path;
}

export function solvePathfinding(
    grid: Node[][],
    startNode: Node,
    endNode: Node,
    type: AlgorithmType
): PathfindingResult {
    const openSet: Node[] = [];
    const visitedOrder: Node[] = [];

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

        if (visitedSet.has(current)) continue;
        visitedSet.add(current);
        visitedOrder.push(current);

        if (current === endNode) {
            return {
                visitedOrder,
                path: reconstructPath(endNode),
            };
        }

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

    return { visitedOrder, path: [] };
}