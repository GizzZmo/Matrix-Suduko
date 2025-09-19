/**
 * Multiplayer Manager
 * Handles real-time multiplayer functionality using Socket.IO
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class MultiplayerManager {
    constructor() {
        this.socket = null;
        this.currentRoom = null;
        this.playerName = null;
        this.isConnected = false;
        this.gameMode = 'single'; // 'single', 'multiplayer'
        this.init();
    }

    /**
     * Initialize multiplayer manager
     */
    init() {
        this.connectToServer();
        this.setupEventListeners();
        console.log('Multiplayer Manager initialized');
    }

    /**
     * Connect to Socket.IO server
     */
    connectToServer() {
        // Only try to connect if Socket.IO is available
        if (typeof io !== 'undefined') {
            try {
                this.socket = io();
                this.setupSocketEvents();
            } catch (error) {
                console.warn('Socket.IO connection failed:', error);
            }
        } else {
            console.warn('Socket.IO not available - multiplayer features disabled');
        }
    }

    /**
     * Setup Socket.IO event handlers
     */
    setupSocketEvents() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
            console.log('Connected to multiplayer server');
            this.updateConnectionStatus(true);
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            console.log('Disconnected from multiplayer server');
            this.updateConnectionStatus(false);
        });

        this.socket.on('player-count', (count) => {
            this.updatePlayerCount(count);
        });

        this.socket.on('room-created', (data) => {
            this.handleRoomCreated(data);
        });

        this.socket.on('player-joined', (data) => {
            this.handlePlayerJoined(data);
        });

        this.socket.on('player-left', (data) => {
            this.handlePlayerLeft(data);
        });

        this.socket.on('player-ready-status', (data) => {
            this.handlePlayerReadyStatus(data);
        });

        this.socket.on('multiplayer-game-started', (data) => {
            this.handleGameStarted(data);
        });

        this.socket.on('opponent-move', (data) => {
            this.handleOpponentMove(data);
        });

        this.socket.on('player-finished', (data) => {
            this.handlePlayerFinished(data);
        });

        this.socket.on('join-room-failed', (data) => {
            this.handleJoinRoomFailed(data);
        });
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Listen for multiplayer UI interactions
        document.addEventListener('click', (event) => {
            if (event.target.id === 'create-room-btn') {
                this.showCreateRoomDialog();
            } else if (event.target.id === 'join-room-btn') {
                this.showJoinRoomDialog();
            } else if (event.target.id === 'leave-room-btn') {
                this.leaveRoom();
            } else if (event.target.id === 'ready-btn') {
                this.toggleReady();
            }
        });

        // Listen for game events to sync with other players
        document.addEventListener('gameMove', (event) => {
            if (this.gameMode === 'multiplayer' && this.currentRoom) {
                this.broadcastMove(event.detail);
            }
        });

        document.addEventListener('gameCompleted', (event) => {
            if (this.gameMode === 'multiplayer' && this.currentRoom) {
                this.broadcastGameCompletion(event.detail);
            }
        });
    }

    /**
     * Create a new multiplayer room
     * @param {Object} roomConfig - Room configuration
     */
    createRoom(roomConfig) {
        if (!this.isConnected) {
            this.showMessage('Not connected to server', 'error');
            return;
        }

        const config = {
            playerName: roomConfig.playerName || 'Anonymous',
            maxPlayers: roomConfig.maxPlayers || 4,
            difficulty: roomConfig.difficulty || 'medium',
            isPrivate: roomConfig.isPrivate || false
        };

        this.playerName = config.playerName;
        this.socket.emit('create-room', config);
    }

    /**
     * Join an existing room
     * @param {string} roomId - Room ID to join
     * @param {string} playerName - Player name
     */
    joinRoom(roomId, playerName) {
        if (!this.isConnected) {
            this.showMessage('Not connected to server', 'error');
            return;
        }

        this.playerName = playerName || 'Anonymous';
        this.socket.emit('join-room', {
            roomId: roomId.toUpperCase(),
            playerName: this.playerName
        });
    }

    /**
     * Leave current room
     */
    leaveRoom() {
        if (this.currentRoom && this.socket) {
            this.socket.emit('leave-room', this.currentRoom.id);
            this.currentRoom = null;
            this.gameMode = 'single';
            this.hideMultiplayerUI();
        }
    }

    /**
     * Toggle player ready status
     */
    toggleReady() {
        if (this.currentRoom && this.socket) {
            this.socket.emit('player-ready', {
                roomId: this.currentRoom.id
            });
        }
    }

    /**
     * Broadcast player move to other players
     * @param {Object} moveData - Move data
     */
    broadcastMove(moveData) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('multiplayer-move', {
                roomId: this.currentRoom.id,
                move: moveData
            });
        }
    }

    /**
     * Broadcast game completion
     * @param {Object} gameData - Game completion data
     */
    broadcastGameCompletion(gameData) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('multiplayer-game-completed', {
                roomId: this.currentRoom.id,
                gameData: gameData
            });
        }
    }

    /**
     * Handle room creation success
     * @param {Object} data - Room data
     */
    handleRoomCreated(data) {
        this.currentRoom = data.room;
        this.gameMode = 'multiplayer';
        this.showMultiplayerUI();
        this.updateRoomInfo();
        this.showMessage(`Room created: ${data.roomId}`, 'success');
        console.log('Room created:', data.roomId);
    }

    /**
     * Handle player joining room
     * @param {Object} data - Player join data
     */
    handlePlayerJoined(data) {
        this.currentRoom = data.room;
        this.updateRoomInfo();
        this.showMessage(`${data.player.name} joined the room`, 'info');
        console.log('Player joined:', data.player.name);
    }

    /**
     * Handle player leaving room
     * @param {Object} data - Player leave data
     */
    handlePlayerLeft(data) {
        this.currentRoom = data.room;
        this.updateRoomInfo();
        this.showMessage('A player left the room', 'info');
    }

    /**
     * Handle player ready status change
     * @param {Object} data - Ready status data
     */
    handlePlayerReadyStatus(data) {
        this.updatePlayerReadyStatus(data.playerId, data.ready);
    }

    /**
     * Handle multiplayer game start
     * @param {Object} data - Game start data
     */
    handleGameStarted(data) {
        this.gameMode = 'multiplayer';
        this.showMessage('Multiplayer game started!', 'success');
        
        // Emit event to start the game with the provided puzzle
        const event = new CustomEvent('startMultiplayerGame', {
            detail: {
                puzzle: data.puzzle,
                players: data.players
            }
        });
        
        document.dispatchEvent(event);
        console.log('Multiplayer game started');
    }

    /**
     * Handle opponent move
     * @param {Object} data - Opponent move data
     */
    handleOpponentMove(data) {
        // Emit event for game controller to handle
        const event = new CustomEvent('opponentMove', {
            detail: {
                playerId: data.playerId,
                move: data.move
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Handle player finishing the game
     * @param {Object} data - Player finish data
     */
    handlePlayerFinished(data) {
        this.showMessage(`Player finished the game!`, 'info');
        console.log('Player finished:', data.playerId);
    }

    /**
     * Handle join room failure
     * @param {Object} data - Failure data
     */
    handleJoinRoomFailed(data) {
        this.showMessage(`Failed to join room: ${data.reason}`, 'error');
    }

    /**
     * Show create room dialog
     */
    showCreateRoomDialog() {
        const dialog = this.createRoomDialog();
        document.body.appendChild(dialog);
    }

    /**
     * Show join room dialog
     */
    showJoinRoomDialog() {
        const dialog = this.createJoinDialog();
        document.body.appendChild(dialog);
    }

    /**
     * Create room creation dialog
     * @returns {HTMLElement} Dialog element
     */
    createRoomDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'multiplayer-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Create Multiplayer Room</h3>
                <div class="form-group">
                    <label>Your Name:</label>
                    <input type="text" id="create-player-name" placeholder="Enter your name" maxlength="20">
                </div>
                <div class="form-group">
                    <label>Max Players:</label>
                    <select id="create-max-players">
                        <option value="2">2 Players</option>
                        <option value="3">3 Players</option>
                        <option value="4" selected>4 Players</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Difficulty:</label>
                    <select id="create-difficulty">
                        <option value="easy">Easy</option>
                        <option value="medium" selected>Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
                <div class="dialog-buttons">
                    <button id="confirm-create" class="btn-primary">Create Room</button>
                    <button id="cancel-create" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;

        // Setup event listeners
        dialog.querySelector('#confirm-create').onclick = () => {
            const config = {
                playerName: dialog.querySelector('#create-player-name').value || 'Anonymous',
                maxPlayers: parseInt(dialog.querySelector('#create-max-players').value),
                difficulty: dialog.querySelector('#create-difficulty').value,
                isPrivate: false
            };
            
            this.createRoom(config);
            document.body.removeChild(dialog);
        };

        dialog.querySelector('#cancel-create').onclick = () => {
            document.body.removeChild(dialog);
        };

        return dialog;
    }

    /**
     * Create join room dialog
     * @returns {HTMLElement} Dialog element
     */
    createJoinDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'multiplayer-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Join Multiplayer Room</h3>
                <div class="form-group">
                    <label>Your Name:</label>
                    <input type="text" id="join-player-name" placeholder="Enter your name" maxlength="20">
                </div>
                <div class="form-group">
                    <label>Room ID:</label>
                    <input type="text" id="join-room-id" placeholder="Enter room ID" maxlength="6" style="text-transform: uppercase;">
                </div>
                <div class="dialog-buttons">
                    <button id="confirm-join" class="btn-primary">Join Room</button>
                    <button id="cancel-join" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;

        // Setup event listeners
        dialog.querySelector('#confirm-join').onclick = () => {
            const roomId = dialog.querySelector('#join-room-id').value;
            const playerName = dialog.querySelector('#join-player-name').value || 'Anonymous';
            
            if (roomId.length >= 4) {
                this.joinRoom(roomId, playerName);
                document.body.removeChild(dialog);
            } else {
                this.showMessage('Please enter a valid room ID', 'error');
            }
        };

        dialog.querySelector('#cancel-join').onclick = () => {
            document.body.removeChild(dialog);
        };

        return dialog;
    }

    /**
     * Show multiplayer UI elements
     */
    showMultiplayerUI() {
        // Create or show multiplayer UI elements
        this.createMultiplayerUI();
    }

    /**
     * Hide multiplayer UI elements
     */
    hideMultiplayerUI() {
        const ui = document.getElementById('multiplayer-ui');
        if (ui) {
            ui.remove();
        }
    }

    /**
     * Create multiplayer UI
     */
    createMultiplayerUI() {
        if (document.getElementById('multiplayer-ui')) return;

        const ui = document.createElement('div');
        ui.id = 'multiplayer-ui';
        ui.className = 'multiplayer-ui';
        ui.innerHTML = `
            <div class="multiplayer-panel">
                <h4>Multiplayer Room</h4>
                <div id="room-info"></div>
                <div id="players-list"></div>
                <div class="multiplayer-controls">
                    <button id="ready-btn" class="btn-secondary">Ready</button>
                    <button id="leave-room-btn" class="btn-secondary">Leave Room</button>
                </div>
            </div>
        `;

        document.body.appendChild(ui);
    }

    /**
     * Update room information display
     */
    updateRoomInfo() {
        const roomInfo = document.getElementById('room-info');
        if (roomInfo && this.currentRoom) {
            roomInfo.innerHTML = `
                <p><strong>Room ID:</strong> ${this.currentRoom.id}</p>
                <p><strong>Difficulty:</strong> ${this.currentRoom.difficulty.toUpperCase()}</p>
                <p><strong>Players:</strong> ${this.currentRoom.players.length}/${this.currentRoom.maxPlayers}</p>
            `;
        }

        this.updatePlayersList();
    }

    /**
     * Update players list display
     */
    updatePlayersList() {
        const playersList = document.getElementById('players-list');
        if (playersList && this.currentRoom) {
            playersList.innerHTML = `
                <h5>Players:</h5>
                <ul>
                    ${this.currentRoom.players.map(player => `
                        <li>
                            ${player.name} 
                            ${player.ready ? '✓' : '⏳'}
                            ${player.id === this.currentRoom.host ? '👑' : ''}
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    }

    /**
     * Update player ready status
     * @param {string} playerId - Player ID
     * @param {boolean} ready - Ready status
     */
    updatePlayerReadyStatus(playerId, ready) {
        if (this.currentRoom) {
            const player = this.currentRoom.players.find(p => p.id === playerId);
            if (player) {
                player.ready = ready;
                this.updatePlayersList();
            }
        }
    }

    /**
     * Update connection status display
     * @param {boolean} connected - Connection status
     */
    updateConnectionStatus(connected) {
        // Update UI to show connection status
        const status = document.getElementById('connection-status');
        if (status) {
            status.textContent = connected ? 'Connected' : 'Disconnected';
            status.className = connected ? 'connected' : 'disconnected';
        }
    }

    /**
     * Update online player count
     * @param {number} count - Player count
     */
    updatePlayerCount(count) {
        const element = document.getElementById('online-players');
        if (element) {
            element.textContent = `${count} players online`;
        }
    }

    /**
     * Show message to user
     * @param {string} message - Message text
     * @param {string} type - Message type
     */
    showMessage(message, type = 'info') {
        console.log(`[Multiplayer] ${message}`);
        // Could integrate with existing modal system
    }

    /**
     * Get current multiplayer status
     * @returns {Object} Multiplayer status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            gameMode: this.gameMode,
            currentRoom: this.currentRoom,
            playerName: this.playerName
        };
    }

    /**
     * Cleanup multiplayer manager
     */
    destroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.hideMultiplayerUI();
        console.log('Multiplayer Manager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiplayerManager;
}