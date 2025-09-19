/**
 * Daily Challenge System
 * Manages daily puzzle challenges and progress tracking
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class DailyChallengeManager {
    constructor() {
        this.currentChallenge = null;
        this.challengeHistory = this.loadChallengeHistory();
        this.init();
    }

    /**
     * Initialize daily challenge system
     */
    init() {
        this.checkDailyChallenge();
        this.setupEventListeners();
        console.log('Daily Challenge Manager initialized');
    }

    /**
     * Load challenge history from localStorage
     */
    loadChallengeHistory() {
        const saved = localStorage.getItem('matrixSudokuDailyChallenges');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            completedChallenges: [],
            streak: 0,
            longestStreak: 0,
            totalCompleted: 0
        };
    }

    /**
     * Save challenge history to localStorage
     */
    saveChallengeHistory() {
        localStorage.setItem('matrixSudokuDailyChallenges', JSON.stringify(this.challengeHistory));
    }

    /**
     * Check if there's a new daily challenge available
     */
    checkDailyChallenge() {
        const today = this.getTodayString();
        
        // Check if we already have today's challenge
        if (!this.currentChallenge || this.currentChallenge.date !== today) {
            this.generateDailyChallenge(today);
        }
        
        // Update UI if challenge panel exists
        this.updateDailyChallengeUI();
    }

    /**
     * Generate a daily challenge for the given date
     * @param {string} date - Date string (YYYY-MM-DD)
     */
    generateDailyChallenge(date) {
        // Use date as seed for consistent daily puzzles
        const seed = this.dateToSeed(date);
        
        // Generate puzzle based on the seed
        const difficulty = this.getDailyDifficulty(date);
        
        this.currentChallenge = {
            date: date,
            difficulty: difficulty,
            seed: seed,
            bonus: this.calculateBonus(difficulty),
            theme: this.getDailyTheme(date),
            completed: this.challengeHistory.completedChallenges.includes(date)
        };
        
        console.log(`Daily challenge generated for ${date}: ${difficulty} difficulty`);
    }

    /**
     * Convert date to a numerical seed
     * @param {string} date - Date string
     * @returns {number} Seed value
     */
    dateToSeed(date) {
        return date.split('-').reduce((acc, part) => acc + parseInt(part), 0) * 1000;
    }

    /**
     * Get difficulty for daily challenge based on day of week
     * @param {string} date - Date string
     * @returns {string} Difficulty level
     */
    getDailyDifficulty(date) {
        const dayOfWeek = new Date(date).getDay();
        const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'expert'];
        return difficulties[dayOfWeek];
    }

    /**
     * Get theme for daily challenge
     * @param {string} date - Date string
     * @returns {string} Theme name
     */
    getDailyTheme(date) {
        const themes = ['matrix', 'cyberpunk', 'neon', 'classic'];
        const dayOfYear = Math.floor((new Date(date) - new Date(date.substring(0, 4) + '-01-01')) / 86400000);
        return themes[dayOfYear % themes.length];
    }

    /**
     * Calculate bonus points for difficulty
     * @param {string} difficulty - Difficulty level
     * @returns {number} Bonus points
     */
    calculateBonus(difficulty) {
        const bonuses = {
            easy: 10,
            medium: 20,
            hard: 35,
            expert: 50
        };
        return bonuses[difficulty] || 10;
    }

    /**
     * Get today's date string
     * @returns {string} Date in YYYY-MM-DD format
     */
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for daily challenge button clicks
        document.addEventListener('click', (event) => {
            if (event.target.id === 'daily-challenge-btn') {
                this.startDailyChallenge();
            }
        });

        // Listen for game completion in daily challenge mode
        document.addEventListener('gameCompleted', (event) => {
            if (event.detail.isDailyChallenge) {
                this.completeDailyChallenge(event.detail);
            }
        });
    }

    /**
     * Start today's daily challenge
     */
    startDailyChallenge() {
        if (!this.currentChallenge) {
            console.warn('No daily challenge available');
            return;
        }

        if (this.currentChallenge.completed) {
            this.showAlreadyCompletedMessage();
            return;
        }

        // Set the recommended theme for the challenge
        if (window.app && window.app.themeManager) {
            window.app.themeManager.switchTheme(this.currentChallenge.theme);
        }

        // Emit event to start the challenge
        const event = new CustomEvent('startDailyChallenge', {
            detail: {
                difficulty: this.currentChallenge.difficulty,
                seed: this.currentChallenge.seed,
                bonus: this.currentChallenge.bonus,
                theme: this.currentChallenge.theme
            }
        });
        
        document.dispatchEvent(event);
        
        console.log(`Starting daily challenge: ${this.currentChallenge.difficulty}`);
    }

    /**
     * Handle daily challenge completion
     * @param {Object} gameData - Game completion data
     */
    completeDailyChallenge(gameData) {
        const today = this.getTodayString();
        
        if (!this.challengeHistory.completedChallenges.includes(today)) {
            this.challengeHistory.completedChallenges.push(today);
            this.challengeHistory.totalCompleted++;
            
            // Update streak
            this.updateStreak(today);
            
            // Mark current challenge as completed
            this.currentChallenge.completed = true;
            
            // Save progress
            this.saveChallengeHistory();
            
            // Show completion message with bonus
            this.showChallengeCompletionMessage(gameData);
            
            // Update UI
            this.updateDailyChallengeUI();
            
            console.log('Daily challenge completed!');
        }
    }

    /**
     * Update completion streak
     * @param {string} completionDate - Date of completion
     */
    updateStreak(completionDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        if (this.challengeHistory.completedChallenges.includes(yesterdayString)) {
            this.challengeHistory.streak++;
        } else {
            this.challengeHistory.streak = 1;
        }
        
        this.challengeHistory.longestStreak = Math.max(
            this.challengeHistory.longestStreak,
            this.challengeHistory.streak
        );
    }

    /**
     * Show already completed message
     */
    showAlreadyCompletedMessage() {
        this.showMessage(
            'Challenge Complete!',
            `You've already completed today's challenge. Come back tomorrow for a new one!`,
            'info'
        );
    }

    /**
     * Show challenge completion message
     * @param {Object} gameData - Game completion data
     */
    showChallengeCompletionMessage(gameData) {
        const bonus = this.currentChallenge.bonus;
        const streak = this.challengeHistory.streak;
        
        this.showMessage(
            'Daily Challenge Complete!',
            `Congratulations! You earned ${bonus} bonus points.${streak > 1 ? ` Current streak: ${streak} days!` : ''}`,
            'success'
        );
    }

    /**
     * Show a message to the user
     * @param {string} title - Message title
     * @param {string} message - Message text
     * @param {string} type - Message type (success, info, warning)
     */
    showMessage(title, message, type = 'info') {
        // Try to use the game's modal system if available
        const modal = document.getElementById('game-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        
        if (modal && modalTitle && modalMessage) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modal.classList.remove('hidden');
        } else {
            // Fallback to alert
            alert(`${title}\n\n${message}`);
        }
    }

    /**
     * Update daily challenge UI elements
     */
    updateDailyChallengeUI() {
        const challengeBtn = document.getElementById('daily-challenge-btn');
        const challengeInfo = document.getElementById('daily-challenge-info');
        
        if (challengeBtn) {
            if (this.currentChallenge.completed) {
                challengeBtn.textContent = 'COMPLETED ✓';
                challengeBtn.disabled = true;
                challengeBtn.classList.add('completed');
            } else {
                challengeBtn.textContent = 'DAILY CHALLENGE';
                challengeBtn.disabled = false;
                challengeBtn.classList.remove('completed');
            }
        }
        
        if (challengeInfo) {
            const difficulty = this.currentChallenge.difficulty.toUpperCase();
            const bonus = this.currentChallenge.bonus;
            challengeInfo.textContent = `${difficulty} • +${bonus} pts`;
        }
    }

    /**
     * Get daily challenge statistics
     * @returns {Object} Challenge statistics
     */
    getStats() {
        return {
            totalCompleted: this.challengeHistory.totalCompleted,
            currentStreak: this.challengeHistory.streak,
            longestStreak: this.challengeHistory.longestStreak,
            todayCompleted: this.currentChallenge ? this.currentChallenge.completed : false,
            todayDifficulty: this.currentChallenge ? this.currentChallenge.difficulty : null
        };
    }

    /**
     * Get current challenge information
     * @returns {Object} Current challenge data
     */
    getCurrentChallenge() {
        return this.currentChallenge;
    }

    /**
     * Check if player is eligible for streak bonus
     * @returns {boolean} Whether streak bonus applies
     */
    hasStreakBonus() {
        return this.challengeHistory.streak >= 3;
    }

    /**
     * Reset challenge history (for testing)
     */
    resetHistory() {
        this.challengeHistory = {
            completedChallenges: [],
            streak: 0,
            longestStreak: 0,
            totalCompleted: 0
        };
        localStorage.removeItem('matrixSudokuDailyChallenges');
        console.log('Daily challenge history reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DailyChallengeManager;
}