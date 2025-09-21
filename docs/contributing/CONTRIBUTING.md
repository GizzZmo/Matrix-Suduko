# Contributing to Matrix Sudoku

Thank you for your interest in contributing to Matrix Sudoku! This guide will help you get started with contributing to the project.

## 🤝 Ways to Contribute

There are many ways you can contribute to Matrix Sudoku:

- **Report bugs** and request features
- **Improve documentation** and write tutorials
- **Fix bugs** and implement new features
- **Review pull requests** and provide feedback
- **Share the project** with others
- **Create themes** and visual enhancements
- **Translate** the game to other languages

## 🚀 Quick Start

### 1. Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/Matrix-Suduko.git
cd Matrix-Suduko
```

### 2. Set Up Development Environment

Follow the [Developer Setup Guide](../guides/developer-setup.md) to configure your environment.

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/amazing-feature

# Or for bug fixes:
git checkout -b fix/bug-description
```

### 4. Make Changes

- Write your code following our [Code Style Guide](../guides/code-style.md)
- Add tests for new functionality
- Update documentation as needed

### 5. Test Your Changes

```bash
# Run all tests
npm test

# Test the application
npm run dev
```

### 6. Submit Pull Request

```bash
# Commit your changes
git add .
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature
```

Then create a pull request on GitHub.

## 📋 Contribution Guidelines

### Code Style

- Use **2 spaces** for indentation
- Use **semicolons** at the end of statements
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **descriptive variable names**
- Add **JSDoc comments** for functions and classes

**Example:**
```javascript
/**
 * Calculate the difficulty score for a puzzle
 * @param {Array<Array<number>>} grid - The puzzle grid
 * @param {string} difficulty - Difficulty level
 * @returns {number} Difficulty score between 0-100
 */
function calculateDifficultyScore(grid, difficulty) {
  const filledCells = grid.flat().filter(cell => cell !== 0);
  return Math.round((filledCells.length / 81) * 100);
}
```

### Commit Messages

Follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(engine): add hint system with multiple strategies
fix(ui): resolve cell highlighting issue on mobile
docs(api): update SudokuEngine documentation
style(theme): improve matrix animation performance
test(engine): add comprehensive puzzle generation tests
```

### Pull Request Guidelines

#### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding documentation has been updated
- [ ] Tests have been added that prove the fix is effective or feature works
- [ ] New and existing unit tests pass locally

#### Pull Request Template

```markdown
## Description
Brief description of the changes and which issue is fixed.

Fixes #(issue)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests that you ran to verify your changes.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Use the latest version** to ensure the bug hasn't been fixed
3. **Test in different environments** (browsers, operating systems)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 11.6, Ubuntu 20.04]
 - Browser: [e.g. Chrome 95, Firefox 94, Safari 15]
 - Version: [e.g. 1.0.0]
 - Platform: [e.g. Desktop, Web, Mobile]

**Additional context**
Add any other context about the problem here.
```

## ✨ Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation ideas**
If you have ideas about how this could be implemented, please share them.
```

## 🎨 Contributing Themes

### Creating a New Theme

1. **Add theme definition** in `js/theme-manager.js`:
```javascript
const themes = {
  // existing themes...
  myTheme: {
    name: 'My Amazing Theme',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      background: '#2c3e50',
      text: '#ecf0f1',
      accent: '#f39c12',
      error: '#e74c3c',
      success: '#2ecc71'
    },
    fonts: {
      primary: 'Arial, sans-serif',
      display: 'Impact, sans-serif'
    }
  }
};
```

2. **Add CSS variables** in `css/themes.css`:
```css
.theme-myTheme {
  --color-primary: #ff6b6b;
  --color-secondary: #4ecdc4;
  /* ... other variables */
}
```

3. **Test thoroughly** across different platforms
4. **Add documentation** explaining the theme concept
5. **Include screenshots** in your pull request

## 🌍 Translation and Localization

We welcome translations to make Matrix Sudoku accessible to more users worldwide.

### Adding a New Language

1. **Create language file** in `assets/locales/`:
```javascript
// assets/locales/es.json
{
  "game": {
    "title": "Matrix Sudoku",
    "newGame": "Nuevo Juego",
    "difficulty": "Dificultad",
    "easy": "Fácil",
    "medium": "Medio",
    "hard": "Difícil",
    "expert": "Experto"
  },
  "ui": {
    "hint": "Pista",
    "check": "Verificar",
    "solve": "Resolver",
    "reset": "Reiniciar"
  }
}
```

2. **Update locale list** in the translation system
3. **Test the translation** in context
4. **Provide cultural notes** if needed

## 🧪 Testing Contributions

### Writing Tests

When adding new features, include appropriate tests:

```javascript
// tests/new-feature.test.js
describe('New Feature', () => {
  test('should work correctly', () => {
    const result = newFeature();
    expect(result).toBe(expectedValue);
  });

  test('should handle edge cases', () => {
    const result = newFeature(edgeCase);
    expect(result).toBeDefined();
  });
});
```

### Test Categories

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user workflows
- **Performance Tests**: Test for performance regressions

## 📖 Documentation Contributions

### Types of Documentation

- **API Documentation**: Function and class references
- **Tutorials**: Step-by-step guides
- **Architecture Docs**: System design explanations
- **User Guides**: End-user instructions

### Documentation Style

- Use **clear, simple language**
- Include **code examples** where appropriate
- Add **screenshots** for UI-related docs
- Keep content **up-to-date** with code changes

## 🎯 Good First Issues

Looking for ways to contribute? Check out issues labeled with:

- `good first issue` - Perfect for newcomers
- `help wanted` - We'd love your help
- `documentation` - Documentation improvements
- `enhancement` - Feature enhancements
- `bug` - Bug fixes

## 💬 Getting Help

If you need help with contributing:

1. **Check the documentation** first
2. **Search existing issues** and discussions
3. **Ask in GitHub Discussions**
4. **Create a new issue** with the `question` label

## 🏆 Recognition

Contributors are recognized in:

- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Special thanks** in documentation

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 📄 License

By contributing to Matrix Sudoku, you agree that your contributions will be licensed under the [GPL-3.0 License](../../LICENSE).

---

**Thank you for contributing to Matrix Sudoku! Every contribution, no matter how small, helps make the project better for everyone.** 🎮✨