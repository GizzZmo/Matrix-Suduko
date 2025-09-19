/**
 * Matrix Sudoku Web Server
 * Express.js server for web deployment of the game
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

/**
 * Web server class for Matrix Sudoku
 */
class MatrixSudokuServer {
    /**
     * Initialize the server
     */
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.port = process.env.PORT || 3000;
        this.isDevelopment = process.env.NODE_ENV === 'development';
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocket();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security headers
        this.app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            
            // CSP for security
            res.setHeader('Content-Security-Policy', 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data:; " +
                "media-src 'self'; " +
                "connect-src 'self' ws: wss:;"
            );
            
            next();
        });

        // Static file serving
        this.app.use(express.static(path.join(__dirname, '../')));
        this.app.use('/assets', express.static(path.join(__dirname, '../assets')));
        this.app.use('/css', express.static(path.join(__dirname, '../css')));
        this.app.use('/js', express.static(path.join(__dirname, '../js')));

        // JSON parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Logging middleware
        if (this.isDevelopment) {
            this.app.use((req, res, next) => {
                console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
                next();
            });
        }
    }

    /**
     * Setup Express routes
     */
    setupRoutes() {
        // Main game route
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        // Game API routes
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                uptime: process.uptime()
            });
        });

        // Game statistics API
        this.app.get('/api/stats', (req, res) => {
            res.json({
                connectedPlayers: this.io.engine.clientsCount,
                totalGames: this.gameStats.totalGames,
                totalSolutions: this.gameStats.totalSolutions,
                averageTime: this.gameStats.averageTime
            });
        });

        // Save game state (for web version)
        this.app.post('/api/save-game', (req, res) => {
            try {
                const gameData = req.body;
                // In a real implementation, save to database
                // For now, just return success
                res.json({ success: true, message: 'Game saved successfully' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Load game state (for web version)
        this.app.get('/api/load-game/:sessionId?', (req, res) => {
            try {
                const sessionId = req.params.sessionId;
                // In a real implementation, load from database
                // For now, return empty state
                res.json({ success: true, data: null });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // High scores API
        this.app.get('/api/leaderboard/:difficulty?', (req, res) => {
            const difficulty = req.params.difficulty || 'all';
            // In a real implementation, fetch from database
            res.json({
                difficulty: difficulty,
                scores: [
                    { rank: 1, name: 'Neo', time: '02:15', errors: 0, difficulty: 'expert', date: '2024-01-15', points: 150 },
                    { rank: 2, name: 'Trinity', time: '02:33', errors: 1, difficulty: 'expert', date: '2024-01-14', points: 120 },
                    { rank: 3, name: 'Morpheus', time: '03:01', errors: 0, difficulty: 'hard', date: '2024-01-13', points: 100 },
                    { rank: 4, name: 'Agent Smith', time: '03:15', errors: 2, difficulty: 'hard', date: '2024-01-12', points: 90 },
                    { rank: 5, name: 'Oracle', time: '04:20', errors: 0, difficulty: 'medium', date: '2024-01-11', points: 80 }
                ]
            });
        });

        // Submit score API
        this.app.post('/api/submit-score', (req, res) => {
            try {
                const scoreData = req.body;
                // In a real implementation, save to database and update leaderboard
                console.log('Score submitted:', scoreData);
                res.json({ success: true, message: 'Score submitted successfully', rank: Math.floor(Math.random() * 100) + 1 });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Daily challenge API
        this.app.get('/api/daily-challenge/:date?', (req, res) => {
            const date = req.params.date || new Date().toISOString().split('T')[0];
            try {
                // Generate consistent daily challenge based on date
                const challenge = this.generateDailyChallenge(date);
                res.json({ success: true, challenge });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Achievements API
        this.app.get('/api/achievements/:playerId?', (req, res) => {
            const playerId = req.params.playerId;
            // In a real implementation, fetch from database
            res.json({
                success: true,
                achievements: [
                    { id: 'first_solve', name: 'First Steps', earned: true, date: '2024-01-10' },
                    { id: 'speed_demon', name: 'Speed Demon', earned: false, progress: 0.6 }
                ]
            });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).sendFile(path.join(__dirname, 'index.html'));
        });

        // Error handler
        this.app.use((error, req, res, next) => {
            console.error('Server error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: this.isDevelopment ? error.message : 'Something went wrong'
            });
        });
    }

    /**
     * Setup Socket.IO for real-time features
     */
    setupSocket() {
        this.gameStats = {
            totalGames: 0,
            totalSolutions: 0,
            averageTime: 0,
            connectedPlayers: 0
        };

        // Multiplayer room management
        this.multiplayerRooms = new Map();

        this.io.on('connection', (socket) => {
            this.gameStats.connectedPlayers++;
            console.log(`Player connected: ${socket.id} (Total: ${this.gameStats.connectedPlayers})`);

            // Broadcast player count update
            this.io.emit('player-count', this.gameStats.connectedPlayers);

            // Handle game events
            socket.on('game-started', (data) => {
                this.gameStats.totalGames++;
                console.log(`Game started by ${socket.id}: ${data.difficulty}`);
            });

            socket.on('game-completed', (data) => {
                this.gameStats.totalSolutions++;
                
                // Update average time
                const totalTime = this.gameStats.averageTime * (this.gameStats.totalSolutions - 1);
                this.gameStats.averageTime = (totalTime + data.timeInSeconds) / this.gameStats.totalSolutions;
                
                console.log(`Game completed by ${socket.id}: ${data.timeElapsed} (${data.difficulty})`);
                
                // Broadcast achievement
                this.io.emit('player-completed', {
                    difficulty: data.difficulty,
                    time: data.timeElapsed,
                    errors: data.errors
                });
            });

            socket.on('hint-used', (data) => {
                console.log(`Hint used by ${socket.id}`);
            });

            socket.on('error-made', (data) => {
                console.log(`Error made by ${socket.id}`);
            });

            // Multiplayer features
            socket.on('create-room', (data) => {
                const roomId = this.generateRoomId();
                const room = {
                    id: roomId,
                    host: socket.id,
                    players: [{ id: socket.id, name: data.playerName, ready: false }],
                    puzzle: null,
                    gameState: 'waiting',
                    maxPlayers: data.maxPlayers || 4,
                    difficulty: data.difficulty || 'medium',
                    isPrivate: data.isPrivate || false
                };
                
                this.multiplayerRooms.set(roomId, room);
                socket.join(roomId);
                socket.emit('room-created', { roomId, room });
                
                console.log(`Room created: ${roomId} by ${socket.id}`);
            });

            socket.on('join-room', (data) => {
                const { roomId, playerName } = data;
                const room = this.multiplayerRooms.get(roomId);
                
                if (room && room.players.length < room.maxPlayers) {
                    room.players.push({ id: socket.id, name: playerName, ready: false });
                    socket.join(roomId);
                    
                    this.io.to(roomId).emit('player-joined', { 
                        player: { id: socket.id, name: playerName },
                        room: room
                    });
                    
                    console.log(`Player ${socket.id} joined room ${roomId}`);
                } else {
                    socket.emit('join-room-failed', { 
                        reason: room ? 'Room is full' : 'Room not found' 
                    });
                }
            });

            socket.on('leave-room', (roomId) => {
                this.handlePlayerLeaveRoom(socket, roomId);
            });

            socket.on('player-ready', (data) => {
                const { roomId } = data;
                const room = this.multiplayerRooms.get(roomId);
                
                if (room) {
                    const player = room.players.find(p => p.id === socket.id);
                    if (player) {
                        player.ready = !player.ready;
                        this.io.to(roomId).emit('player-ready-status', { 
                            playerId: socket.id, 
                            ready: player.ready 
                        });
                        
                        // Check if all players are ready
                        if (room.players.every(p => p.ready) && room.players.length >= 2) {
                            this.startMultiplayerGame(roomId);
                        }
                    }
                }
            });

            socket.on('multiplayer-move', (data) => {
                const { roomId, move } = data;
                socket.to(roomId).emit('opponent-move', { 
                    playerId: socket.id, 
                    move: move 
                });
            });

            socket.on('multiplayer-game-completed', (data) => {
                const { roomId, gameData } = data;
                this.io.to(roomId).emit('player-finished', { 
                    playerId: socket.id, 
                    gameData: gameData 
                });
                
                console.log(`Player ${socket.id} finished multiplayer game in room ${roomId}`);
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                this.gameStats.connectedPlayers--;
                console.log(`Player disconnected: ${socket.id} (Total: ${this.gameStats.connectedPlayers})`);
                this.io.emit('player-count', this.gameStats.connectedPlayers);
                
                // Clean up multiplayer rooms
                this.handlePlayerDisconnect(socket);
            });
        });
    }

    /**
     * Start the server
     */
    start() {
        this.server.listen(this.port, () => {
            console.log(`
╔═══════════════════════════════════════╗
║         MATRIX SUDOKU SERVER         ║
╠═══════════════════════════════════════╣
║ Status: Running                       ║
║ Port: ${this.port.toString().padEnd(30)} ║
║ Environment: ${(this.isDevelopment ? 'Development' : 'Production').padEnd(21)} ║
║ URL: http://localhost:${this.port.toString().padEnd(16)} ║
╚═══════════════════════════════════════╝
            `);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            this.server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received, shutting down gracefully');
            this.server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
    }

    /**
     * Stop the server
     */
    stop() {
        return new Promise((resolve) => {
            this.server.close(resolve);
        });
    }

    /**
     * Generate a unique room ID
     * @returns {string} Room ID
     */
    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    /**
     * Generate daily challenge based on date
     * @param {string} date - Date string (YYYY-MM-DD)
     * @returns {Object} Daily challenge data
     */
    generateDailyChallenge(date) {
        const dayOfWeek = new Date(date).getDay();
        const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'expert'];
        const themes = ['matrix', 'cyberpunk', 'neon', 'classic'];
        
        const dayOfYear = Math.floor((new Date(date) - new Date(date.substring(0, 4) + '-01-01')) / 86400000);
        
        return {
            date: date,
            difficulty: difficulties[dayOfWeek],
            theme: themes[dayOfYear % themes.length],
            seed: date.split('-').reduce((acc, part) => acc + parseInt(part), 0) * 1000,
            bonus: { easy: 10, medium: 20, hard: 35, expert: 50 }[difficulties[dayOfWeek]]
        };
    }

    /**
     * Start multiplayer game for a room
     * @param {string} roomId - Room ID
     */
    startMultiplayerGame(roomId) {
        const room = this.multiplayerRooms.get(roomId);
        if (!room) return;

        // Generate puzzle for the room
        room.puzzle = this.generateMultiplayerPuzzle(room.difficulty);
        room.gameState = 'playing';

        this.io.to(roomId).emit('multiplayer-game-started', {
            puzzle: room.puzzle,
            players: room.players
        });

        console.log(`Multiplayer game started in room ${roomId}`);
    }

    /**
     * Generate puzzle for multiplayer (simplified)
     * @param {string} difficulty - Difficulty level
     * @returns {Object} Puzzle data
     */
    generateMultiplayerPuzzle(difficulty) {
        // This is a placeholder - in a real implementation, 
        // you'd generate or fetch a Sudoku puzzle
        return {
            grid: Array(9).fill().map(() => Array(9).fill(0)),
            solution: Array(9).fill().map(() => Array(9).fill(1)),
            difficulty: difficulty
        };
    }

    /**
     * Handle player leaving a room
     * @param {Object} socket - Socket instance
     * @param {string} roomId - Room ID
     */
    handlePlayerLeaveRoom(socket, roomId) {
        const room = this.multiplayerRooms.get(roomId);
        if (!room) return;

        // Remove player from room
        room.players = room.players.filter(p => p.id !== socket.id);
        socket.leave(roomId);

        if (room.players.length === 0) {
            // Delete empty room
            this.multiplayerRooms.delete(roomId);
            console.log(`Room ${roomId} deleted (empty)`);
        } else {
            // If host left, assign new host
            if (room.host === socket.id && room.players.length > 0) {
                room.host = room.players[0].id;
            }

            this.io.to(roomId).emit('player-left', {
                playerId: socket.id,
                room: room
            });
        }

        console.log(`Player ${socket.id} left room ${roomId}`);
    }

    /**
     * Handle player disconnect
     * @param {Object} socket - Socket instance
     */
    handlePlayerDisconnect(socket) {
        // Find and clean up rooms this player was in
        for (const [roomId, room] of this.multiplayerRooms) {
            if (room.players.some(p => p.id === socket.id)) {
                this.handlePlayerLeaveRoom(socket, roomId);
            }
        }
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new MatrixSudokuServer();
    server.start();
}

module.exports = MatrixSudokuServer;