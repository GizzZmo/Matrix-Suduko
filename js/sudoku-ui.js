/**
 * Sudoku UI Controller
 * Manages the user interface and user interactions
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class SudokuUI {
    /**
     * Initialize the Sudoku UI
     * @param {SudokuEngine} engine - Sudoku engine instance
     */
    constructor(engine) {
        this.engine = engine;
        this.selectedCell = null;
        this.selectedNumber = null;
        this.grid = null;
        this.numberButtons = null;
        this.controlButtons = null;
        this.difficultyButtons = null;
        this.modal = null;
        this.timer = null;
        this.startTime = null;
        this.gameActive = false;
        this.errors = 0;
        this.hintsUsed = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.createGrid();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.grid = document.getElementById('sudoku-grid');
        this.numberButtons = document.querySelectorAll('.number-btn');
        this.controlButtons = {
            newGame: document.getElementById('new-game-btn'),
            hint: document.getElementById('hint-btn'),
            check: document.getElementById('check-btn'),
            solve: document.getElementById('solve-btn')
        };
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.modal = {
            element: document.getElementById('game-modal'),
            title: document.getElementById('modal-title'),
            message: document.getElementById('modal-message'),
            newGame: document.getElementById('modal-new-game'),
            close: document.getElementById('modal-close')
        };
        this.statsElements = {
            timer: document.getElementById('timer'),
            difficulty: document.getElementById('difficulty'),
            errors: document.getElementById('errors')
        };
    }

    /**
     * Setup event listeners for all interactive elements
     */
    setupEventListeners() {
        // Number button listeners
        this.numberButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNumberClick(e));
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleNumberClick(e);
            });
        });

        // Control button listeners
        this.controlButtons.newGame.addEventListener('click', () => this.startNewGame());
        this.controlButtons.hint.addEventListener('click', () => this.showHint());
        this.controlButtons.check.addEventListener('click', () => this.checkSolution());
        this.controlButtons.solve.addEventListener('click', () => this.solvePuzzle());

        // Difficulty button listeners
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDifficultyChange(e));
        });

        // Modal button listeners
        this.modal.newGame.addEventListener('click', () => {
            this.hideModal();
            this.startNewGame();
        });
        this.modal.close.addEventListener('click', () => this.hideModal());

        // Keyboard listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Prevent context menu on right click for better mobile experience
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Create the 9x9 Sudoku grid
     */
    createGrid() {
        this.grid.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add event listeners for cell interaction
                cell.addEventListener('click', (e) => this.handleCellClick(e));
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleCellClick(e);
                });
                
                // Add right-click listener for mobile/touch devices
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellRightClick(e);
                });

                this.grid.appendChild(cell);
            }
        }
    }

    /**
     * Handle cell click events
     * @param {Event} e - Click event
     */
    handleCellClick(e) {
        const cell = e.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.engine.isGivenCell(row, col)) {
            this.playSound('error');
            this.showCellError(cell);
            return;
        }
        
        this.selectCell(row, col);
        this.playSound('click');
    }

    /**
     * Handle cell right-click events (for erasing)
     * @param {Event} e - Right-click event
     */
    handleCellRightClick(e) {
        const cell = e.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.engine.isGivenCell(row, col)) {
            return;
        }
        
        this.selectCell(row, col);
        this.placeNumber(0); // Erase
        this.playSound('click');
    }

    /**
     * Select a cell and highlight related cells
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    selectCell(row, col) {
        // Clear previous selection
        this.clearHighlights();
        
        this.selectedCell = { row, col };
        
        // Highlight selected cell
        const cellIndex = row * 9 + col;
        const cell = this.grid.children[cellIndex];
        cell.classList.add('selected');
        
        // Highlight related cells (row, column, 3x3 box)
        this.highlightRelatedCells(row, col);
    }

    /**
     * Clear all cell highlights
     */
    clearHighlights() {
        const cells = this.grid.querySelectorAll('.sudoku-cell');
        cells.forEach(cell => {
            cell.classList.remove('selected', 'highlight-row', 'highlight-col', 'highlight-box', 'error', 'hint');
        });
    }

    /**
     * Highlight cells related to the selected cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    highlightRelatedCells(row, col) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cellIndex = i * 9 + j;
                const cell = this.grid.children[cellIndex];
                
                // Highlight same row
                if (i === row && j !== col) {
                    cell.classList.add('highlight-row');
                }
                
                // Highlight same column
                if (j === col && i !== row) {
                    cell.classList.add('highlight-col');
                }
                
                // Highlight same 3x3 box
                const boxRow = Math.floor(row / 3);
                const boxCol = Math.floor(col / 3);
                const cellBoxRow = Math.floor(i / 3);
                const cellBoxCol = Math.floor(j / 3);
                
                if (boxRow === cellBoxRow && boxCol === cellBoxCol && (i !== row || j !== col)) {
                    cell.classList.add('highlight-box');
                }
            }
        }
    }

    /**
     * Handle number button clicks
     * @param {Event} e - Click event
     */
    handleNumberClick(e) {
        const button = e.target;
        const number = parseInt(button.dataset.number);
        
        // Update selected number
        this.selectNumber(number);
        
        // Place number if cell is selected
        if (this.selectedCell) {
            this.placeNumber(number);
        }
        
        this.playSound('click');
    }

    /**
     * Select a number button
     * @param {number} number - Number to select (0 for erase)
     */
    selectNumber(number) {
        // Clear previous selection
        this.numberButtons.forEach(btn => btn.classList.remove('selected'));
        
        this.selectedNumber = number;
        
        // Highlight selected button
        const button = document.querySelector(`[data-number="${number}"]`);
        if (button) {
            button.classList.add('selected');
        }
    }

    /**
     * Place a number in the selected cell
     * @param {number} number - Number to place (0 to erase)
     */
    placeNumber(number) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        
        if (this.engine.isGivenCell(row, col)) {
            this.showCellError(this.grid.children[row * 9 + col]);
            return;
        }
        
        // Update engine grid
        this.engine.grid[row][col] = number;
        
        // Update UI
        this.updateCell(row, col, number);
        
        // Validate move
        if (number !== 0) {
            const validation = this.engine.validatePuzzle(this.engine.grid);
            const cellError = validation.errors.find(err => err.row === row && err.col === col);
            
            if (cellError) {
                this.errors++;
                this.updateStats();
                this.showCellError(this.grid.children[row * 9 + col]);
                this.playSound('error');
            } else {
                this.playSound('success');
                
                // Check if puzzle is complete
                if (this.engine.isComplete(this.engine.grid)) {
                    this.gameComplete();
                }
            }
        }
    }

    /**
     * Update a cell's display
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} value - Value to display (0 for empty)
     */
    updateCell(row, col, value) {
        const cellIndex = row * 9 + col;
        const cell = this.grid.children[cellIndex];
        
        cell.textContent = value === 0 ? '' : value.toString();
        
        if (this.engine.isGivenCell(row, col)) {
            cell.classList.add('given');
        } else {
            cell.classList.remove('given');
        }
    }

    /**
     * Show error animation on a cell
     * @param {HTMLElement} cell - Cell element
     */
    showCellError(cell) {
        cell.classList.add('error');
        setTimeout(() => {
            cell.classList.remove('error');
        }, 1000);
    }

    /**
     * Handle keyboard input
     * @param {Event} e - Keyboard event
     */
    handleKeyPress(e) {
        if (!this.selectedCell) return;
        
        const key = e.key;
        
        if (key >= '1' && key <= '9') {
            const number = parseInt(key);
            this.selectNumber(number);
            this.placeNumber(number);
        } else if (key === '0' || key === 'Delete' || key === 'Backspace') {
            this.selectNumber(0);
            this.placeNumber(0);
        } else if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
            this.moveSelection(key);
        }
        
        e.preventDefault();
    }

    /**
     * Move cell selection with arrow keys
     * @param {string} direction - Arrow key direction
     */
    moveSelection(direction) {
        if (!this.selectedCell) return;
        
        let { row, col } = this.selectedCell;
        
        switch (direction) {
            case 'ArrowUp':
                row = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                row = Math.min(8, row + 1);
                break;
            case 'ArrowLeft':
                col = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                col = Math.min(8, col + 1);
                break;
        }
        
        this.selectCell(row, col);
    }

    /**
     * Handle difficulty change
     * @param {Event} e - Click event
     */
    handleDifficultyChange(e) {
        const button = e.target;
        const difficulty = button.dataset.difficulty;
        
        // Update button states
        this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update display
        this.statsElements.difficulty.textContent = difficulty.toUpperCase();
        
        // Start new game with selected difficulty
        this.startNewGame(difficulty);
    }

    /**
     * Start a new game
     * @param {string} difficulty - Difficulty level
     */
    startNewGame(difficulty = null) {
        if (!difficulty) {
            const activeButton = document.querySelector('.difficulty-btn.active');
            difficulty = activeButton ? activeButton.dataset.difficulty : 'medium';
        }
        
        // Generate new puzzle
        const puzzle = this.engine.generatePuzzle(difficulty);
        
        // Reset game state
        this.selectedCell = null;
        this.selectedNumber = null;
        this.errors = 0;
        this.hintsUsed = 0;
        this.gameActive = true;
        
        // Update UI
        this.displayGrid(puzzle.grid);
        this.clearHighlights();
        this.clearNumberSelection();
        this.startTimer();
        this.updateStats();
        
        this.playSound('success');
    }

    /**
     * Display the grid on the UI
     * @param {Array} grid - 9x9 grid to display
     */
    displayGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.updateCell(row, col, grid[row][col]);
            }
        }
    }

    /**
     * Clear number button selection
     */
    clearNumberSelection() {
        this.numberButtons.forEach(btn => btn.classList.remove('selected'));
        this.selectedNumber = null;
    }

    /**
     * Show a hint
     */
    showHint() {
        if (!this.gameActive) return;
        
        const hint = this.engine.getHint(this.engine.grid);
        
        if (hint) {
            this.hintsUsed++;
            
            // Highlight hint cell
            const cellIndex = hint.row * 9 + hint.col;
            const cell = this.grid.children[cellIndex];
            cell.classList.add('hint');
            
            // Place the hint number
            this.engine.grid[hint.row][hint.col] = hint.value;
            this.updateCell(hint.row, hint.col, hint.value);
            
            // Remove hint highlight after animation
            setTimeout(() => {
                cell.classList.remove('hint');
            }, 2000);
            
            this.playSound('success');
            
            // Check if puzzle is complete
            if (this.engine.isComplete(this.engine.grid)) {
                this.gameComplete();
            }
        } else {
            this.showModal('No Hints Available', 'There are no more hints available for this puzzle.');
        }
    }

    /**
     * Check the current solution
     */
    checkSolution() {
        if (!this.gameActive) return;
        
        const validation = this.engine.validatePuzzle(this.engine.grid);
        
        if (validation.isValid) {
            if (this.engine.isComplete(this.engine.grid)) {
                this.gameComplete();
            } else {
                this.showModal('Looking Good!', 'Your solution is correct so far. Keep going!');
            }
        } else {
            this.errors += validation.errors.length;
            this.updateStats();
            
            // Highlight error cells
            validation.errors.forEach(error => {
                const cellIndex = error.row * 9 + error.col;
                const cell = this.grid.children[cellIndex];
                this.showCellError(cell);
            });
            
            this.showModal('Errors Found', `Found ${validation.errors.length} error(s) in your solution. They have been highlighted.`);
            this.playSound('error');
        }
    }

    /**
     * Solve the puzzle automatically
     */
    solvePuzzle() {
        if (!this.gameActive) return;
        
        // Copy solution to current grid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.engine.grid[row][col] = this.engine.solution[row][col];
            }
        }
        
        // Update display with animation
        this.animateSolution();
        
        this.gameActive = false;
        this.stopTimer();
        
        this.showModal('Puzzle Solved!', 'The puzzle has been solved automatically.');
    }

    /**
     * Animate the solution reveal
     */
    animateSolution() {
        const emptyCells = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!this.engine.isGivenCell(row, col)) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        // Shuffle for random animation
        const shuffledCells = this.engine.shuffleArray(emptyCells);
        
        shuffledCells.forEach((cell, index) => {
            setTimeout(() => {
                const cellElement = this.grid.children[cell.row * 9 + cell.col];
                cellElement.classList.add('solved');
                this.updateCell(cell.row, cell.col, this.engine.solution[cell.row][cell.col]);
                
                setTimeout(() => {
                    cellElement.classList.remove('solved');
                }, 500);
            }, index * 100);
        });
    }

    /**
     * Handle game completion
     */
    gameComplete() {
        this.gameActive = false;
        this.stopTimer();
        
        const timeElapsed = this.getTimeElapsed();
        const difficulty = this.statsElements.difficulty.textContent;
        
        let message = `Congratulations! You solved the ${difficulty.toLowerCase()} puzzle in ${timeElapsed}.`;
        
        if (this.errors > 0) {
            message += ` You made ${this.errors} error(s).`;
        }
        
        if (this.hintsUsed > 0) {
            message += ` You used ${this.hintsUsed} hint(s).`;
        }
        
        this.showModal('Puzzle Complete!', message);
        this.playSound('success');
        
        // Add completion animation
        this.animateCompletion();
    }

    /**
     * Animate puzzle completion
     */
    animateCompletion() {
        const cells = this.grid.querySelectorAll('.sudoku-cell');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('pulse');
                setTimeout(() => {
                    cell.classList.remove('pulse');
                }, 1000);
            }, index * 20);
        });
    }

    /**
     * Start the game timer
     */
    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    /**
     * Stop the game timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Update the timer display
     */
    updateTimer() {
        const elapsed = this.getTimeElapsed();
        this.statsElements.timer.textContent = elapsed;
    }

    /**
     * Get formatted time elapsed
     * @returns {string} Formatted time string
     */
    getTimeElapsed() {
        if (!this.startTime) return '00:00';
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Update game statistics display
     */
    updateStats() {
        this.statsElements.errors.textContent = this.errors.toString();
    }

    /**
     * Show modal dialog
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     */
    showModal(title, message) {
        this.modal.title.textContent = title;
        this.modal.message.textContent = message;
        this.modal.element.classList.remove('hidden');
        this.modal.element.classList.add('fade-in');
    }

    /**
     * Hide modal dialog
     */
    hideModal() {
        this.modal.element.classList.add('hidden');
        this.modal.element.classList.remove('fade-in');
    }

    /**
     * Play sound effect
     * @param {string} soundType - Type of sound (click, success, error)
     */
    playSound(soundType) {
        const audio = document.getElementById(`${soundType}-sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore audio play errors (user interaction required)
            });
        }
    }
}