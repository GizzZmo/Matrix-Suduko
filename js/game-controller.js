/**
 * Game Controller
 * Main controller that coordinates the game engine and UI
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class GameController {
    /**
     * Initialize the game controller
     */
    constructor() {
        this.engine = new SudokuEngine();
        this.ui = null;
        this.settings = {
            soundEnabled: true,
            animationsEnabled: true,
            difficulty: 'medium',
            theme: 'matrix'
        };
        
        this.loadSettings();
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    /**
     * Start the game
     */
    start() {
        try {
            // Initialize UI
            this.ui = new SudokuUI(this.engine);
            
            // Setup additional event listeners
            this.setupGlobalEventListeners();
            
            // Start first game
            this.ui.startNewGame(this.settings.difficulty);
            
            // Setup auto-save
            this.setupAutoSave();
            
            console.log('Matrix Sudoku game initialized successfully');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showErrorMessage('Failed to initialize the game. Please refresh the page.');
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change (pause/resume)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle beforeunload (save game state)
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyPress(e);
        });

        // Handle touch gestures for mobile
        this.setupTouchGestures();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust matrix background
        if (window.matrixBackground) {
            window.matrixBackground.resizeCanvas();
        }

        // Adjust UI layout if needed
        this.adjustUIForScreenSize();
    }

    /**
     * Adjust UI layout for different screen sizes
     */
    adjustUIForScreenSize() {
        const screenWidth = window.innerWidth;
        const gameMain = document.querySelector('.game-main');
        
        if (screenWidth < 768) {
            // Mobile layout adjustments
            gameMain.style.flexDirection = 'column';
            gameMain.style.padding = '15px';
        } else if (screenWidth < 1024) {
            // Tablet layout adjustments
            gameMain.style.flexDirection = 'column';
            gameMain.style.padding = '20px';
        } else {
            // Desktop layout
            gameMain.style.flexDirection = 'row';
            gameMain.style.padding = '40px 20px';
        }
    }

    /**
     * Handle visibility change (when tab becomes active/inactive)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause timers and animations
            this.pauseGame();
        } else {
            // Page is visible - resume timers and animations
            this.resumeGame();
        }
    }

    /**
     * Pause the game
     */
    pauseGame() {
        if (this.ui && this.ui.timer) {
            // Timer will continue running but we could implement pause logic here
        }

        // Pause matrix background animation
        if (window.matrixBackground) {
            window.matrixBackground.stop();
        }
    }

    /**
     * Resume the game
     */
    resumeGame() {
        // Resume matrix background animation
        if (window.matrixBackground) {
            window.matrixBackground.start();
        }
    }

    /**
     * Handle global keyboard shortcuts
     * @param {Event} e - Keyboard event
     */
    handleGlobalKeyPress(e) {
        // Don't interfere with normal game input
        if (this.ui && this.ui.selectedCell) {
            return;
        }

        const key = e.key.toLowerCase();
        const ctrlKey = e.ctrlKey || e.metaKey;

        if (ctrlKey) {
            switch (key) {
                case 'n':
                    e.preventDefault();
                    this.ui.startNewGame();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveGameState();
                    break;
                case 'h':
                    e.preventDefault();
                    this.ui.showHint();
                    break;
            }
        } else {
            switch (key) {
                case 'escape':
                    if (this.ui.selectedCell) {
                        this.ui.clearHighlights();
                        this.ui.selectedCell = null;
                    }
                    break;
                case 'f1':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        }
    }

    /**
     * Setup touch gestures for mobile devices
     */
    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = touchEndTime - touchStartTime;

            // Detect swipe gestures
            if (deltaTime < 500 && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - next difficulty
                    this.cycleDifficulty(1);
                } else {
                    // Swipe left - previous difficulty
                    this.cycleDifficulty(-1);
                }
            }
        });
    }

    /**
     * Cycle through difficulty levels
     * @param {number} direction - 1 for next, -1 for previous
     */
    cycleDifficulty(direction) {
        const difficulties = ['easy', 'medium', 'hard', 'expert'];
        const currentIndex = difficulties.indexOf(this.settings.difficulty);
        let newIndex = currentIndex + direction;

        if (newIndex < 0) newIndex = difficulties.length - 1;
        if (newIndex >= difficulties.length) newIndex = 0;

        const newDifficulty = difficulties[newIndex];
        
        // Update active button
        const currentButton = document.querySelector('.difficulty-btn.active');
        const newButton = document.querySelector(`[data-difficulty="${newDifficulty}"]`);
        
        if (currentButton) currentButton.classList.remove('active');
        if (newButton) newButton.classList.add('active');

        this.settings.difficulty = newDifficulty;
        this.saveSettings();
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveGameState();
        }, 30000);
    }

    /**
     * Save current game state to localStorage
     */
    saveGameState() {
        if (!this.ui || !this.engine) return;

        const gameState = {
            grid: this.engine.grid,
            solution: this.engine.solution,
            initialGrid: this.engine.initialGrid,
            difficulty: this.engine.difficulty,
            selectedCell: this.ui.selectedCell,
            errors: this.ui.errors,
            hintsUsed: this.ui.hintsUsed,
            startTime: this.ui.startTime,
            gameActive: this.ui.gameActive,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('matrixSudokuGameState', JSON.stringify(gameState));
        } catch (error) {
            console.warn('Failed to save game state:', error);
        }
    }

    /**
     * Load game state from localStorage
     * @returns {Object|null} Saved game state or null
     */
    loadGameState() {
        try {
            const saved = localStorage.getItem('matrixSudokuGameState');
            if (saved) {
                const gameState = JSON.parse(saved);
                
                // Check if save is not too old (1 day)
                if (Date.now() - gameState.timestamp < 24 * 60 * 60 * 1000) {
                    return gameState;
                }
            }
        } catch (error) {
            console.warn('Failed to load game state:', error);
        }
        
        return null;
    }

    /**
     * Restore game from saved state
     * @param {Object} gameState - Saved game state
     */
    restoreGameState(gameState) {
        if (!this.ui || !this.engine) return;

        try {
            // Restore engine state
            this.engine.grid = gameState.grid;
            this.engine.solution = gameState.solution;
            this.engine.initialGrid = gameState.initialGrid;
            this.engine.difficulty = gameState.difficulty;

            // Restore UI state
            this.ui.errors = gameState.errors || 0;
            this.ui.hintsUsed = gameState.hintsUsed || 0;
            this.ui.startTime = gameState.startTime;
            this.ui.gameActive = gameState.gameActive;

            // Update display
            this.ui.displayGrid(gameState.grid);
            this.ui.updateStats();
            
            if (gameState.gameActive && gameState.startTime) {
                this.ui.startTimer();
            }

            // Update difficulty display
            const difficultyBtn = document.querySelector(`[data-difficulty="${gameState.difficulty}"]`);
            if (difficultyBtn) {
                document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
                difficultyBtn.classList.add('active');
            }

            console.log('Game state restored successfully');
        } catch (error) {
            console.error('Failed to restore game state:', error);
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('matrixSudokuSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.settings = { ...this.settings, ...settings };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('matrixSudokuSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    /**
     * Show help dialog
     */
    showHelp() {
        const helpContent = `
            <h3>How to Play Matrix Sudoku</h3>
            <p><strong>Objective:</strong> Fill the 9×9 grid so that each column, row, and 3×3 box contains the digits 1-9.</p>
            
            <h4>Controls:</h4>
            <ul>
                <li><strong>Click/Touch:</strong> Select a cell</li>
                <li><strong>Right-click/Long-press:</strong> Erase a cell</li>
                <li><strong>Number buttons:</strong> Enter numbers 1-9</li>
                <li><strong>Keyboard:</strong> Use 1-9 keys and arrow keys</li>
            </ul>
            
            <h4>Keyboard Shortcuts:</h4>
            <ul>
                <li><strong>Ctrl+N:</strong> New game</li>
                <li><strong>Ctrl+H:</strong> Get hint</li>
                <li><strong>Ctrl+S:</strong> Save game</li>
                <li><strong>Escape:</strong> Deselect cell</li>
                <li><strong>F1:</strong> Show this help</li>
            </ul>
            
            <h4>Features:</h4>
            <ul>
                <li><strong>Four difficulty levels:</strong> Easy, Medium, Hard, Expert</li>
                <li><strong>Hints:</strong> Get help when stuck</li>
                <li><strong>Auto-save:</strong> Your progress is automatically saved</li>
                <li><strong>Error checking:</strong> Invalid moves are highlighted</li>
            </ul>
        `;

        this.ui.showModal('Help - Matrix Sudoku', helpContent);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        // Create simple error display if UI is not available
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Get game statistics
     * @returns {Object} Game statistics
     */
    getStats() {
        return {
            currentDifficulty: this.settings.difficulty,
            errors: this.ui ? this.ui.errors : 0,
            hintsUsed: this.ui ? this.ui.hintsUsed : 0,
            timeElapsed: this.ui ? this.ui.getTimeElapsed() : '00:00',
            gameActive: this.ui ? this.ui.gameActive : false,
            cellsCompleted: this.getCellsCompleted()
        };
    }

    /**
     * Get number of completed cells
     * @returns {number} Number of cells filled
     */
    getCellsCompleted() {
        if (!this.engine) return 0;
        
        let completed = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.engine.grid[row][col] !== 0) {
                    completed++;
                }
            }
        }
        return completed;
    }

    /**
     * Reset game and settings
     */
    resetGame() {
        // Clear saved data
        localStorage.removeItem('matrixSudokuGameState');
        localStorage.removeItem('matrixSudokuSettings');
        
        // Reset settings to defaults
        this.settings = {
            soundEnabled: true,
            animationsEnabled: true,
            difficulty: 'medium',
            theme: 'matrix'
        };
        
        // Start new game
        if (this.ui) {
            this.ui.startNewGame();
        }
    }

    /**
     * Destroy the game and cleanup
     */
    destroy() {
        // Stop timers
        if (this.ui && this.ui.timer) {
            this.ui.stopTimer();
        }

        // Stop matrix background
        if (window.matrixBackground) {
            window.matrixBackground.destroy();
        }

        // Save final state
        this.saveGameState();

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.saveGameState);

        console.log('Matrix Sudoku game destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
}