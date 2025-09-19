/**
 * Theme Manager
 * Handles theme switching and theme-related functionality
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'matrix';
        this.themes = {
            matrix: {
                name: 'Matrix',
                description: 'The classic green digital rain experience'
            },
            cyberpunk: {
                name: 'Cyberpunk',
                description: 'Pink and purple futuristic aesthetics'
            },
            neon: {
                name: 'Neon',
                description: 'Bright cyan and magenta neon lights'
            },
            classic: {
                name: 'Classic',
                description: 'Clean, professional appearance'
            }
        };
        
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        // Load saved theme or use default
        this.currentTheme = localStorage.getItem('matrixSudokuTheme') || 'matrix';
        this.applyTheme(this.currentTheme);
        
        // Setup theme selector event listeners
        this.setupThemeSelector();
        
        console.log(`Theme Manager initialized with ${this.currentTheme} theme`);
    }

    /**
     * Setup theme selector buttons
     */
    setupThemeSelector() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                this.switchTheme(theme);
            });
        });

        // Update active button
        this.updateActiveButton();
    }

    /**
     * Switch to a new theme
     * @param {string} themeName - Name of the theme to switch to
     */
    switchTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme '${themeName}' not found`);
            return;
        }

        const oldTheme = this.currentTheme;
        this.currentTheme = themeName;
        
        this.applyTheme(themeName);
        this.saveTheme(themeName);
        this.updateActiveButton();
        
        // Emit theme change event
        this.emitThemeChangeEvent(oldTheme, themeName);
        
        console.log(`Theme switched from ${oldTheme} to ${themeName}`);
    }

    /**
     * Apply theme to the document
     * @param {string} themeName - Name of the theme to apply
     */
    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
        
        // Special handling for classic theme
        if (themeName === 'classic') {
            this.handleClassicTheme();
        } else {
            this.handleDarkTheme();
        }
    }

    /**
     * Handle classic theme specific adjustments
     */
    handleClassicTheme() {
        // Hide matrix background for classic theme
        const matrixBg = document.getElementById('matrix-background');
        if (matrixBg) {
            matrixBg.style.display = 'none';
        }
        
        // Update favicon for light theme (if we had one)
        // this.updateFavicon('light');
    }

    /**
     * Handle dark themes (matrix, cyberpunk, neon)
     */
    handleDarkTheme() {
        // Show matrix background for dark themes
        const matrixBg = document.getElementById('matrix-background');
        if (matrixBg) {
            matrixBg.style.display = 'block';
        }
        
        // Update favicon for dark theme (if we had one)
        // this.updateFavicon('dark');
    }

    /**
     * Save theme preference to localStorage
     * @param {string} themeName - Name of the theme to save
     */
    saveTheme(themeName) {
        localStorage.setItem('matrixSudokuTheme', themeName);
    }

    /**
     * Update active button in theme selector
     */
    updateActiveButton() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-theme') === this.currentTheme) {
                button.classList.add('active');
            }
        });
    }

    /**
     * Emit theme change event for other components to listen to
     * @param {string} oldTheme - Previous theme name
     * @param {string} newTheme - New theme name
     */
    emitThemeChangeEvent(oldTheme, newTheme) {
        const event = new CustomEvent('themeChange', {
            detail: {
                oldTheme,
                newTheme,
                themeInfo: this.themes[newTheme]
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get current theme information
     * @returns {Object} Current theme information
     */
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            info: this.themes[this.currentTheme]
        };
    }

    /**
     * Get all available themes
     * @returns {Object} All available themes
     */
    getAvailableThemes() {
        return this.themes;
    }

    /**
     * Add a new theme (for future extensibility)
     * @param {string} name - Theme name
     * @param {Object} config - Theme configuration
     */
    addTheme(name, config) {
        this.themes[name] = config;
        console.log(`New theme '${name}' added`);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}