---
name: journey-updates
description: Merge new changes to a user journey
parameters:
  - name: journey
    description: The type of journey to update (e.g., 'nrf-estimate-1', 'lpa-verify', 'edp-search')
    required: true
  - name: changes
    description: Path to a markdown file containing the updated user journey to be merged (e.g., 'prompts/implementation/quote-journey-v2.md')
    required: true
---

# Journey Updates Command

## Description

Take the content from updates to the user journey and integrate them into the implemented code

## Usage

Type `/journey-updates` in the chat to trigger a merge of changes to the user journey.

### Parameters

- `journey` (required): Specify which journey to update
- `changes` (required): Path to a markdown file containing the updated user journey to be merged

### Examples

- `/journey-updates journey:nrf-estimate-1 changes:prompts/implementation/quote-journey-v2.md`

### Content Change Examples

- **Terminology**: "redline" → "red line", "residential" → "dwellinghouse"
- **Spacing**: "redline boundary" → "red line boundary"
- **Error messages**: "Select a building type" → "Select a building type to continue"
- **Page titles**: "Upload redline file" → "Upload a red line boundary file"
- **Pronoun changes**: "your development" → "the development"
- **Grammar fixes**: "If you need to help" → "If you need help"
- **Alphabetical ordering**: Form options (checkboxes, radio buttons, select options) must be in alphabetical order

### Structural Change Examples

- **New pages**: Step 7 "Email sent from the Nature Restoration Fund service" → `/nrf-estimate-1/estimate-email-content`
- **Page order changes**: Reordering of steps in the journey flow
- **Path changes**: `/old-path` → `/new-path`
- **Deleted pages**: Removing steps that are no longer needed

# Instructions

Take the instructions and parameters provided, then:

1. **Check if Journey Exists**:
   - Check if `src/server/forms/{journey}/` directory exists
   - If it doesn't exist, this is a NEW journey - follow all setup steps in step 1a
   - If it exists, this is an UPDATE - skip to step 2

