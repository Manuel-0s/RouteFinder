import { Pane } from 'tweakpane';
import type { AlgorithmType, ProjectionMode } from '../types/grid.types';

interface ControlCallbacks {
    onStart: (algorithm: AlgorithmType) => void;
    onClear: () => void;
    onProjectionChange: (mode: ProjectionMode) => void;
    onSpeedChange: (speed: number) => void;
    onResetCamera: () => void;
}

export class ControlPanel {
    private pane: Pane;
    private params: {
        algoritmo: AlgorithmType;
        proyeccion: ProjectionMode;
        velocidad: number;
    };

    constructor(callbacks: ControlCallbacks) {
        this.pane = new Pane({ title: 'Controles RouteFinder' });
        this.params = {
            algoritmo: 'astar',
            proyeccion: 'orthographic',
            velocidad: 2,
        };

        const simFolder = this.pane.addFolder({ title: 'Simulación' });
        simFolder.addBinding(this.params, 'algoritmo', {
            options: { 'A* (A-Star)': 'astar', 'Dijkstra': 'dijkstra' },
        });
        simFolder.addBinding(this.params, 'velocidad', {
            min: 1,
            max: 10,
            step: 1,
        }).on('change', (ev) => callbacks.onSpeedChange(ev.value));

        simFolder.addButton({ title: 'Iniciar Recorrido' }).on('click', () => {
            callbacks.onStart(this.params.algoritmo);
        });
        simFolder.addButton({ title: 'Limpiar Todo' }).on('click', () => {
            callbacks.onClear();
        });

        const camFolder = this.pane.addFolder({ title: 'Cámara y Proyección' });
        camFolder.addBinding(this.params, 'proyeccion', {
            options: {
                '2D Ortográfica': 'orthographic',
                'Isométrica': 'isometric',
            },
        }).on('change', (ev) => callbacks.onProjectionChange(ev.value));

        camFolder.addButton({ title: 'Centrar Cámara' }).on('click', () => {
            callbacks.onResetCamera();
        });
    }
}