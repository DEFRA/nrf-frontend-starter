# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a DEFRA (Department for Environment, Food & Rural Affairs) Node.js frontend application built on the Core Delivery Platform (CDP) template. It uses Hapi.js for the server framework and integrates with `@defra/forms-engine-plugin` v2 for form handling.

## Key Commands

### Development

```bash
npm run dev              # Run in development mode with hot reload
npm run dev:debug        # Run in debug mode with breakpoint support
PORT=3001 npm run dev    # Run on custom port (default: 3000)
```

### Testing

```bash
npm test                 # Run all tests with coverage
npm run test:watch       # Run tests in watch mode
```

### Linting & Formatting

```bash
npm run lint             # Run ESLint and Stylelint
npm run lint:js:fix      # Auto-fix JavaScript linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Production

```bash
npm start                # Run in production mode (builds frontend first)
npm run build:frontend   # Build frontend assets only
```

### Docker

```bash
docker compose up --build -d                                    # Run full stack (app, Redis, MongoDB, LocalStack)
docker build --target development --tag nrf-frontend-starter:development .  # Development image
docker build --tag nrf-frontend-starter .                       # Production image
```

## Architecture

### Server Structure

**Entry Point**: `src/index.js` → `src/server/common/helpers/start-server.js`

**Server Setup** (`src/server/server.js`):

- Creates Hapi server with caching, session management, and security plugins
- Registers core plugins: logging, tracing, CSRF protection (Crumb), CSP
- Registers `@defra/forms-engine-plugin` with custom controllers and services
- Routes defined in `src/server/router.js`

### Core Architectural Patterns

**1. Plugin-Based Architecture**

- Server functionality organized as Hapi plugins
- Each route/feature area (home, about, health) is a separate plugin in `src/server/`
- Forms are handled by the `@defra/forms-engine-plugin` with custom controllers

**2. Configuration Management** (`src/config/config.js`)

- Uses `convict` for environment-based configuration
- Key configs: Redis/memory caching, session management, logging, proxy settings
- Environment-aware defaults (dev vs production)

**3. Session & Caching**

- Server-side caching via Catbox (Redis in production, Memory in dev)
- Configurable via `SESSION_CACHE_ENGINE` env var
- Redis connection: `src/server/common/helpers/redis-client.js`
- Session wrapper: `src/server/common/helpers/session-cache/session-cache.js`

**4. Forms Engine Integration**

- Form definitions stored in `src/server/forms-service.js`
- Custom controllers extend `QuestionPageController` (e.g., `MapDrawingController`)
- Forms use Defra Forms v2 schema with pages, components, conditions, and lists
- Custom views placed in `src/server/forms/views/`
- Services object provides: `formsService`, `outputService`, `formSubmissionService`

### View Layer (Nunjucks)

**Configuration**: `src/config/nunjucks/nunjucks.js`

- Template paths include: `govuk-frontend`, `src/server/common/templates`, `src/server/common/components`
- Shared layout: `src/server/common/templates/layouts/page.njk`
- Custom filters: `src/config/nunjucks/filters/` (e.g., formatCurrency, formatDate)
- Global context: `src/config/nunjucks/context/context.js`

**Forms Engine Override**: Forms plugin gets additional template paths and uses `layouts/page.njk` as base

### Frontend Build (Webpack)

**Entry**: `src/client/javascripts/application.js` and `src/client/stylesheets/application.scss`

- Webpack config: `webpack.config.js`
- Outputs to `.public/` directory (served by `serve-static-files` helper)
- Uses GOV.UK Frontend design system
- SCSS follows ITCSS architecture (variables, core, components, helpers, partials)

### Request Flow

1. Request hits router (`src/server/router.js`)
2. Route handled by controller (e.g., `src/server/home/controller.js`)
3. Controller uses Nunjucks view (e.g., `src/server/home/index.njk`)
4. View extends base layout with context from `src/config/nunjucks/context/context.js`
5. Errors caught by `catchAll` handler in `src/server/common/helpers/errors.js`

### Important Helpers

- **Logging**: `src/server/common/helpers/logging/logger.js` (Pino with ECS format)
- **Proxy**: `src/server/common/helpers/proxy/setup-proxy.js` (Undici ProxyAgent for HTTP requests)
- **Tracing**: Request tracing via `x-cdp-request-id` header
- **Health Check**: `/health` endpoint (required by platform)
- **Metrics**: AWS Embedded Metrics (enabled in production)

## Forms Engine V2 Specifics

### Custom Controllers

- Extend `QuestionPageController` from `@defra/forms-engine-plugin/controllers/QuestionPageController.js`
- Override `viewName` to use custom templates
- Register in `src/server/server.js` under plugin options `controllers` object

### Form Definition Structure

- `metadata`: form slug, title, organization, submission details
- `definition`: pages, components, conditions, lists
- Pages have `path`, `components`, `controller` (optional), `condition` (optional)
- Components: RadiosField, TextField, FileUploadField, etc.
- Conditions control page flow based on component values

### Services

- `formsService.getFormMetadata(slug)`: fetch form metadata by slug
- `formsService.getFormDefinition(id)`: fetch form definition by ID
- `outputService.submit(request, formId, result)`: handle form submission
- `formSubmissionService.persistFiles(context, request, model)`: handle file uploads

## Node.js Version

Requires Node.js >= 22.16.0 (use `nvm use` to set correct version)

## Testing

- Test framework: Vitest
- Coverage tool: @vitest/coverage-v8
- Tests colocated with source files (`.test.js` suffix)
- Component testing helpers: `src/server/common/test-helpers/component-helpers.js`
- Run with `TZ=UTC` to ensure consistent date/time behavior

## Important Notes

- **Pre-commit Hook**: Runs format:check, lint, and tests via Husky
- **Git Hook Setup**: Runs automatically on `npm install` via `postinstall` script
- **Windows Users**: Run `git config --global core.autocrlf false` to fix line ending issues
- **Proxy Configuration**: Uses `global-agent` with `HTTP_PROXY` env var for outbound requests
- **Security**: HSTS, XSS protection, noSniff, frame protection enabled by default
- **CSRF Protection**: Enabled via @hapi/crumb plugin

## Puppeteer MCP Configuration

When using Puppeteer MCP server, always include these launch options:

```javascript
launchOptions: {
  "executablePath": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "headless": true
}
```

The MCP server doesn't read the environment variable from Claude Desktop config, so explicit path is required.
