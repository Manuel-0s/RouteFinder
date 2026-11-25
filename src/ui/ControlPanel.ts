import { Pane } from 'tweakpane';
import type { AlgorithmType } from '../types/grid.types';

interface ControlCallbacks {
    onStart: (algorithm: AlgorithmType) => void;
    onClear: () => void;
}

export class ControlPanel {
    private pane: Pane;
    private params: { algoritmo: AlgorithmType };

    constructor(callbacks: ControlCallbacks) {
        this.pane = new Pane({ title: 'Controles RouteFinder' });
        this.params = { algoritmo: 'astar' };

        this.pane.addBinding(this.params, 'algoritmo', {
            options: { 'A* (A-Star)': 'astar', 'Dijkstra': 'dijkstra' },
        });

        this.pane.addButton({ title: 'Iniciar Recorrido' }).on('click', () => {
            callbacks.onStart(this.params.algoritmo);
        });

        this.pane.addButton({ title: 'Limpiar Todo' }).on('click', () => {
            callbacks.onClear();
        });
    }
}