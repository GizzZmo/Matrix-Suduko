# Build Instructions

This guide provides detailed instructions for building Matrix Sudoku for different platforms.

## 📋 Prerequisites

Before building, ensure you have:

- **Node.js** 16.x or higher
- **npm** 8.x or higher  
- **Git** for version control
- Platform-specific build tools (see below)

## 🔧 Platform-Specific Requirements

### Windows
```bash
# Install windows-build-tools
npm install --global windows-build-tools

# Or manually install:
# - Visual Studio Build Tools 2019/2022
# - Python 3.x
```

### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Or install full Xcode from App Store
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install build-essential libnss3-dev libgconf-2-4
```

## 🚀 Quick Build

### Build All Platforms
```bash
# Install dependencies
npm install

# Build for all platforms
npm run build
```

**Output locations:**
- Windows: `dist/Matrix Sudoku Setup.exe`
- macOS: `dist/Matrix Sudoku.dmg`
- Linux: `dist/Matrix Sudoku.AppImage`

### Platform-Specific Builds

#### Windows Only
```bash
npm run build-win
```

#### macOS Only
```bash
npm run build-mac
```

#### Linux Only
```bash
npm run build-linux
```

## 🛠️ Detailed Build Process

### Step 1: Clean Previous Builds
```bash
# Remove previous build artifacts
rm -rf dist/
rm -rf node_modules/

# Fresh install
npm install
```

### Step 2: Pre-build Validation
```bash
# Run tests
npm test

# Check for linting issues
npx eslint js/ src/

# Verify all dependencies
npm audit
```

### Step 3: Build Configuration

The build process uses the configuration in `package.json`:

```json
{
  "build": {
    "appId": "com.matrix.sudoku",
    "productName": "Matrix Sudoku",
    "directories": {
      "output": "dist"
    },
    "files": [
      "src/**/*",
      "js/**/*",
      "css/**/*",
      "assets/**/*",
      "node_modules/**/*"
    ]
  }
}
```

### Step 4: Platform Builds

#### Windows Build
```bash
# Set environment for Windows
export ELECTRON_BUILDER_PLATFORM=win32

# Build Windows executable
npm run build-win

# Output: dist/Matrix Sudoku Setup.exe
```

**Windows Build Options:**
- **NSIS Installer**: Creates setup.exe with installation wizard
- **Portable**: Creates standalone executable (optional)
- **MSI**: Microsoft Installer format (optional)

#### macOS Build
```bash
# Set environment for macOS
export ELECTRON_BUILDER_PLATFORM=darwin

# Build macOS application
npm run build-mac

# Output: dist/Matrix Sudoku.dmg
```

**macOS Build Options:**
- **DMG**: Disk image for easy installation
- **PKG**: Package installer (optional)
- **MAS**: Mac App Store version (requires certificates)

#### Linux Build
```bash
# Set environment for Linux
export ELECTRON_BUILDER_PLATFORM=linux

# Build Linux application
npm run build-linux

# Output: dist/Matrix Sudoku.AppImage
```

**Linux Build Options:**
- **AppImage**: Portable application format
- **DEB**: Debian package (optional)
- **RPM**: Red Hat package (optional)
- **TAR.XZ**: Compressed archive (optional)

## 📦 Advanced Build Configuration

### Custom Build Configuration

Create `electron-builder.json` for advanced settings:

```json
{
  "appId": "com.matrix.sudoku",
  "productName": "Matrix Sudoku",
  "copyright": "Copyright © 2024 Matrix Sudoku Team",
  "directories": {
    "output": "dist",
    "buildResources": "build"
  },
  "files": [
    "src/**/*",
    "js/**/*",
    "css/**/*",
    "assets/**/*",
    "!tests/**/*",
    "!docs/**/*",
    "!*.md"
  ],
  "extraMetadata": {
    "main": "src/main.js"
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64", "ia32"]
      }
    ],
    "icon": "assets/icons/icon.ico",
    "requestedExecutionLevel": "asInvoker"
  },
  "mac": {
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      }
    ],
    "icon": "assets/icons/icon.icns",
    "category": "public.app-category.games"
  },
  "linux": {
    "target": [
      {
        "target": "AppImage",
        "arch": ["x64"]
      }
    ],
    "icon": "assets/icons/icon.png",
    "category": "Game"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  },
  "dmg": {
    "title": "Matrix Sudoku",
    "background": "assets/dmg-background.png",
    "iconSize": 100,
    "window": {
      "width": 540,
      "height": 380
    },
    "contents": [
      {
        "x": 140,
        "y": 200,
        "type": "file"
      },
      {
        "x": 400,
        "y": 200,
        "type": "link",
        "path": "/Applications"
      }
    ]
  }
}
```

### Environment Variables

Control the build process with environment variables:

```bash
# Debug mode
DEBUG=electron-builder npm run build

