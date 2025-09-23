# DEFRA NRF Frontend Starter - Development Guide

## Project Overview

Core delivery platform Node.js Frontend Template for DEFRA services.

- **Framework**: Hapi.js v21.4.0
- **Node Version**: v22.16.0 (use `.nvmrc`)
- **Template Engine**: Nunjucks
- **Frontend**: GOV.UK Frontend v5.11.0
- **Testing**: Vitest with coverage
- **Code Quality**: ESLint (neostandard), Prettier, Stylelint

## Architecture & Structure

```
src/
├── client/          # Frontend assets (JS, SCSS)
│   ├── javascripts/
│   └── stylesheets/
├── config/          # Application configuration
│   └── nunjucks/    # Template configuration
├── server/          # Backend application
│   ├── common/      # Shared helpers and components
│   │   ├── components/
│   │   ├── helpers/
│   │   └── templates/
│   ├── home/        # Feature modules
│   ├── about/
│   └── health/
└── index.js         # Application entry point
```

## Coding Standards

### JavaScript/Node.js

- **Style**: neostandard (ESLint configuration in `eslint.config.js`)
- **Module System**: ES6 modules (`type: "module"` in package.json)
- **Node Features**: Use modern Node.js features (v22.16.0)
- **Async**: Prefer async/await over callbacks
- **Error Handling**: Use try/catch blocks, implement proper error boundaries

### File Naming Conventions

- **Controllers**: `controller.js` with matching `controller.test.js`
- **Routes**: `index.js` in feature folders
- **Templates**: `.njk` extension for Nunjucks
- **Tests**: `.test.js` suffix

### Testing

- **Framework**: Vitest
- **Coverage**: Run `npm test` for coverage reports
- **Test Location**: Alongside source files (`.test.js`)
- **Mocking**: Use `vitest-fetch-mock` for API mocking

### Route Pattern

```javascript
// Feature module pattern (e.g., src/server/feature/index.js)
export const featureName = {
  plugin: {
    name: 'feature-name',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/feature',
          ...featureController
        }
      ])
    }
  }
}
```

### Controller Pattern

```javascript
// Controller pattern (e.g., src/server/feature/controller.js)
export const featureController = {
  handler(request, h) {
    return h.view('feature/index', {
      pageTitle: 'Feature Title',
      heading: 'Feature Heading'
    })
  }
}
```

## Key Commands

### Development

- `npm run dev` - Start development server with hot reload
- `npm run dev:debug` - Start with debugger
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode

### Code Quality

- `npm run lint` - Run all linters (JS & SCSS)
- `npm run lint:js:fix` - Auto-fix JS issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

### Production

- `npm run build:frontend` - Build frontend assets
- `npm start` - Start production server

## Configuration

Configuration uses `convict` (see `src/config/config.js`):

- Environment-specific settings
- Redis/Memory cache options
- Session management
- Security headers

## Session & Caching

- **Development**: Memory cache (CatboxMemory)
- **Production**: Redis cache (CatboxRedis)
- **Configuration**: `SESSION_CACHE_ENGINE` environment variable

## Security Features

- HSTS headers enabled
- XSS protection
- Content Security Policy (CSP)
- Secure session cookies in production
- Request tracing (`x-cdp-request-id`)

## DEFRA Forms Engine Plugin

### Overview

The DEFRA Forms Engine Plugin (`@defra/forms-engine-plugin`) enables configuration-driven form creation aligned with GDS Design System.

### Current Integration Status

- **Version**: 2.1.3 installed and working
- **Status**: Fully integrated with basic contact form example
- **Dependencies**: Requires @hapi/crumb for CSRF protection
- **Files Created**:
  - `src/server/forms/index.js` - Forms module with plugin registration
  - `src/server/forms/forms-service.js` - Service for form definitions with contact form example
  - `src/server/forms/index.njk` - Forms listing page template
- **Working Features**:
  - Contact form with text fields, email field, and multi-line text
  - Forms listing page at `/forms`
  - Form navigation and submission flow
  - Integration with existing nunjucks setup

### Installation

```bash
npm install @defra/forms-engine-plugin @hapi/crumb
```

### Basic Setup

1. **Register @hapi/crumb in server.js (required dependency):**

```javascript
import crumb from '@hapi/crumb'

await server.register([
  // ... other plugins
  crumb // Must be registered before forms plugin
  // ... rest of plugins
])
```

2. **Create forms module (src/server/forms/index.js):**

```javascript
import plugin from '@defra/forms-engine-plugin'
import { formsService } from './forms-service.js'

export const forms = {
  plugin: {
    name: 'forms',
    async register(server) {
      await server.register({
        plugin,
        options: {
          services: { formsService },
          nunjucks: {
            baseLayoutPath: path.resolve(
              dirname,
              '../common/templates/layouts/page.njk'
            ),
            paths: [
              'node_modules/govuk-frontend/dist/'
              // ... your template paths
            ]
          },
          viewContext: (request) => ({
            getAssetPath: (asset) => `/public/${asset}`,
            serviceName: 'Your Service Name'
          }),
          baseUrl: process.env.BASE_URL || 'http://localhost:3000'
        }
      })
    }
  }
}
```