1a. **New Journey Setup** (ONLY if journey doesn't exist):

**IMPORTANT**: Follow the complete guidance in `docs/README.md` under:

- "Adding New Journeys" - for directory structure and file creation
- "Required Implementation Patterns" - for all mandatory patterns (7 patterns)
- "Common Issues and Solutions" - to avoid known pitfalls
- "Validation Checklist" - to verify completeness

**CRITICAL**: Also reference `docs/implementation-requirements.md` for:

- Critical implementation patterns (Back Links, Change Links, Template Paths)
- Production requirements (contact info, admin charges)
- Template path requirements (prevents 500 errors)

**Quick Setup Steps**:

1.  Create directory: `src/server/forms/{journey}/` with `index.js`, `routes.js`, `controller.js`, `views/`
2.  Register plugin in `src/server/router.js`
3.  Add journey link to `src/server/home/index.njk`
4.  Follow `hello-world` example for all file structures

**Critical Patterns to Implement**:

- See `docs/README.md` → "Required Implementation Patterns" for all 7 mandatory patterns
- See `docs/README.md` → "Common Issues and Solutions" for known pitfalls to avoid
- See `docs/README.md` → "Content Review and Specification Compliance" for dynamic content patterns

2. **Journey Type**: Focus on the `{journey}` journey
3. **Changes Source**:

   - Read and analyze the markdown file content in `{changes}`
   - Compare with the implemented user journey under `{journey}`
   - **Content Replacement Methodology** (Recommended Approach):
     - **Parse Specification Content**: Extract complete content blocks from the markdown specification for each page
     - **Content Block Identification**: Identify content sections in the specification:
       - Main page content (paragraphs, lists, headings)
       - Form labels and options
       - Error messages and validation text
       - Button text and navigation elements
     - **Direct Content Mapping**: Map specification content directly to view file content sections
     - **Template-Aware Replacement**: Replace content while preserving:
       - Nunjucks template structure
       - Template variables and data binding (e.g., `{{ data.variable }}`)
       - Form action URLs and method attributes
       - GOV.UK Frontend CSS classes and HTML attributes
       - JavaScript functionality
   - **Content Comparison Techniques** (Fallback Approach):
     - Use grep/search tools to find specific text patterns
     - Compare exact strings between specification and implementation
     - Look for word variations, spacing differences, and terminology changes
     - Check all user-facing text including hidden form elements and error messages
     - Forensically review the content in the implemented pages and compare against the content defined in `{changes}`
   - **Structural Detection Techniques**:
     - Use `grep -E "^\|\|.*Path:"` to extract all page paths from specification
     - Use `ls src/server/forms/{journey}/views/` to list existing view files
     - Compare the two lists to identify missing pages
     - Use `grep -E "Order number:"` to detect page order changes
   - **Structural Analysis**:
     - Extract all page paths from the specification (look for "Path:" entries)
     - Compare with existing view files in the journey directory
     - Identify new pages, deleted pages, and modified pages
     - Check for new order numbers and page flow changes

4. **Implementation Steps**:

   - **Structural Analysis First**:
     - Extract all page paths from the specification using grep for "Path:"
     - List all existing view files in the journey directory
     - Identify new pages that need to be created
     - Identify deleted pages that need to be removed
     - Check for page order changes and flow modifications
   - **Content Replacement Strategy** (Primary Approach):
     - **Extract Content Blocks**: Parse the specification markdown to extract complete content blocks for each page
     - **Direct Content Replacement**: Replace entire content sections in view files with the exact content from the specification
     - **Content Block Mapping**: Map specification content blocks to corresponding view file sections:
       - Page titles and headings
       - Main content paragraphs and lists
       - Form labels and options
       - Error messages and validation text
       - Button text and navigation elements
     - **Template Preservation**: Maintain Nunjucks template structure while replacing content
     - **Variable Preservation**: Keep existing template variables and data binding intact
   - **Fallback Content Comparison** (Secondary Approach):
     - Use grep/search tools to find specific text patterns
     - Compare exact strings between specification and implementation
     - Look for word variations, spacing differences, and terminology changes
     - Check all user-facing text including hidden form elements and error messages
   - Focus on ALL content changes including:
     - **Text changes**: Exact wording, capitalization, punctuation, spacing
     - **Terminology changes**: Word variations (e.g., "redline" vs "red line", "dwellinghouse" vs "residential")
     - **Error messages**: Exact error text, validation messages, field labels
     - **Page titles and headings**: All heading text, page titles, form labels
     - **Navigation text**: Button text, link text, back link text
     - **Content structure**: Bullet points, lists, form options, radio/checkbox labels
     - **Alphabetical ordering**: Ensure all form options (checkboxes, radio buttons, select options) are in alphabetical order by their display text
     - **Page flow changes**: New pages, deleted pages, conditional routing
     - **Data structure changes**: Field names, variable names, data types
     - **Dynamic content**: Replace static values with dynamic session data
     - **File upload validation**: Implement all file validation error scenarios
   - Update the relevant files (routes, views, etc.)
   - Ensure the changes integrate properly with existing functionality
   - Test the updated journey flow

5. **Files to Update**:

   - Routes: `src/server/forms/{journey}/routes.js` - Route path constants
   - Controllers: `src/server/forms/{journey}/controller.js` - GET and POST handler functions
   - Views: `src/server/forms/{journey}/views/*.njk` - Nunjucks templates
   - Index: `src/server/forms/{journey}/index.js` - Plugin registration
   - Tests: `src/server/forms/{journey}/controller.test.js` - Update tests if needed
   - Router: `src/server/router.js` - Update plugin registration if it's a new journey
   - Any additional files mentioned in the changes

6. **Validation**:

   **Use the comprehensive checklist in `docs/README.md`** under "Validation Checklist"

   **ALSO reference `docs/implementation-requirements.md`** for critical implementation patterns

   The checklist covers:

   - Setup verification (plugin registration, home page link)
   - Navigation verification (back links, change links, ROUTES)
   - Forms & validation (POST routes, error handling)
   - Session management (yar operations, guard redirects)
   - Content accuracy (titles, labels, errors, buttons)
   - End-to-end testing (complete journey, navigation, changes)
   - **Critical patterns**: Back links, change links, template paths (prevents 500 errors)

   **Content Review Process** (CRITICAL for 100% compliance):

   After implementing changes, run a comprehensive content review:

   1. **Parse Specification Content**: Extract all content blocks from the specification markdown
   2. **Page-by-Page Comparison**: Compare each implemented page against specification
   3. **Dynamic Content Verification**: Check all dynamic content uses actual session data
   4. **Error Message Compliance**: Verify all error messages match specification exactly
   5. **Conditional Logic Testing**: Test all conditional paths and routing

   **Content Review Checklist**:

   - [ ] **Page Titles**: All page titles match specification exactly
   - [ ] **Form Labels**: All form labels and hints match specification
   - [ ] **Error Messages**: All error messages match specification word-for-word
   - [ ] **Button Text**: All button text matches specification
   - [ ] **Dynamic Content**: Dynamic titles, email content use session data (not static values)
   - [ ] **File Upload Validation**: All file validation error scenarios implemented
   - [ ] **Conditional Logic**: All conditional paths work correctly
   - [ ] **Alphabetical Ordering**: All form options in alphabetical order

   **Critical Content Elements to Verify**:

   - **File Upload Errors**: "Select a file to upload", "The selected file must be a [shp,geojson]", "The [file] must be smaller than 2MB", "The selected file is empty"
   - **Dynamic Titles**: Room count page title includes building type (e.g., "hotel building(s)")
   - **Dynamic Email Content**: Uses actual EDP area, building counts, levy amounts from session data
   - **Error Messages**: All error messages match specification exactly

   **Additional verification for updates**:

   - **Structural**: All pages from specification exist, no orphaned pages
   - **Content**: ALL user-facing text matches specification exactly
   - **Functional**: All form submissions work, validation logic correct, error messages display
   - **User Experience**: Complete journey works end-to-end, conditional paths work

   **Common Issues to Check**:

   - Refer to `docs/README.md` → "Common Issues and Solutions" for the complete list of issues to verify
