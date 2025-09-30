# DEFRA NRF Frontend Starter - AI Development Guide

## ⚠️ Code Quality Rules

**NEVER ADD OBVIOUS COMMENTS** - Code should be self-documenting

- Only comment WHY, never WHAT
- Bad: `// Register a form` above `registerForm()`
- Good: Comments explaining complex business logic or workarounds

## Project Overview

Node.js Frontend Template for DEFRA services using:

- **Framework**: Hapi.js v21.4.0
- **Node**: v22.16.0 (use `.nvmrc`)
- **Templates**: Nunjucks
- **Frontend**: GOV.UK Frontend v5.11.0
- **Testing**: Vitest
- **Linting**: ESLint (neostandard), Prettier, Stylelint

## Structure

```
src/
├── client/          # Frontend assets (JS, SCSS)
├── config/          # Application configuration
├── server/          # Backend application
│   ├── common/      # Shared helpers and components
│   ├── forms/       # Forms engine integration
│   │   ├── index.js              # Forms plugin registration
│   │   ├── forms-service.js      # Service implementations
│   │   ├── basic/                # Simple form examples
│   │   │   ├── contact/          # Contact form
│   │   │   └── conditional/      # Conditional routing demo
│   │   ├── advanced/             # Complex forms
│   │   │   └── edp-levy/         # EDP Levy calculator
│   └── [features]/  # Feature modules (home, about, etc.)
└── index.js         # Entry point
```

## Development Commands

```bash
npm run dev             # Start dev server with hot reload
npm test                # Run tests with coverage
npm run lint            # Run all linters
npm run format          # Format code with Prettier
npm run build:frontend  # Build frontend assets
npm start               # Start production server
```

## Coding Standards

### JavaScript/Node.js

- ES6 modules (`type: "module"`)
- Async/await over callbacks
- Proper error handling with try/catch
- Follow neostandard (ESLint config)

### File Naming

- Controllers: `controller.js` with `.test.js`
- Routes: `index.js` in feature folders
- Templates: `.njk` extension

### Route Pattern

```javascript
export const featureName = {
  plugin: {
    name: 'feature-name',
    register(server) {
      server.route([...])
    }
  }
}
```

## Best Practices

1. **Keep it simple** - Clear, readable code
2. **Use GOV.UK components** - Don't reinvent the wheel
3. **Progressive enhancement** - HTML first, then JS
4. **Test keyboard navigation** - Accessibility matters
5. **Mobile-first** - Responsive by default
6. **Follow conventions** - Match existing code style

## Configuration

Uses `convict` for environment-specific settings:

- Redis/Memory cache options
- Session management
- Security headers

## Forms Engine

For DEFRA Forms Engine Plugin documentation, see [FORMS_ENGINE.md](./FORMS_ENGINE.md)

## Docker

```bash
docker compose up --build -d  # Development with docker-compose
```

## Resources

- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [DEFRA GitHub](https://github.com/DEFRA)
- Repository: https://github.com/DEFRA/nrf-frontend-starter
