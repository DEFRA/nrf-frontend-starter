---
name: code-review
description: Conduct a comprehensive code review for Node.js/Nunjucks frontend apps following GOV.UK Design System and Defra Forms DXT plugin standards
---

# Code Review Command

## Description

Conduct a comprehensive code review for Node.js/Nunjucks frontend applications that comply with GOV.UK Design System standards and integrate with the Defra Forms DXT plugin.

## Usage

Type `/code-review` in the chat to trigger a thorough code review of the current file or selected code.

## Review Areas

### 1. **GOV.UK Design System Compliance**

- **Component Usage** - Verify correct implementation of GOV.UK components (buttons, form inputs, navigation, etc.)
- **Typography & Spacing** - Check adherence to GOV.UK type scale, spacing guidelines, and layout patterns
- **Colour & Visual Elements** - Ensure proper use of GOV.UK colour palette and visual hierarchy
- **Accessibility Standards** - Verify WCAG 2.1 AA compliance, semantic HTML, ARIA attributes, keyboard navigation
- **Responsive Design** - Check mobile-first approach and proper grid system usage

### 2. **Defra Forms DXT Plugin Integration**

- **Schema Compliance** - Verify form definitions follow DXT v2 schema standards
- **Controller Patterns** - Check proper extension of QuestionPageController and custom controller implementation
- **Template Structure** - Ensure correct use of baseLayoutPath and template inheritance
- **Configuration-Driven Features** - Verify proper use of page events, templates, and dynamic content
- **Custom Components** - Check alignment with DXT patterns and GOV.UK standards

### 3. **Nunjucks Template Quality**

- **Template Organization** - Verify proper use of extends, includes, and macro patterns
- **Context Usage** - Check proper data binding and context variable usage
- **Conditional Logic** - Ensure clean conditional rendering and error handling
- **Component Reusability** - Verify proper macro usage and component composition
- **Template Performance** - Check for unnecessary template complexity and optimization opportunities

### 4. **Node.js/JavaScript Standards**

- **ES6+ Features** - Verify modern JavaScript patterns, async/await usage, proper imports
- **Error Handling** - Check comprehensive error handling with proper logging and user feedback
- **Security Practices** - Verify input validation, CSRF protection, XSS prevention, secure headers
- **Performance** - Check for memory leaks, inefficient loops, proper caching strategies
- **Code Organization** - Verify proper module structure, separation of concerns, dependency injection

### 5. **Hapi.js Best Practices**

- **Plugin Architecture** - Check proper plugin registration and configuration
- **Route Handling** - Verify proper route organization and controller patterns
- **Middleware Usage** - Check proper use of request lifecycle hooks and middleware
- **Session Management** - Verify secure session handling and state management
- **Security Headers** - Check proper CSP, HSTS, and other security configurations

### 6. **SCSS/CSS Standards**

- **ITCSS Architecture** - Verify proper SCSS organization following ITCSS methodology
- **GOV.UK Frontend Integration** - Check proper use of GOV.UK SCSS variables and mixins
- **Custom Styling** - Ensure custom styles don't conflict with GOV.UK design system
- **Responsive Design** - Verify mobile-first approach and proper breakpoint usage
- **Performance** - Check for unused CSS, proper minification, and efficient selectors

### 7. **Content & UX Standards**

- **GOV.UK Content Guidelines** - Verify plain English, user-focused content, proper tone
- **Form Design Patterns** - Check proper form layout, validation messages, and user guidance
- **Error Handling** - Verify clear error messages and recovery guidance
- **Navigation Patterns** - Check proper breadcrumbs, service navigation, and user flow
- **Accessibility** - Ensure content is accessible to all users including screen readers

### 8. **Testing & Quality Assurance**

- **Test Coverage** - Verify comprehensive test coverage for controllers, templates, and utilities
- **Integration Testing** - Check proper testing of DXT plugin integration and form flows
- **Accessibility Testing** - Verify automated and manual accessibility testing
- **Performance Testing** - Check load testing and performance monitoring
- **Cross-browser Testing** - Verify compatibility across supported browsers

### 9. **Security & Compliance**

- **Data Protection** - Verify proper handling of personal data and GDPR compliance
- **Input Validation** - Check comprehensive server-side validation and sanitization
- **Authentication & Authorization** - Verify proper security patterns and access control
- **Audit Logging** - Check proper logging of user actions and system events
- **Vulnerability Management** - Verify dependency scanning and security updates

### 10. **Performance & Scalability**

- **Caching Strategy** - Check proper use of Redis/memory caching and cache invalidation
- **Asset Optimization** - Verify proper bundling, minification, and compression
- **Database Queries** - Check for N+1 queries and inefficient database operations
- **Memory Management** - Verify proper cleanup and memory leak prevention
- **Monitoring & Metrics** - Check proper performance monitoring and alerting

### 11. **Maintainability & Documentation**

- **Code Documentation** - Verify proper JSDoc comments and inline documentation
- **README Quality** - Check comprehensive setup and usage instructions
- **API Documentation** - Verify proper documentation of custom APIs and services
- **Change Management** - Check proper versioning and change documentation
- **Knowledge Transfer** - Verify code is maintainable by other team members

### 12. **DevOps & Deployment**

- **Environment Configuration** - Check proper environment-specific configurations
- **Docker Configuration** - Verify proper containerization and multi-stage builds
- **CI/CD Pipeline** - Check proper automated testing and deployment processes
- **Monitoring & Logging** - Verify proper application monitoring and log aggregation
- **Health Checks** - Check proper health check endpoints and monitoring

## Output Format

For each issue found, provide:

- **Priority Level**: Critical/High/Medium/Low
- **Category**: GOV.UK Compliance/Security/Performance/Readability/etc.
- **File and Line Numbers**: Specific location of the issue
- **Before/After Examples**: Clear code examples showing current vs. recommended approach
- **Rationale**: Explanation of why the change is needed and its impact
- **GOV.UK Reference**: Link to relevant GOV.UK Design System documentation when applicable
- **DXT Reference**: Reference to Defra Forms DXT plugin documentation when applicable

## Focus Areas by Priority

### **Critical Priority**

- Security vulnerabilities (XSS, CSRF, injection attacks)
- Accessibility violations (WCAG 2.1 AA non-compliance)
- Data corruption or loss risks
- Critical performance issues affecting user experience
- GOV.UK Design System violations that impact user trust

### **High Priority**

- Major architectural problems affecting maintainability
- Significant performance bottlenecks
- Missing error handling that could cause application crashes
- DXT plugin integration issues
- Content that doesn't meet GOV.UK content standards

### **Medium Priority**

- Code quality issues affecting maintainability
- Test coverage gaps
- Minor performance optimizations
- Documentation improvements
- Code organization and structure issues

### **Low Priority**

- Style inconsistencies
- Minor optimizations
- Code formatting issues
- Non-critical documentation updates
- Minor refactoring opportunities

## References

- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Defra Forms DXT Plugin](https://defra.github.io/forms-engine-plugin/)
- [GOV.UK Content Design Standards](https://www.gov.uk/guidance/content-design)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
