/**
 * Social Sharing Manager
 * Handles sharing game results and achievements
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class SocialSharingManager {
    constructor() {
        this.gameTitle = 'Matrix Sudoku';
        this.gameUrl = window.location.origin;
        this.init();
    }

    /**
     * Initialize social sharing manager
     */
    init() {
        this.setupEventListeners();
        console.log('Social Sharing Manager initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for game completion to show sharing options
        document.addEventListener('gameCompleted', (event) => {
            setTimeout(() => this.showSharingOptions(event.detail), 1000);
        });

        // Listen for achievement unlocks
        document.addEventListener('achievementUnlocked', (event) => {
            this.handleAchievementSharing(event.detail);
        });

        // Setup sharing button clicks
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('share-btn')) {
                this.handleShareClick(event);
            }
        });
    }

    /**
     * Show sharing options after game completion
     * @param {Object} gameData - Game completion data
     */
    showSharingOptions(gameData) {
        const modal = document.getElementById('game-modal');
        const modalContent = modal?.querySelector('.modal-content');
        
        if (!modalContent) return;

        // Add sharing buttons to the modal if not already present
        if (!modalContent.querySelector('.sharing-section')) {
            const sharingSection = this.createSharingSection(gameData);
            modalContent.insertBefore(sharingSection, modalContent.querySelector('.modal-buttons'));
        }
    }

    /**
     * Create sharing section for game completion
     * @param {Object} gameData - Game completion data
     * @returns {HTMLElement} Sharing section element
     */
    createSharingSection(gameData) {
        const section = document.createElement('div');
        section.className = 'sharing-section';
        
        const shareText = this.generateGameShareText(gameData);
        
        section.innerHTML = `
            <h3>Share Your Achievement!</h3>
            <div class="share-preview">
                <p>${shareText}</p>
            </div>
            <div class="share-buttons">
                <button class="share-btn" data-platform="twitter" data-text="${encodeURIComponent(shareText)}">
                    🐦 Twitter
                </button>
                <button class="share-btn" data-platform="facebook" data-text="${encodeURIComponent(shareText)}">
                    📘 Facebook
                </button>
                <button class="share-btn" data-platform="copy" data-text="${shareText}">
                    📋 Copy Link
                </button>
                <button class="share-btn" data-platform="email" data-text="${encodeURIComponent(shareText)}">
                    📧 Email
                </button>
            </div>
        `;
        
        return section;
    }

    /**
     * Generate share text for game completion
     * @param {Object} gameData - Game completion data
     * @returns {string} Share text
     */
    generateGameShareText(gameData) {
        const { difficulty, timeElapsed, errors } = gameData;
        const difficultyEmoji = this.getDifficultyEmoji(difficulty);
        
        let shareText = `🎯 Just solved a ${difficulty.toUpperCase()} Sudoku puzzle in ${timeElapsed}! ${difficultyEmoji}`;
        
        if (errors === 0) {
            shareText += ' ✨ Perfect game - no errors!';
        }
        
        shareText += ` #MatrixSudoku #PuzzleGame`;
        
        return shareText;
    }

    /**
     * Get emoji for difficulty level
     * @param {string} difficulty - Difficulty level
     * @returns {string} Appropriate emoji
     */
    getDifficultyEmoji(difficulty) {
        const emojis = {
            easy: '🟢',
            medium: '🟡',
            hard: '🟠',
            expert: '🔴'
        };
        return emojis[difficulty] || '⭐';
    }

    /**
     * Handle achievement sharing
     * @param {Object} achievement - Achievement data
     */
    handleAchievementSharing(achievement) {
        // For now, just log - could add achievement-specific sharing later
        console.log('Achievement earned, sharing available:', achievement.name);
    }

    /**
     * Handle share button clicks
     * @param {Event} event - Click event
     */
    handleShareClick(event) {
        const platform = event.target.getAttribute('data-platform');
        const text = event.target.getAttribute('data-text');
        
        switch (platform) {
            case 'twitter':
                this.shareToTwitter(text);
                break;
            case 'facebook':
                this.shareToFacebook(text);
                break;
            case 'copy':
                this.copyToClipboard(text);
                break;
            case 'email':
                this.shareViaEmail(text);
                break;
        }
    }

    /**
     * Share to Twitter
     * @param {string} text - Text to share
     */
    shareToTwitter(text) {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.gameUrl)}`;
        this.openShareWindow(url, 'twitter');
    }

    /**
     * Share to Facebook
     * @param {string} text - Text to share
     */
    shareToFacebook(text) {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.gameUrl)}&quote=${encodeURIComponent(text)}`;
        this.openShareWindow(url, 'facebook');
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    async copyToClipboard(text) {
        try {
            const shareUrl = `${text}\n\nPlay at: ${this.gameUrl}`;
            
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                this.showShareFeedback('Copied to clipboard!');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showShareFeedback('Copied to clipboard!');
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showShareFeedback('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Share via email
     * @param {string} text - Text to share
     */
    shareViaEmail(text) {
        const subject = encodeURIComponent('Check out my Matrix Sudoku achievement!');
        const body = encodeURIComponent(`${text}\n\nPlay Matrix Sudoku at: ${this.gameUrl}`);
        const url = `mailto:?subject=${subject}&body=${body}`;
        
        window.location.href = url;
    }

    /**
     * Open sharing window
     * @param {string} url - URL to open
     * @param {string} platform - Platform name
     */
    openShareWindow(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        const popup = window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
        
        if (popup) {
            popup.focus();
        } else {
            // Popup was blocked, open in new tab
            window.open(url, '_blank');
        }
        
        this.showShareFeedback(`Opening ${platform} share...`);
    }

    /**
     * Show feedback message for sharing actions
     * @param {string} message - Feedback message
     * @param {string} type - Message type (success, error)
     */
    showShareFeedback(message, type = 'success') {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `share-feedback ${type}`;
        feedback.textContent = message;
        
        // Style the feedback
        Object.assign(feedback.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: type === 'error' ? '#ff4444' : '#00ff41',
            color: type === 'error' ? 'white' : 'black',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '10001',
            fontFamily: 'var(--primary-font)',
            fontSize: '0.9rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
        });
        
        document.body.appendChild(feedback);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    /**
     * Generate achievement share text
     * @param {Object} achievement - Achievement data
     * @returns {string} Share text for achievement
     */
    generateAchievementShareText(achievement) {
        return `🏆 Just unlocked "${achievement.name}" in ${this.gameTitle}! ${achievement.icon} #Achievement #MatrixSudoku`;
    }

    /**
     * Share high score or personal best
     * @param {Object} scoreData - Score data
     */
    shareHighScore(scoreData) {
        const { difficulty, time, rank } = scoreData;
        const text = `🎯 New personal best! Solved ${difficulty.toUpperCase()} Sudoku in ${time}${rank ? ` - Rank #${rank}` : ''}! #MatrixSudoku #PersonalBest`;
        
        // Could trigger sharing interface here
        console.log('High score sharing available:', text);
    }

    /**
     * Share daily challenge completion
     * @param {Object} challengeData - Challenge completion data
     */
    shareDailyChallenge(challengeData) {
        const { difficulty, streak } = challengeData;
        let text = `📅 Completed today's ${difficulty.toUpperCase()} daily challenge in Matrix Sudoku!`;
        
        if (streak > 1) {
            text += ` 🔥 ${streak} day streak!`;
        }
        
        text += ' #DailyChallenge #MatrixSudoku';
        
        // Could trigger sharing interface here
        console.log('Daily challenge sharing available:', text);
    }

    /**
     * Check if Web Share API is available
     * @returns {boolean} Whether Web Share API is supported
     */
    isWebShareAPIAvailable() {
        return 'share' in navigator;
    }

    /**
     * Use native Web Share API if available
     * @param {Object} shareData - Data to share
     */
    async nativeShare(shareData) {
        if (this.isWebShareAPIAvailable()) {
            try {
                await navigator.share({
                    title: shareData.title || this.gameTitle,
                    text: shareData.text,
                    url: shareData.url || this.gameUrl
                });
                console.log('Shared successfully via Web Share API');
            } catch (error) {
                console.log('Web Share API cancelled or failed:', error);
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialSharingManager;
}