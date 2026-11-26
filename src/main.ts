import './style.css';
import { GridManager } from './core/GridManager';
import { solvePathfinding } from './core/pathfinding';
import { GridRenderer } from './graphics/GridRenderer';
import { ControlPanel } from './ui/ControlPanel';

async function bootstrap() {
    const gridManager = new GridManager();
    const renderer = new GridRenderer();

    await renderer.init(gridManager);

    new ControlPanel({
        onStart: (algorithm) => {
            if (!gridManager.startNode || !gridManager.endNode) {
                alert('Selecciona primero un Punto de Inicio (1er clic) y un Destino (2do clic).');
                return;
            }

            renderer.stopAnimation();
            gridManager.resetAlgorithmData();

            const result = solvePathfinding(
                gridManager.grid,
                gridManager.startNode,
                gridManager.endNode,
                algorithm
            );

            if (result.path.length > 0) {
                renderer.animateSearch(result);
            } else {
                renderer.animateSearch(result);
                alert('No existe un camino posible hasta el destino.');
            }
        },
        onClear: () => {
            renderer.stopAnimation();
            gridManager.clearAll();
        },
        onSpeedChange: (speed) => {
            renderer.setAnimationSpeed(speed);
        },
        onResetCamera: () => {
            renderer.camera.centerCamera();
        },
    });
}

bootstrap();