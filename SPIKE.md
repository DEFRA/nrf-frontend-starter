# DEFRA Forms Implementation: Key Learnings

This document captures our experience building forms with DEFRA Forms Engine v2 and proposes improvements that could benefit the wider community.

## Core Challenges Observed

1. **Generic 500 errors with limited diagnostic information**

   - Requires manual code inspection to diagnose
   - More specific error messages would significantly improve the development experience

2. **Component options could be more discoverable and better documented**

   - Full list of valid options for each component type isn't easily found
   - Controllers (like FileUploadPageController) aren't easily discoverable, making it difficult for humans and AI to problem solve
   - A comprehensive component reference would be valuable

3 **Challenges for AI-assisted development**

- AI tools read incomplete docs → make assumptions → write incorrect code
- Generic errors don't provide enough feedback for AI to self-correct
- Requires human visual inspection to identify issues
- Better error messages and complete examples would help both humans and AI

4. **Initial learning curve**
   - Some fully functioning examples would help significantly

## What Works Well

- GOV.UK Design System integration is excellent
- Conditional routing works smoothly once properly configured
- Forms are stable and reliable once working
- V2 schema is well-structured and logical
- The framework handles complex journeys effectively

## Our Solution (Work in Progress)

We've created comprehensive local documentation to address these gaps:

- **Critical Rules** ([docs/DEFRA_FORMS.md](docs/DEFRA_FORMS.md)) with wrong/correct examples for common mistakes
- **Automated slash command** ([.cursor/commands/new-journey.md](.cursor/commands/new-journey.md)) that walks AI through form creation step-by-step with verification checkpoints
- **Phased implementation approach** ([prompts/nrf-estimate-journey-phased.md](prompts/nrf-estimate-journey-phased.md)) for complex multi-page forms with human approval gates between phases
- **Working reference examples** (hello-world, conditional-routing, equipment-registration) demonstrating key patterns

**Result:** Complex 19-page journey is now buildable with AI assistance and human approval between phases.

## Next Steps

**This is a work in progress.** Our solution would benefit greatly from:

- Collaboration with DEFRA Forms experts who know the framework deeply
- Review and validation of our documented patterns
- Creation of an exhaustive set of official examples covering all component types and patterns
- Enhancement of framework error messages to aid debugging
- Official documentation covering the patterns we've discovered