# Skip code signing (development)
export CSC_IDENTITY_AUTO_DISCOVERY=false

# Specify output directory
export ELECTRON_BUILDER_DIST=custom-dist

# Target specific architecture
export npm_config_target_arch=arm64
```

## 🔐 Code Signing

### Windows Code Signing
```bash
# Install certificate
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password

# Build with signing
npm run build-win
```

### macOS Code Signing
```bash
# Set up certificates
export CSC_NAME="Developer ID Application: Your Name"
export CSC_IDENTITY_AUTO_DISCOVERY=true

# For Mac App Store
export CSC_NAME="3rd Party Mac Developer Application: Your Name"
export CSC_INSTALLER_IDENTITY="3rd Party Mac Developer Installer: Your Name"

# Build with signing
npm run build-mac
```

### Linux (No signing required)
Linux builds typically don't require code signing, but you can add checksums:

```bash
# Generate checksums
cd dist/
sha256sum *.AppImage > checksums.txt
```

## 🧪 Testing Builds

### Automated Testing
```bash
# Test build artifacts
npm run test-build

# Platform-specific testing
npm run test-win   # Windows
npm run test-mac   # macOS  
npm run test-linux # Linux
```

### Manual Testing

#### Windows
1. **Install**: Run the .exe installer
2. **Launch**: Verify application starts correctly
3. **Features**: Test all game features
4. **Uninstall**: Verify clean removal

#### macOS
1. **Mount**: Open the .dmg file
2. **Install**: Drag to Applications folder
3. **Launch**: Test from Applications and Launchpad
4. **Security**: Verify Gatekeeper acceptance

#### Linux
1. **Execute**: Make AppImage executable and run
2. **Integration**: Test system integration
3. **Permissions**: Verify file access permissions
4. **Desktop**: Test desktop file creation

## 📈 Build Optimization

### Size Optimization
```bash
# Minimize build size
export ELECTRON_BUILDER_COMPRESSION_LEVEL=9

# Exclude development dependencies
npm prune --production

# Use terser for minification
npm install --save-dev terser
```

### Performance Optimization
```bash
# Enable parallel building
export ELECTRON_BUILDER_PARALLEL=true

# Use local cache
export ELECTRON_BUILDER_CACHE=/tmp/electron-builder-cache

# Skip unnecessary files
export ELECTRON_BUILDER_SKIP_GYP=true
```

## 🐛 Troubleshooting

### Common Build Issues

#### "electron-builder command not found"
```bash
# Install globally or use npx
npm install -g electron-builder
# OR
npx electron-builder --help
```

#### "Code signing failed"
```bash
# Disable code signing for development
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build
```

#### "Native dependencies error"
```bash
# Rebuild native modules
npm rebuild
# OR
npx electron-rebuild
```

#### "Out of memory during build"
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Platform-Specific Issues

#### Windows
- **Missing Visual Studio**: Install Build Tools 2019+
- **Python not found**: Install Python 3.x and add to PATH
- **Permission denied**: Run as Administrator

#### macOS
- **Xcode not found**: Install Xcode Command Line Tools
- **Certificate issues**: Check Keychain Access
- **Notarization failed**: Verify Apple Developer account

#### Linux
- **Missing dependencies**: Install build-essential
- **Permission issues**: Check file permissions
- **AppImage not executable**: `chmod +x *.AppImage`

## 📋 Build Checklist

Before releasing a build:

- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Version number updated in `package.json`
- [ ] CHANGELOG.md updated
- [ ] Assets optimized (icons, sounds)
- [ ] Build configuration verified
- [ ] Platform-specific testing completed
- [ ] Code signing certificates valid
- [ ] Release notes prepared

## 🚀 Automated Builds

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    runs-on: ${{ matrix.os }}
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        CSC_IDENTITY_AUTO_DISCOVERY: false
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: ${{ matrix.os }}-build
        path: dist/
```

## 📚 Additional Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [Electron Documentation](https://electronjs.org/docs)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Multi-Platform Build Guide](https://www.electron.build/multi-platform-build)

---

*For deployment instructions, see the [Deployment Guide](deploy.md).*