---
name: journey-updates
description: Merge new changes to a prototype user journey
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

Take the content from updates to the user journey and integrate them into the implemented code, following all required patterns from the Cursor rules.

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

**IMPORTANT**: This command requires running `/content-review` as the final validation step (see step 5). Create a TODO list that includes this validation step and do not mark implementation complete until validation has been run.

Take the instructions and parameters provided, then:

1. **Journey Type**: Focus on the `{journey}` journey
2. **Changes Source**:

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
       - Nunjucks template structure and blocks
       - Template variables and data binding (`{{ variable }}`)
       - Form action URLs and method attributes (`method="post" novalidate"`)
       - GOV.UK Frontend macro structures
       - Error handling patterns
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

3. **Implementation Steps**:

   **CRITICAL**: Before starting implementation, create a TODO list that includes a validation step using `/content-review` (see step 5 below).

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
     - **Pattern Compliance**: Follow all 7 required implementation patterns from [forms.mdc](mdc:.cursor/rules/forms.mdc)
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
   - Update the relevant files (routes, views, etc.)
   - Ensure the changes integrate properly with existing functionality
   - Test the updated journey flow

   **STOP HERE**: Before proceeding to step 4, you MUST complete step 5 (Validation) after all implementation is done. Do not mark implementation tasks as complete until validation has been run.

4. **Files to Update**:

   See [forms.mdc](mdc:.cursor/rules/forms.mdc) → "Journey Structure" for required files.

   Files to check/update:

   - `src/server/forms/{journey}/routes.js` - Route path constants
   - `src/server/forms/{journey}/controller.js` - GET and POST handlers
   - `src/server/forms/{journey}/views/*.njk` - Nunjucks templates
   - `src/server/forms/{journey}/index.js` - Plugin registration
   - `src/server/router.js` - Plugin registration (if new journey)
   - `src/server/forms/{journey}/controller.test.js` - Update tests if needed
   - `src/server/home/index.njk` - Add journey link (if new journey)

   **Critical**: Follow all patterns from [forms.mdc](mdc:.cursor/rules/forms.mdc) and referenced rule files.

5. **Validation** (MANDATORY - DO NOT SKIP):

   ⚠️ **REQUIRED STEP**: You MUST run the content-review command after completing all implementation tasks. This is not optional.

   **Run this command IMMEDIATELY after step 3 (Implementation Steps) is complete:**

   ```bash
   /content-review journey:{journey} spec-file:{changes}
   ```

   **This step MUST be completed before marking any TODOs as complete.** Do not skip this validation step.

   Review the validation report and fix any issues found. Repeat until all checks pass:

   - Change link return flow implementation
   - Form state persistence (existing values shown when editing)
   - All required patterns from [forms.mdc](mdc:.cursor/rules/forms.mdc)
   - Content accuracy matching specification

   **Common validation checks:**

   - Change links return users to summary after updating (unless conditional logic requires intermediate pages)
   - Form fields persist existing values when accessed via change links
   - All pages have back links (except start)
   - Summary page passes ROUTES object (not strings)
   - Error handling follows patterns
   - Session management correctly implemented
   - Template paths use correct format: `forms/{journey-name}/views/{template-name}`

   **If validation fails:**

   - Fix identified issues
   - Re-run `/content-review journey:{journey} spec-file:{changes}` to verify fixes
   - Repeat until all checks pass
   - Do NOT mark the implementation as complete until content-review shows no critical issues

   **Success Criteria**: The journey implementation is only complete when:

   1. All implementation tasks are done
   2. `/content-review` command has been executed
   3. Validation report shows no critical issues
   4. All high-priority issues have been resolved
