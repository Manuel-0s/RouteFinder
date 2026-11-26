import type { Container } from 'pixi.js';
import type { ProjectionMode } from '../types/grid.types';

export class CameraController {
    private worldContainer: Container;
    private isDragging = false;
    private lastPos = { x: 0, y: 0 };
    private zoomLevel = 1;

    constructor(worldContainer: Container) {
        this.worldContainer = worldContainer;
        this.setupEvents();
        this.centerCamera();
    }

    public centerCamera(): void {
        this.worldContainer.x = window.innerWidth / 2;
        this.worldContainer.y = window.innerHeight / 2;
    }

    public setProjection(mode: ProjectionMode): void {
        if (mode === 'isometric') {
            this.worldContainer.scale.set(this.zoomLevel, this.zoomLevel * 0.55);
            this.worldContainer.rotation = Math.PI / 4;
        } else {
            this.worldContainer.scale.set(this.zoomLevel, this.zoomLevel);
            this.worldContainer.rotation = 0;
        }
    }

    private setupEvents(): void {
        window.addEventListener('wheel', (e) => {
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            this.zoomLevel = Math.min(Math.max(this.zoomLevel * zoomFactor, 0.4), 2.5);

            const isIso = this.worldContainer.rotation !== 0;
            this.worldContainer.scale.set(
                this.zoomLevel,
                isIso ? this.zoomLevel * 0.55 : this.zoomLevel
            );
        });

        window.addEventListener('contextmenu', (e) => e.preventDefault());

        window.addEventListener('pointerdown', (e) => {
            if (e.button === 1 || e.button === 2 || e.shiftKey) {
                this.isDragging = true;
                this.lastPos = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('pointermove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.lastPos.x;
            const dy = e.clientY - this.lastPos.y;
            this.worldContainer.x += dx;
            this.worldContainer.y += dy;
            this.lastPos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('pointerup', () => {
            this.isDragging = false;
        });
    }
}