import type { Container } from 'pixi.js';

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

    private setupEvents(): void {
        // Zoom con rueda del ratón
        window.addEventListener('wheel', (e) => {
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            this.zoomLevel = Math.min(Math.max(this.zoomLevel * zoomFactor, 0.4), 2.5);
            this.worldContainer.scale.set(this.zoomLevel);
        });

        // Paneo con clic derecho o clic central
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