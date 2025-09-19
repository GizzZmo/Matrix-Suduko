/**
 * Matrix Background Animation
 * Creates the iconic falling digital rain effect from The Matrix
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class MatrixBackground {
    /**
     * Initialize the Matrix background animation
     */
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
    }

    /**
     * Initialize the canvas and start animation
     */
    init() {
        this.resizeCanvas();
        this.createDrops();
        this.animate();
    }

    /**
     * Setup event listeners for responsive design
     */
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createDrops();
        });
    }

    /**
     * Resize canvas to match window dimensions
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
    }

    /**
     * Create drop positions for each column
     */
    createDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.3
            };
        }
    }

    /**
     * Get random character from the character set
     * @returns {string} Random character
     */
    getRandomCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    /**
     * Draw the matrix effect
     */
    draw() {
        // Create trailing effect with semi-transparent black
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set font properties
        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.textAlign = 'center';

        // Draw characters for each column
        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            const character = this.getRandomCharacter();
            const x = i * this.fontSize + this.fontSize / 2;

            // Create gradient effect for each character
            const gradient = this.ctx.createLinearGradient(x, drop.y - 20, x, drop.y + 20);
            gradient.addColorStop(0, `rgba(0, 255, 65, 0)`);
            gradient.addColorStop(0.5, `rgba(0, 255, 65, ${drop.opacity})`);
            gradient.addColorStop(1, `rgba(0, 255, 65, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillText(character, x, drop.y);

            // Add bright head character
            if (Math.random() > 0.98) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity + 0.3})`;
                this.ctx.fillText(character, x, drop.y);
            }

            // Move drop down
            drop.y += drop.speed;

            // Reset drop when it reaches bottom
            if (drop.y > this.canvas.height) {
                drop.y = -this.fontSize;
                drop.speed = Math.random() * 3 + 1;
                drop.opacity = Math.random() * 0.5 + 0.3;
            }

            // Randomly change some characters
            if (Math.random() > 0.975) {
                drop.speed = Math.random() * 3 + 1;
            }
        }
    }

    /**
     * Animation loop
     */
    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Start the animation
     */
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }

    /**
     * Stop the animation
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Destroy the animation and cleanup
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resizeCanvas);
    }

    /**
     * Update animation speed (for performance adjustment)
     * @param {number} speedMultiplier - Speed multiplier (0.5 = half speed, 2 = double speed)
     */
    setSpeed(speedMultiplier = 1) {
        this.drops.forEach(drop => {
            drop.speed *= speedMultiplier;
        });
    }

    /**
     * Update opacity for performance or visual effect
     * @param {number} opacity - Opacity value (0-1)
     */
    setOpacity(opacity = 0.5) {
        this.drops.forEach(drop => {
            drop.opacity = Math.random() * opacity + 0.1;
        });
    }
}

// Initialize Matrix background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.matrixBackground = new MatrixBackground();
    
    // Performance optimization: reduce animation on mobile devices
    if (window.innerWidth < 768) {
        window.matrixBackground.setSpeed(0.7);
        window.matrixBackground.setOpacity(0.3);
    }
    
    // Pause animation when window loses focus (battery saving)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.matrixBackground.stop();
        } else {
            window.matrixBackground.start();
        }
    });
});