/**
 * Matrix Sudoku - Main Application Entry Point
 * Initializes and manages the Matrix-themed Sudoku game
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 * @license GPL-3.0
 */

/**
 * Main application class
 */
class MatrixSudokuApp {
    /**
     * Initialize the application
     */
    constructor() {
        this.gameController = null;
        this.themeManager = null;
        this.achievementManager = null;
        this.dailyChallengeManager = null;
        this.socialSharingManager = null;
        this.multiplayerManager = null;
        this.isInitialized = false;
        this.version = '1.0.0';
        
        // Performance monitoring
        this.performanceMetrics = {
            loadStartTime: performance.now(),
            initStartTime: null,
            initEndTime: null
        };
        
        console.log(`Matrix Sudoku v${this.version} - Loading...`);
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.performanceMetrics.initStartTime = performance.now();
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Initialize game controller
            this.gameController = new GameController();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Mark as initialized
            this.isInitialized = true;
            this.performanceMetrics.initEndTime = performance.now();
            
            // Log performance metrics
            this.logPerformanceMetrics();
            
            console.log('Matrix Sudoku - Initialization complete');
            
            // Optional: Show welcome message for first-time users
            this.showWelcomeIfFirstTime();
            
        } catch (error) {
            console.error('Failed to initialize Matrix Sudoku:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Wait for DOM to be ready
     * @returns {Promise} Promise that resolves when DOM is ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize core systems
     */
    async initializeSystems() {
        // Check browser compatibility
        this.checkBrowserCompatibility();
        
        // Setup viewport for mobile devices
        this.setupViewport();
        
        // Initialize service worker for offline support (if available)
        await this.initializeServiceWorker();
        
        // Setup theme system
        this.setupTheme();
        
        // Initialize achievement system
        this.initializeAchievements();
        
        // Initialize daily challenges
        this.initializeDailyChallenges();
        
        // Initialize social sharing
        this.initializeSocialSharing();
        
        // Initialize multiplayer
        this.initializeMultiplayer();
        
        // Initialize audio system
        this.initializeAudio();
    }

    /**
     * Check browser compatibility
     */
    checkBrowserCompatibility() {
        const requiredFeatures = [
            'localStorage',
            'addEventListener',
            'querySelector',
            'requestAnimationFrame',
            'Canvas'
        ];

        const missingFeatures = requiredFeatures.filter(feature => {
            switch (feature) {
                case 'localStorage':
                    return !window.localStorage;
                case 'addEventListener':
                    return !document.addEventListener;
                case 'querySelector':
                    return !document.querySelector;
                case 'requestAnimationFrame':
                    return !window.requestAnimationFrame;
                case 'Canvas':
                    return !window.HTMLCanvasElement;
                default:
                    return false;
            }
        });

        if (missingFeatures.length > 0) {
            throw new Error(`Browser missing required features: ${missingFeatures.join(', ')}`);
        }

        console.log('Browser compatibility check passed');
    }

    /**
     * Setup viewport for mobile devices
     */
    setupViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.head.appendChild(meta);
        }
    }

    /**
     * Initialize service worker for offline support
     */
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                // Register service worker (we'll create this file later)
                // const registration = await navigator.serviceWorker.register('/sw.js');
                // console.log('Service Worker registered:', registration);
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Setup theme system
     */
    setupTheme() {
        // Initialize theme manager
        this.themeManager = new ThemeManager();
        
        // Set CSS custom properties for theme
        const root = document.documentElement;
        
        // Add theme class to body (will be managed by ThemeManager)
        document.body.classList.add('matrix-theme');
        
        // Setup theme toggle functionality (now handled by ThemeManager)
        this.currentTheme = this.themeManager.getCurrentTheme().name;
    }

    /**
     * Initialize audio system
     */
    initializeAudio() {
        // Create audio elements if they don't exist
        const audioElements = [
            { id: 'click-sound', src: '../assets/sounds/click' },
            { id: 'success-sound', src: '../assets/sounds/success' },
            { id: 'error-sound', src: '../assets/sounds/error' }
        ];

        audioElements.forEach(({ id, src }) => {
            if (!document.getElementById(id)) {
                const audio = document.createElement('audio');
                audio.id = id;
                audio.preload = 'auto';
                
                // Add multiple format support
                const formats = ['mp3', 'ogg', 'wav'];
                formats.forEach(format => {
                    const source = document.createElement('source');
                    source.src = `${src}.${format}`;
                    source.type = `audio/${format}`;
                    audio.appendChild(source);
                });
                
                document.body.appendChild(audio);
            }
        });
    }

    /**
     * Initialize achievement system
     */
    initializeAchievements() {
        this.achievementManager = new AchievementManager();
    }

    /**
     * Initialize daily challenges
     */
    initializeDailyChallenges() {
        this.dailyChallengeManager = new DailyChallengeManager();
    }

    /**
     * Initialize social sharing
     */
    initializeSocialSharing() {
        this.socialSharingManager = new SocialSharingManager();
    }

