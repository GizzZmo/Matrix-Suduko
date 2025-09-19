/**
 * Achievement System
 * Manages player achievements and progress tracking
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class AchievementManager {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.playerProgress = this.loadProgress();
        this.init();
    }

    /**
     * Initialize the achievement system
     */
    init() {
        this.setupEventListeners();
        console.log('Achievement Manager initialized');
    }

    /**
     * Define all available achievements
     */
    initializeAchievements() {
        return {
            first_solve: {
                id: 'first_solve',
                name: 'First Steps',
                description: 'Complete your first Sudoku puzzle',
                icon: '🎯',
                category: 'progression',
                condition: { type: 'games_completed', value: 1 },
                points: 10
            },
            speed_demon: {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Complete a puzzle in under 3 minutes',
                icon: '⚡',
                category: 'time',
                condition: { type: 'best_time', value: 180 },
                points: 25
            },
            perfectionist: {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Complete a puzzle without any errors',
                icon: '💎',
                category: 'accuracy',
                condition: { type: 'zero_errors', value: 1 },
                points: 20
            },
            marathon: {
                id: 'marathon',
                name: 'Marathon Player',
                description: 'Complete 10 puzzles',
                icon: '🏃',
                category: 'progression',
                condition: { type: 'games_completed', value: 10 },
                points: 30
            },
            master: {
                id: 'master',
                name: 'Sudoku Master',
                description: 'Complete 50 puzzles',
                icon: '👑',
                category: 'progression',
                condition: { type: 'games_completed', value: 50 },
                points: 100
            },
            expert_solver: {
                id: 'expert_solver',
                name: 'Expert Solver',
                description: 'Complete an Expert difficulty puzzle',
                icon: '🧠',
                category: 'difficulty',
                condition: { type: 'difficulty_completed', value: 'expert' },
                points: 50
            },
            streak_master: {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Complete 5 puzzles in a row without errors',
                icon: '🔥',
                category: 'streak',
                condition: { type: 'perfect_streak', value: 5 },
                points: 40
            },
            hint_free: {
                id: 'hint_free',
                name: 'Hint-Free',
                description: 'Complete a puzzle without using hints',
                icon: '🚫',
                category: 'independence',
                condition: { type: 'no_hints_used', value: 1 },
                points: 30
            },
            daily_challenger: {
                id: 'daily_challenger',
                name: 'Daily Challenger',
                description: 'Complete 7 daily challenges',
                icon: '📅',
                category: 'daily',
                condition: { type: 'daily_challenges_completed', value: 7 },
                points: 35
            },
            theme_explorer: {
                id: 'theme_explorer',
                name: 'Theme Explorer',
                description: 'Try all available themes',
                icon: '🎨',
                category: 'exploration',
                condition: { type: 'themes_used', value: 4 },
                points: 15
            }
        };
    }

    /**
     * Load player progress from localStorage
     */
    loadProgress() {
        const saved = localStorage.getItem('matrixSudokuAchievements');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            games_completed: 0,
            best_time: Infinity,
            total_errors: 0,
            perfect_games: 0,
            current_streak: 0,
            longest_streak: 0,
            hints_used: 0,
            difficulties_completed: [],
            themes_used: ['matrix'],
            daily_challenges_completed: 0,
            earned_achievements: [],
            total_points: 0
        };
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        localStorage.setItem('matrixSudokuAchievements', JSON.stringify(this.playerProgress));
    }

    /**
     * Setup event listeners for game events
     */
    setupEventListeners() {
        // Listen for game completion events
        document.addEventListener('gameCompleted', (event) => {
            this.handleGameCompleted(event.detail);
        });

        // Listen for theme changes
        document.addEventListener('themeChange', (event) => {
            this.handleThemeChange(event.detail);
        });

        // Listen for hint usage
        document.addEventListener('hintUsed', () => {
            this.handleHintUsed();
        });

        // Listen for error events
        document.addEventListener('gameError', () => {
            this.handleGameError();
        });
    }

    /**
     * Handle game completion
     * @param {Object} gameData - Game completion data
     */
    handleGameCompleted(gameData) {
        const { difficulty, timeInSeconds, errors, hintsUsed } = gameData;
        
        // Update basic stats
        this.playerProgress.games_completed++;
        this.playerProgress.total_errors += errors;
        
        // Update best time
        if (timeInSeconds < this.playerProgress.best_time) {
            this.playerProgress.best_time = timeInSeconds;
        }
        
        // Track difficulties completed
        if (!this.playerProgress.difficulties_completed.includes(difficulty)) {
            this.playerProgress.difficulties_completed.push(difficulty);
        }
        
        // Update streak
        if (errors === 0) {
            this.playerProgress.current_streak++;
            this.playerProgress.perfect_games++;
            this.playerProgress.longest_streak = Math.max(
                this.playerProgress.longest_streak,
                this.playerProgress.current_streak
            );
        } else {
            this.playerProgress.current_streak = 0;
        }
        
        // Check achievements
        this.checkAchievements();
        this.saveProgress();
        
        console.log('Game completed stats updated');
    }

    /**
     * Handle theme change
     * @param {Object} themeData - Theme change data
     */
    handleThemeChange(themeData) {
        const { newTheme } = themeData;
        
        if (!this.playerProgress.themes_used.includes(newTheme)) {
            this.playerProgress.themes_used.push(newTheme);
            this.checkAchievements();
            this.saveProgress();
        }
    }

    /**
     * Handle hint usage
     */
    handleHintUsed() {
        this.playerProgress.hints_used++;
        this.saveProgress();
    }

    /**
     * Handle game error
     */
    handleGameError() {
        // This is handled in game completion, but could be used for real-time tracking
    }

    /**
     * Check for newly earned achievements
     */
    checkAchievements() {
        const newlyEarned = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (!this.playerProgress.earned_achievements.includes(achievement.id)) {
                if (this.isAchievementEarned(achievement)) {
                    this.playerProgress.earned_achievements.push(achievement.id);
                    this.playerProgress.total_points += achievement.points;
                    newlyEarned.push(achievement);
                }
            }
        });
        
        // Display newly earned achievements
        if (newlyEarned.length > 0) {
            this.displayAchievementNotifications(newlyEarned);
        }
    }

    /**
     * Check if a specific achievement is earned
     * @param {Object} achievement - Achievement to check
     * @returns {boolean} Whether the achievement is earned
     */
    isAchievementEarned(achievement) {
        const { type, value } = achievement.condition;
        
        switch (type) {
            case 'games_completed':
                return this.playerProgress.games_completed >= value;
            case 'best_time':
                return this.playerProgress.best_time <= value;
            case 'zero_errors':
                return this.playerProgress.perfect_games >= value;
            case 'difficulty_completed':
                return this.playerProgress.difficulties_completed.includes(value);
            case 'perfect_streak':
                return this.playerProgress.longest_streak >= value;
            case 'no_hints_used':
                return this.playerProgress.perfect_games >= value;
            case 'themes_used':
                return this.playerProgress.themes_used.length >= value;
            case 'daily_challenges_completed':
                return this.playerProgress.daily_challenges_completed >= value;
            default:
                return false;
        }
    }

    /**
     * Display achievement notification
     * @param {Array} achievements - Newly earned achievements
     */
    displayAchievementNotifications(achievements) {
        achievements.forEach(achievement => {
            this.showAchievementPopup(achievement);
        });
    }

    /**
     * Show achievement popup
     * @param {Object} achievement - Achievement to display
     */
    showAchievementPopup(achievement) {
        // Create achievement popup
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <h3>Achievement Unlocked!</h3>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-points">+${achievement.points} points</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Animate in
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => document.body.removeChild(popup), 300);
        }, 4000);
        
        console.log(`Achievement earned: ${achievement.name}`);
    }

    /**
     * Get player's achievement statistics
     * @returns {Object} Achievement statistics
     */
    getStats() {
        const totalAchievements = Object.keys(this.achievements).length;
        const earnedCount = this.playerProgress.earned_achievements.length;
        
        return {
            total: totalAchievements,
            earned: earnedCount,
            percentage: Math.round((earnedCount / totalAchievements) * 100),
            points: this.playerProgress.total_points,
            progress: this.playerProgress
        };
    }

    /**
     * Get all achievements with earned status
     * @returns {Array} All achievements with status
     */
    getAllAchievements() {
        return Object.values(this.achievements).map(achievement => ({
            ...achievement,
            earned: this.playerProgress.earned_achievements.includes(achievement.id)
        }));
    }

    /**
     * Reset all progress (for testing or player choice)
     */
    resetProgress() {
        this.playerProgress = this.loadProgress();
        localStorage.removeItem('matrixSudokuAchievements');
        console.log('Achievement progress reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementManager;
}