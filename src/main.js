/**
 * Electron Main Process
 * Creates and manages the main application window
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Main application class for Electron
 */
class MatrixSudokuMain {
    constructor() {
        this.mainWindow = null;
        this.isDevelopment = process.env.NODE_ENV === 'development';
        
        this.init();
    }

    /**
     * Initialize the Electron application
     */
    init() {
        // Handle app ready event
        app.whenReady().then(() => {
            this.createWindow();
            this.setupMenu();
            this.setupIPC();
            
            // macOS specific: Re-create window when dock icon is clicked
            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindow();
                }
            });
        });

        // Handle window close events
        app.on('window-all-closed', () => {
            // macOS specific: Keep app running when all windows are closed
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        // Handle second instance (single instance lock)
        const gotTheLock = app.requestSingleInstanceLock();
        if (!gotTheLock) {
            app.quit();
        } else {
            app.on('second-instance', () => {
                // Someone tried to run a second instance, focus our window instead
                if (this.mainWindow) {
                    if (this.mainWindow.isMinimized()) {
                        this.mainWindow.restore();
                    }
                    this.mainWindow.focus();
                }
            });
        }

        // Security: Prevent new window creation
        app.on('web-contents-created', (event, contents) => {
            contents.on('new-window', (event, navigationUrl) => {
                event.preventDefault();
                shell.openExternal(navigationUrl);
            });
        });
    }

    /**
     * Create the main application window
     */
    createWindow() {
        // Window configuration
        const windowConfig = {
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            icon: path.join(__dirname, '../assets/icon.png'),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js')
            },
            show: false, // Don't show until ready
            titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
            backgroundColor: '#000000'
        };

        // Create the browser window
        this.mainWindow = new BrowserWindow(windowConfig);

        // Load the app
        const startUrl = this.isDevelopment 
            ? 'http://localhost:3000' 
            : `file://${path.join(__dirname, 'index.html')}`;
        
        this.mainWindow.loadFile(path.join(__dirname, 'index.html'));

        // Show window when ready
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
            
            // Focus window
            if (this.isDevelopment) {
                this.mainWindow.webContents.openDevTools();
            }
        });

        // Handle window closed
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });

        // Handle external links
        this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });

        // Prevent navigation away from the app
        this.mainWindow.webContents.on('will-navigate', (event, url) => {
            if (url !== this.mainWindow.webContents.getURL()) {
                event.preventDefault();
                shell.openExternal(url);
            }
        });
    }

    /**
     * Setup application menu
     */
    setupMenu() {
        const template = [
            {
                label: 'Game',
                submenu: [
                    {
                        label: 'New Game',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'new-game');
                        }
                    },
                    {
                        label: 'Hint',
                        accelerator: 'CmdOrCtrl+H',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'hint');
                        }
                    },
                    {
                        label: 'Check Solution',
                        accelerator: 'CmdOrCtrl+K',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'check');
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Easy',
                        type: 'radio',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'difficulty-easy');
                        }
                    },
                    {
                        label: 'Medium',
                        type: 'radio',
                        checked: true,
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'difficulty-medium');
                        }
                    },
                    {
                        label: 'Hard',
                        type: 'radio',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'difficulty-hard');
                        }
                    },
                    {
                        label: 'Expert',
                        type: 'radio',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'difficulty-expert');
                        }
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'resetZoom' },
                    { role: 'zoomIn' },
                    { role: 'zoomOut' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'close' }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About Matrix Sudoku',
                        click: () => {
                            this.showAboutDialog();
                        }
                    },
                    {
                        label: 'Game Instructions',
                        click: () => {
                            this.mainWindow.webContents.send('menu-action', 'help');
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Report Issue',
                        click: () => {
                            shell.openExternal('https://github.com/GizzZmo/Matrix-Suduko/issues');
                        }
                    }
                ]
            }
        ];

        // macOS specific menu adjustments
        if (process.platform === 'darwin') {
            template.unshift({
                label: app.getName(),
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideothers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            });

            // Window menu
            template[3].submenu = [
                { role: 'close' },
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' }
            ];
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    /**
     * Setup IPC communication between main and renderer processes
     */
    setupIPC() {
        // Handle save game request
        ipcMain.handle('save-game', async (event, gameData) => {
            try {
                const userDataPath = app.getPath('userData');
                const savePath = path.join(userDataPath, 'saved-game.json');
                
                await fs.promises.writeFile(savePath, JSON.stringify(gameData, null, 2));
                return { success: true };
            } catch (error) {
                console.error('Failed to save game:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle load game request
        ipcMain.handle('load-game', async () => {
            try {
                const userDataPath = app.getPath('userData');
                const savePath = path.join(userDataPath, 'saved-game.json');
                
                const data = await fs.promises.readFile(savePath, 'utf8');
                return { success: true, data: JSON.parse(data) };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        // Handle export game request
        ipcMain.handle('export-game', async (event, gameData) => {
            try {
                const result = await dialog.showSaveDialog(this.mainWindow, {
                    title: 'Export Game',
                    defaultPath: 'matrix-sudoku-game.json',
                    filters: [
                        { name: 'JSON Files', extensions: ['json'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                });

                if (!result.canceled) {
                    await fs.promises.writeFile(result.filePath, JSON.stringify(gameData, null, 2));
                    return { success: true, path: result.filePath };
                }
                
                return { success: false, cancelled: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        // Handle import game request
        ipcMain.handle('import-game', async () => {
            try {
                const result = await dialog.showOpenDialog(this.mainWindow, {
                    title: 'Import Game',
                    filters: [
                        { name: 'JSON Files', extensions: ['json'] },
                        { name: 'All Files', extensions: ['*'] }
                    ],
                    properties: ['openFile']
                });

                if (!result.canceled && result.filePaths.length > 0) {
                    const data = await fs.promises.readFile(result.filePaths[0], 'utf8');
                    return { success: true, data: JSON.parse(data) };
                }
                
                return { success: false, cancelled: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        // Handle app info request
        ipcMain.handle('get-app-info', () => {
            return {
                name: app.getName(),
                version: app.getVersion(),
                platform: process.platform,
                arch: process.arch,
                electronVersion: process.versions.electron,
                nodeVersion: process.versions.node,
                chromeVersion: process.versions.chrome
            };
        });
    }

    /**
     * Show about dialog
     */
    showAboutDialog() {
        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'About Matrix Sudoku',
            message: 'Matrix Sudoku',
            detail: `Version: ${app.getVersion()}\n\nA stunning Matrix-themed Sudoku game with cross-platform support.\n\nBuilt with Electron and HTML5 technologies.`,
            buttons: ['OK']
        });
    }
}

// Initialize the main application
new MatrixSudokuMain();