    /**
     * Initialize multiplayer
     */
    initializeMultiplayer() {
        this.multiplayerManager = new MultiplayerManager();
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }

        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn(`Low frame rate detected: ${fps} FPS`);
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorFrameRate);
        };
        
        requestAnimationFrame(monitorFrameRate);
    }

    /**
     * Log performance metrics
     */
    logPerformanceMetrics() {
        const totalLoadTime = this.performanceMetrics.initEndTime - this.performanceMetrics.loadStartTime;
        const initTime = this.performanceMetrics.initEndTime - this.performanceMetrics.initStartTime;
        
        console.log('Performance Metrics:');
        console.log(`- Total load time: ${totalLoadTime.toFixed(2)}ms`);
        console.log(`- Initialization time: ${initTime.toFixed(2)}ms`);
        
        // Performance API metrics
        if (performance.getEntriesByType) {
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                const nav = navigationEntries[0];
                console.log(`- DOM ready: ${(nav.domContentLoadedEventEnd - nav.fetchStart).toFixed(2)}ms`);
                console.log(`- Page load: ${(nav.loadEventEnd - nav.fetchStart).toFixed(2)}ms`);
            }
        }
    }

    /**
     * Show welcome message for first-time users
     */
    showWelcomeIfFirstTime() {
        const hasVisited = localStorage.getItem('matrixSudokuVisited');
        
        if (!hasVisited) {
            setTimeout(() => {
                if (this.gameController && this.gameController.ui) {
                    this.gameController.ui.showModal(
                        'Welcome to Matrix Sudoku!',
                        'Experience the classic Sudoku puzzle with a Matrix twist. Use the number buttons or keyboard to fill the grid. Get hints when stuck, and enjoy the amazing Matrix rain effect in the background!'
                    );
                }
                localStorage.setItem('matrixSudokuVisited', 'true');
            }, 2000);
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Initialization error
     */
    handleInitializationError(error) {
        // Create fallback error UI
        const errorContainer = document.createElement('div');
        errorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #000000, #1a1a1a);
            color: #00ff41;
            font-family: 'Orbitron', monospace;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            text-align: center;
            padding: 20px;
        `;
        
        errorContainer.innerHTML = `
            <h1 style="font-size: 2rem; margin-bottom: 20px; text-shadow: 0 0 10px #00ff41;">
                SYSTEM ERROR
            </h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.8;">
                Failed to initialize Matrix Sudoku
            </p>
            <p style="font-size: 1rem; margin-bottom: 30px; color: #ff4444;">
                ${error.message}
            </p>
            <button onclick="location.reload()" style="
                background: linear-gradient(145deg, #003d10, #00ff41);
                border: 2px solid #00ff41;
                color: #000000;
                padding: 15px 30px;
                font-size: 1rem;
                font-family: 'Orbitron', monospace;
                font-weight: 700;
                border-radius: 8px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 0 20px #00ff41'" 
               onmouseout="this.style.boxShadow='none'">
                RELOAD SYSTEM
            </button>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(errorContainer);
    }

    /**
     * Handle runtime errors
     * @param {Error} error - Runtime error
     */
    handleError(error) {
        // Log error details
        console.error('Runtime error in Matrix Sudoku:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        // Show user-friendly error message
        if (this.gameController && this.gameController.ui) {
            this.gameController.ui.showModal(
                'Unexpected Error',
                'An unexpected error occurred. The game will continue to function, but you may want to refresh the page if you experience issues.'
            );
        }
    }

    /**
     * Get application info
     * @returns {Object} Application information
     */
    getAppInfo() {
        return {
            name: 'Matrix Sudoku',
            version: this.version,
            initialized: this.isInitialized,
            buildTime: this.performanceMetrics.initEndTime - this.performanceMetrics.initStartTime,
            theme: this.currentTheme,
            gameStats: this.gameController ? this.gameController.getStats() : null
        };
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        if (this.gameController) {
            this.gameController.destroy();
        }
        
        // Remove global event listeners
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleError);
        
        console.log('Matrix Sudoku application destroyed');
    }
}

// Global app instance
let matrixSudokuApp = null;

// Initialize app when script loads
(() => {
    try {
        matrixSudokuApp = new MatrixSudokuApp();
        
        // Make app globally accessible for debugging
        window.MatrixSudoku = {
            app: matrixSudokuApp,
            version: matrixSudokuApp.version,
            getInfo: () => matrixSudokuApp.getAppInfo(),
            restart: () => {
                matrixSudokuApp.destroy();
                location.reload();
            }
        };
        
    } catch (error) {
        console.error('Failed to create Matrix Sudoku app:', error);
        
        // Fallback initialization
        document.addEventListener('DOMContentLoaded', () => {
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                text-align: center;
                z-index: 10000;
            `;
            errorMsg.innerHTML = `
                <h3>Initialization Failed</h3>
                <p>Matrix Sudoku failed to start properly.</p>
                <button onclick="location.reload()" style="
                    margin-top: 10px;
                    padding: 10px 20px;
                    background: white;
                    color: black;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Reload Page</button>
            `;
            document.body.appendChild(errorMsg);
        });
    }
})();