2. **Create form configuration (forms/example-form.json):**

```json
{
  "name": "example-form",
  "title": "Example Form",
  "pages": [
    {
      "path": "/start",
      "title": "Start",
      "components": [
        {
          "type": "Html",
          "content": "<p>Welcome to the example form</p>"
        }
      ],
      "next": [
        {
          "path": "/your-details"
        }
      ]
    },
    {
      "path": "/your-details",
      "title": "Your Details",
      "components": [
        {
          "type": "TextField",
          "name": "firstName",
          "title": "First name",
          "hint": "Enter your first name",
          "schema": {
            "min": 2,
            "max": 100
          },
          "validation": {
            "required": true
          }
        },
        {
          "type": "TextField",
          "name": "lastName",
          "title": "Last name",
          "hint": "Enter your last name",
          "schema": {
            "min": 2,
            "max": 100
          },
          "validation": {
            "required": true
          }
        },
        {
          "type": "EmailField",
          "name": "email",
          "title": "Email address",
          "hint": "We'll use this to contact you",
          "validation": {
            "required": true
          }
        }
      ],
      "next": [
        {
          "path": "/check-answers"
        }
      ]
    },
    {
      "path": "/check-answers",
      "title": "Check your answers",
      "components": [
        {
          "type": "SummaryList",
          "name": "summary"
        }
      ],
      "next": [
        {
          "path": "/confirmation"
        }
      ]
    },
    {
      "path": "/confirmation",
      "title": "Confirmation",
      "components": [
        {
          "type": "Html",
          "content": "<p class='govuk-body-l'>Your form has been submitted</p>"
        }
      ]
    }
  ]
}
```

3. **Create route for form:**

```javascript
// src/server/forms/index.js
export const forms = {
  plugin: {
    name: 'forms',
    register(server) {
      // Forms engine handles routing automatically based on JSON config
      // Additional custom routes can be added here if needed
    }
  }
}
```

### Available Components

- `TextField` - Single line text input
- `EmailField` - Email input with validation
- `MultilineTextField` - Textarea for longer text
- `NumberField` - Numeric input
- `DateField` - Date input components
- `RadiosField` - Radio button group
- `CheckboxesField` - Checkbox group
- `SelectField` - Dropdown select
- `Html` - Custom HTML content
- `SummaryList` - Check answers summary

### Form Features

- Multi-page journeys
- Conditional logic
- Validation (client & server-side)
- Session persistence
- Back button support
- Progress indicators
- Summary pages

### Resources

- Documentation: https://defra.github.io/forms-engine-plugin/
- Example UI: https://github.com/DEFRA/forms-engine-plugin-example-ui
- Main Repository: https://github.com/DEFRA/forms-engine-plugin

## Development Best Practices

### Code Craftsman Principles

1. **Simplicity First**: Write clear, simple code that's easy to understand
2. **Single Responsibility**: Each function/module should do one thing well
3. **DRY (Don't Repeat Yourself)**: Extract common functionality
4. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
5. **Boy Scout Rule**: Leave code better than you found it

### Git Workflow

- Use meaningful commit messages
- Run `npm run git:pre-commit-hook` before committing
- Keep commits atomic and focused
- Use conventional commits format when possible

### Testing Strategy

- Write tests for all new functionality
- Maintain minimum 80% code coverage
- Test edge cases and error scenarios
- Use descriptive test names

### Performance Considerations

- Use caching appropriately
- Implement proper error boundaries
- Monitor memory usage
- Use production builds for performance testing

## Environment Variables

Key environment variables:

- `NODE_ENV` - development/test/production
- `PORT` - Server port (default: 3000)
- `SESSION_CACHE_ENGINE` - redis/memory
- `REDIS_HOST` - Redis server host
- `SESSION_COOKIE_PASSWORD` - Must be 32+ chars
- `LOG_LEVEL` - Logging verbosity
- `HTTP_PROXY` - Proxy configuration

## Docker Support

### Development

```bash
docker build --target development --no-cache --tag nrf-frontend-starter:development .
docker run -p 3000:3000 nrf-frontend-starter:development
```

### Production

```bash
docker build --no-cache --tag nrf-frontend-starter .
docker run -p 3000:3000 nrf-frontend-starter
```

### Docker Compose

```bash
docker compose up --build -d
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT environment variable
2. **Redis connection failed**: Check REDIS_HOST configuration
3. **Session issues**: Verify SESSION_COOKIE_PASSWORD is set
4. **Build failures**: Clear node_modules and reinstall

### Debug Mode

```bash
npm run dev:debug
```

Then attach debugger to `0.0.0.0:9229`

## Contact & Support

- Repository: https://github.com/DEFRA/nrf-frontend-starter
- Issues: Report via GitHub Issues
- Documentation: See README.md for additional details
