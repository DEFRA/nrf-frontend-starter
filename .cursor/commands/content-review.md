---
name: content-review
description: Validates implemented journey against specification markdown files
parameters:
  - name: journey
    description: The journey name to validate (e.g., nrf-estimate-1, hello-world)
    required: true
    type: string
  - name: spec-file
    description: Path to the specification markdown file (e.g., prompts/prototype-1/payment-journey-without-ref-v1.md)
    required: true
    type: string
  - name: show-matches
    description: Show pages that match correctly (default shows only discrepancies)
    required: false
    type: boolean
    default: false
---

# Content Review - Validate Implementation Against Specification

## Overview

This command validates that an implemented journey matches its specification by performing comprehensive comparison of:

- Page content, structure, and flow
- Controller logic and routing
- Session management
- Error handling
- GOV.UK Frontend compliance
- **7 Required implementation patterns from `docs/README.md`**

**IMPORTANT**: This command uses the patterns and checklist defined in `docs/README.md` as the authoritative reference. All validation is based on:

- "Required Implementation Patterns" (7 mandatory patterns)
- "Common Issues and Solutions" (known pitfalls to avoid)
- "Validation Checklist" (comprehensive verification points)

## Usage

```
/content-review journey:<journey-name> spec-file:<path-to-spec> [show-matches:true]
```

## Examples

### Basic usage

```bash
/content-review journey:nrf-estimate-1 spec-file:prompts/prototype-1/payment-journey-without-ref-v1.md
```

This will validate:

- Plugin: `src/server/forms/nrf-estimate-1/index.js`
- Routes: `src/server/forms/nrf-estimate-1/routes.js`
- Controllers: `src/server/forms/nrf-estimate-1/controller.js`
- Views: `src/server/forms/nrf-estimate-1/views/*.njk`
- Router registration: `src/server/router.js`
- Home page link: `src/server/home/index.njk`

### Show matching pages too

```bash
/content-review journey:nrf-estimate-1 spec-file:prompts/prototype-1/payment-journey-without-ref-v1.md show-matches:true
```

## What It Does

1. **Reads the specification file** to extract expected page definitions, content, data points, and validation rules
2. **Scans the journey directory** (`src/server/forms/{journey}/`) to find all files
3. **Validates plugin structure** (index.js, routes.js, controller.js, views/)
4. **Compares each page** against its specification
5. **Validates controller logic** (GET/POST handlers, validation, session handling, conditional routing)
6. **Checks required patterns** from `docs/README.md` (back links, change links, etc.)
7. **Generates a detailed report** showing matches, discrepancies, missing elements, and recommendations

## Validation Checklist

**IMPORTANT**: Use the comprehensive checklist from `docs/README.md` as the primary reference. This command validates:

### Setup & Integration

- ✅ Journey directory exists: `src/server/forms/{journey}/`
- ✅ All required files present: `index.js`, `routes.js`, `controller.js`, `views/`
- ✅ Plugin registered in `src/server/router.js`
- ✅ Journey link added to `src/server/home/index.njk`
- ✅ Plugin exports correct structure

### Required Implementation Patterns (see docs/README.md)

**Pattern 1: Back Links**

- ✅ Every non-start page has `backLink` in controller context
- ✅ Templates use `govukBackLink` in `beforeContent` block
- ✅ Back links point to correct previous page
- ✅ Conditional back links calculated when needed

**Pattern 2: Change Links on Summary**

- ✅ Summary controller passes `ROUTES` object (not string) to template
- ✅ Summary template uses `ROUTES.FIELD_PAGE` in change links
- ✅ Change links have proper `visuallyHiddenText`
- ✅ All fields have change links

**Pattern 3: Session Management**

- ✅ POST controllers use `request.yar.set('field', value)`
- ✅ GET controllers use `request.yar.get('field')`
- ✅ Summary retrieves all session data
- ✅ Confirmation clears session with `request.yar.reset()`

**Pattern 4: Error Handling**

- ✅ POST controllers use `request.yar.flash('error', 'message')`
- ✅ GET controllers retrieve errors with `request.yar.flash('error')[0]`
- ✅ Templates show error summary when errors present
- ✅ Field-level errors displayed on inputs

**Pattern 5: Form Submission**

- ✅ Forms use `method="post" novalidate"`
- ✅ POST controllers validate input
- ✅ Valid input redirects to next page
- ✅ Invalid input flashes error and redirects back

**Pattern 6: Guard Redirects**

- ✅ Summary checks for required session data
- ✅ Confirmation checks for required session data
- ✅ Missing data redirects to start page
- ✅ Guard redirects prevent 404s

**Pattern 7: Conditional Summary Rows**

- ✅ Summary only shows relevant fields
- ✅ Uses `} if condition,` syntax for conditional rows
- ✅ Hides fields from paths user didn't take

### Page Structure

- ✅ All specified pages exist as .njk files
- ✅ Page order matches journey flow
- ✅ Correct file paths and naming conventions
- ✅ No unexpected/extra pages (or documented)
- ✅ Templates extend `layouts/page.njk`

### Content Validation

- ✅ Page titles match specification exactly
- ✅ Headings hierarchy correct (h1 for page heading)
- ✅ Required content sections present
- ✅ Hint text matches specification
- ✅ Button/link labels correct
- ✅ GOV.UK Frontend components used correctly
- ✅ Button text matches spec (e.g., "Continue", "Accept and submit")

### Data Points & Forms

- ✅ Form fields match data point specifications
- ✅ Input types correct (text, email, radio, checkbox, etc.)
- ✅ Field names match specification
- ✅ Required fields validated in POST controllers
- ✅ Checkbox arrays normalized in POST controllers

### Error Handling

- ✅ Error summary components present in templates
- ✅ Error messages match specification exactly
- ✅ Field-level error messages correct
- ✅ All error scenarios covered
- ✅ Error anchors link to correct field IDs

### Route Implementation

**Plugin & Routes File**

- ✅ `routes.js` exports BASE_PATH and ROUTES object
- ✅ All route paths use BASE_PATH constant
- ✅ `index.js` imports all controllers
- ✅ `index.js` registers all routes correctly

**Controller Handlers**

- ✅ GET handler for every page
- ✅ POST handler for every form page
- ✅ POST handler for summary submission
- ✅ Controllers use `h.view('forms/{journey}/views/template', context)`
- ✅ Controllers pass all required context (title, heading, data, backLink)

**Validation & Logic**

- ✅ POST controllers validate all required fields
- ✅ Conditional routing logic correct
- ✅ Session data handling correct
- ✅ No hardcoded paths (use ROUTES constants)

### Common Issues Check (see docs/README.md)

- ❌ File upload form with `enctype="multipart/form-data"` but no handling
- ❌ Summary form without POST route
- ❌ Multiple checkboxes but only one page shown
- ❌ Checkbox values not normalized to array
- ❌ Back links not conditional
- ❌ All summary fields shown regardless of path

## Review Structure

Organize findings using the following structure:

### 1. Executive Summary

- **Journey**: `{journey}`
- **Specification**: `{spec-file}`
- **Status**: ✅ Fully Synced / ⚠️ Minor Issues / ❌ Major Discrepancies
- **Pages Analyzed**: X of Y pages
- **Patterns Compliant**: X of 7 required patterns
- **Compliance Score**: X% (based on passed checks)
- **Reference**: See `docs/README.md` for pattern details

### 2. Journey Flow Analysis

Compare implemented journey against specification:

| Order | Spec Page   | Path     | Implemented    | Status       |
| ----- | ----------- | -------- | -------------- | ------------ |
| 1     | Start Page  | /start   | ✅ start.njk   | ✅ Match     |
| 2     | Email Entry | /email   | ❌ Missing     | ❌ Not Found |
| 3     | Summary     | /summary | ⚠️ summary.njk | ⚠️ Partial   |

### 3. Page-by-Page Analysis

For each page in the specification:

#### Page Name (Order X)

**Status**: ✅ Perfect Match / ⚠️ Partial Match / ❌ Missing or Incorrect

**Location**:

- **Spec Path**: `/path/from/spec`
- **Implemented**: `src/server/forms/{journey}/views/filename.njk`
- **Controller**: `src/server/forms/{journey}/controller.js` (handler name)

**Title Check**:

- **Expected**: "Title from spec"
- **Found**: "Title from implementation"
- **Status**: ✅ Match / ❌ Mismatch

**Required Patterns** (see `docs/README.md`):

```
✅ Back link present in controller context
✅ Back link rendered in template beforeContent block
✅ Error handling with flash messages
✅ Form uses method="post" novalidate
✅ Template extends layouts/page.njk
✅ GOV.UK Frontend components imported
```

**Content Validation**:

```
✅ Main heading correct
✅ Body paragraphs present
⚠️ Hint text differs slightly
❌ Missing button label
✅ GOV.UK components used correctly
```

**Data Points**:

```
✅ applicant.email (type: email, required: true)
⚠️ applicant.phone (type: tel, required: false) - marked as required in implementation
❌ applicant.reference - Missing from form
```

**Error Messages**:

```
✅ "Enter your email address" - matches spec
❌ "Email address is required" - spec says "Enter your email address to continue"
⚠️ Missing error for invalid email format
```

**Conditional Logic**:

```
✅ Shows field X when option Y is selected
❌ Missing conditional display for field Z
```

**Issues Found**:

1. **Critical**: Missing required field `applicant.reference`
2. **High**: Error message doesn't match specification
3. **Medium**: Hint text wording differs from spec
4. **Low**: Extra whitespace in template

**Recommendations**:

- Add missing `applicant.reference` field to form
- Update error message to match specification exactly
- Align hint text with spec wording

---

### 4. Required Pattern Compliance

Check all 7 required patterns from `docs/README.md`:

**Pattern 1: Back Links**

```
✅ All non-start pages have back links
⚠️ 2 pages have non-conditional back links (should be dynamic)
❌ 1 page missing back link
```

**Pattern 2: Change Links on Summary**

```
✅ ROUTES object passed to summary template
✅ All fields have change links
✅ visuallyHiddenText present
✅ Change links include `?from=summary` query parameter
✅ POST controllers check for `from=summary` and return to SUMMARY after updates
✅ Conditional logic allows intermediate pages when required (e.g., changing building type may require room count entry)
❌ POST controllers missing return-to-summary logic
❌ Change links missing `?from=summary` parameter
```

**Change Link Return Flow Check:**

- Verify all POST controllers check `request.payload.from === 'summary'` or `request.query.from === 'summary'`
- When `cameFromSummary` is true, redirect to `ROUTES.SUMMARY` unless conditional branching requires intermediate pages
- Intermediate pages must also preserve `from=summary` in redirects (e.g., `ROUTES.ROOM_COUNT + '?from=summary'`)
- GET controllers should check `request.query.from === 'summary'` and set conditional back links

**Form State Persistence Check:**

- GET controllers accessed via change links should pass existing values to templates (e.g., `email: applicant.email`, `residentialBuildingCount: application.residentialBuildingCount`)
- Forms should include hidden field `<input type="hidden" name="from" value="summary">` when `cameFromSummary` is true
- Existing values should be pre-filled in form fields when editing

**Pattern 3: Session Management**

```
✅ POST controllers use request.yar.set()
✅ GET controllers use request.yar.get()
❌ Confirmation doesn't clear session with request.yar.reset()
```

**Pattern 4: Error Handling**

```
✅ Flash messages used for errors
✅ Error summaries displayed
⚠️ 2 error messages don't match spec
```

**Pattern 5: Form Submission**

```
✅ Forms use method="post" novalidate
✅ POST controllers validate
⚠️ 1 form redirects incorrectly on error
```

**Pattern 6: Guard Redirects**

```
✅ Summary checks for session data
❌ Confirmation missing guard redirect
```

**Pattern 7: Conditional Summary Rows**

```
❌ Summary shows all fields (should hide irrelevant ones)
- Should use: } if condition, syntax
```

### 5. Missing Pages

List pages defined in specification but not found in implementation:

```
❌ /nrf-estimate-1/retrieve-estimate-email
   - Spec Order: 5
   - Expected Data Points: applicant.email
   - Expected View: src/server/forms/nrf-estimate-1/views/retrieve-estimate-email.njk
   - Impact: High - breaks user journey flow

❌ /nrf-estimate-1/estimate-email-retrieval-content
   - Spec Order: 6
   - Expected Content: Email template with magic link
   - Expected View: src/server/forms/nrf-estimate-1/views/estimate-email-retrieval-content.njk
   - Impact: High - email confirmation page missing
```

### 6. Extra Pages

List pages found in implementation but not in specification:

```
⚠️ src/server/forms/nrf-estimate-1/views/debug.njk
   - Path: /nrf-estimate-1/debug
   - Purpose: Unknown - not in specification
   - Recommendation: Remove if not needed or add to spec

⚠️ src/server/forms/nrf-estimate-1/views/test-page.njk
   - Path: /nrf-estimate-1/test-page
   - Purpose: Appears to be testing artifact
   - Recommendation: Remove from production views
```

### 7. Plugin & Route Validation

**Plugin Structure**: `src/server/forms/{journey}/`

**Files Status**:

```
✅ index.js exists and exports plugin
✅ routes.js exists with BASE_PATH and ROUTES
✅ controller.js exists with all handlers
✅ views/ directory exists with .njk files
```

**Router Registration**: `src/server/router.js`

```
✅ Plugin imported correctly
✅ Plugin registered in server.register()
```

**Home Page Link**: `src/server/home/index.njk`

```
✅ Journey link added to table
⚠️ Description could be more specific
```

#### Controller Coverage

Check `src/server/forms/{journey}/controller.js`:

```
✅ GET startController - Implemented
✅ POST startController - Missing (start page is GET only)
✅ GET emailController - Implemented
✅ POST emailController - Implemented with validation
❌ GET retrieveEstimateEmailController - Missing
❌ POST retrieveEstimateEmailController - Missing
⚠️ POST summaryController - Exists but needs validation logic
```

#### Route Registration

Check `src/server/forms/{journey}/index.js`:

```
✅ All implemented controllers imported
✅ GET routes registered for all pages
⚠️ 2 POST routes missing from registration
❌ Missing routes for 2 unimplemented pages
```

#### Conditional Routing Logic

```
✅ Routing based on journeyType (Yes/No)
⚠️ Conditional routing to /no-edp page - logic unclear
❌ Missing routing logic for estimate reference flow
✅ Back links calculated correctly for conditional paths
```

#### Session Data Handling

```
✅ request.yar.set() used correctly
✅ request.yar.get() used to retrieve data
⚠️ Some fields not stored in session
❌ request.yar.reset() not called on completion
```

#### Validation Logic

```
✅ Email format validation present
❌ Missing validation for planning reference
⚠️ Error handling incomplete for required fields
✅ Flash messages used correctly for errors
```

### 8. Data Model Consistency

Compare data structures across specification and implementation:

#### Specified Data Structure

```javascript
{
  applicant: {
    email: { type: 'email', required: true },
    planningRef: { type: 'text', required: true }
  },
  application: {
    journeyType: { type: 'radio', values: ['Yes', 'No'], required: true }
  }
}
```

#### Implemented Data Structure

```javascript
// Found in forms across view files
{
  applicant: {
    email: ✅ Matches
    planningRef: ❌ Using 'planning-reference' instead
  },
  application: {
    journeyType: ✅ Matches
    estimateRef: ⚠️ Not in specification
  }
}
```

**Issues**:

- Field name mismatch: `planningRef` vs `planning-reference`
- Extra field not in spec: `estimateRef`

### 9. Content Quality Assessment

#### GOV.UK Design System Compliance

```
✅ Using {% extends "layouts/page.njk" %}
✅ Form components use GOV.UK Frontend macros
✅ Error summary component implemented
✅ Back links use govukBackLink macro
⚠️ Some buttons not using govukButton macro
❌ Missing back link on 2 pages
```

#### Accessibility

```
✅ Form labels properly associated
✅ Error messages linked to fields
⚠️ Some hint text missing for attributes
❌ Missing aria-describedby on error fields
```

#### Content Guidelines

```
✅ Headings follow GOV.UK content style
✅ Button text uses sentence case
⚠️ Some hint text too verbose
❌ Error messages don't follow GOV.UK patterns
```

### 10. Overall Compliance Metrics

#### Summary Statistics

- **Total Pages in Spec**: 10
- **Pages Implemented**: 8
- **Pages Matching**: 5 (62.5%)
- **Pages with Issues**: 3 (37.5%)
- **Missing Pages**: 2
- **Extra Pages**: 1
- **Required Patterns**: 7 total
- **Patterns Implemented**: 5 of 7 (71.4%)

#### Compliance by Category

| Category              | Total Checks | Passed  | Failed | Score     |
| --------------------- | ------------ | ------- | ------ | --------- |
| Setup & Integration   | 5            | 5       | 0      | 100.0%    |
| Required Patterns (7) | 35           | 28      | 7      | 80.0%     |
| Page Structure        | 25           | 20      | 5      | 80.0%     |
| Content               | 50           | 38      | 12     | 76.0%     |
| Data Points           | 25           | 22      | 3      | 88.0%     |
| Error Messages        | 15           | 10      | 5      | 66.7%     |
| Conditional Logic     | 8            | 6       | 2      | 75.0%     |
| Controllers & Routes  | 20           | 15      | 5      | 75.0%     |
| **Overall**           | **183**      | **144** | **39** | **78.7%** |

### 11. Issues Summary

#### Critical Issues (Blockers)

```
❌ Missing 2 required pages from user journey
   - Impact: Journey cannot be completed
   - Files: /retrieve-estimate-email, /estimate-email-retrieval-content
   - Action: Implement missing pages

❌ Incorrect field names break data persistence
   - Impact: Data not saved correctly to session
   - Fields: planningRef vs planning-reference
   - Action: Align field names with specification
```

#### High Priority (Should Fix)

```
⚠️ Error messages don't match specification
   - Impact: User confusion, inconsistent messaging
   - Pages: 3 pages affected
   - Action: Update error text to match spec exactly

⚠️ Missing validation logic in routes
   - Impact: Invalid data can be submitted
   - Routes: POST /summary, POST /planning-ref
   - Action: Add validation middleware
```

#### Medium Priority (Recommended)

```
⚠️ Hint text wording differs from spec
   - Impact: Minor UX inconsistency
   - Pages: 2 pages affected
   - Action: Align hint text with specification

⚠️ Extra page not in specification
   - Impact: Confusion about intended journey
   - File: debug.html
   - Action: Remove or document purpose
```

#### Low Priority (Nice to Have)

```
⚠️ Some buttons not using GOV.UK macros
   - Impact: Potential styling inconsistency
   - Pages: 2 pages
   - Action: Refactor to use govukButton macro

⚠️ Inconsistent whitespace in templates
   - Impact: Code readability
   - Action: Format templates consistently
```

### 12. Recommendations

#### Immediate Actions (Critical)

1. **Implement missing required patterns** (see `docs/README.md`)
   - Add missing back links
   - Implement conditional summary rows
   - Add guard redirects to confirmation
   - Clear session on completion
2. **Fix pattern violations**
   - Ensure ROUTES object passed to summary template
   - Make back links conditional where needed
3. **Implement missing pages** to complete the user journey
4. **Add missing POST routes** (especially summary submission)

#### High Priority

1. **Fix field name mismatches** to ensure data persistence works
2. **Add missing validation** to POST controllers
3. **Update error messages** to match specification exactly
4. **Fix conditional routing** logic

#### Code Quality Improvements

1. Use GOV.UK Frontend macros consistently
2. Improve accessibility attributes
3. Format templates consistently
4. Add controller tests

#### Documentation

1. Update specification if intentional changes were made
2. Document any deviations from spec with rationale
3. Add comments for complex conditional logic
4. Reference `docs/README.md` for pattern guidance

### 13. Common Issues Found

**Reference**: See `docs/README.md` "Common Issues and Solutions" for details

- ❌ **415 error on file upload** - Form has `enctype="multipart/form-data"` but not configured
- ❌ **Summary doesn't submit** - Missing POST route for summary
- ❌ **Multiple selections, one page** - Should show separate page for each selection
- ❌ **Wrong back links** - Not conditional based on journey path
- ❌ **All summary fields shown** - Should hide irrelevant fields
- ❌ **Checkbox array issues** - Not normalized in POST controller

### 14. Next Steps

**Status Verdict**: ⚠️ **Implementation needs work before release**

**Required Actions**:

1. Implement 2 missing pages
2. Fix 3 critical field name mismatches
3. Add validation to 2 route handlers
4. Update 5 error messages

**Estimated Effort**: 3-4 hours

**Ready for Testing**: ❌ Not yet - complete critical issues first

**Follow-up Review**: Run `/content-review` again after fixes applied

## Technical Implementation Guide

### How to Parse the Specification

1. **Extract page definitions**: Look for page tables with Order, Path, Title
2. **Parse data points**: Extract JSON/code blocks defining form fields
3. **Capture content**: Extract markdown content sections for each page
4. **Identify error definitions**: Find error tables with messages
5. **Map conditional logic**: Note "Conditional page flow" specifications

### How to Analyze View Files

1. **Read each HTML file** in the view directory
2. **Extract page title**: Look for `<h1>` or `{{ title }}` variable
3. **Parse form fields**: Find all `input`, `textarea`, `select` elements
4. **Check field names**: Extract `name` attributes from form elements
5. **Validate components**: Verify GOV.UK macro usage
6. **Find error messages**: Look for `errorMessage` in macros
7. **Check conditional content**: Look for `{% if %}` blocks

### How to Validate Journey Structure

1. **Check directory structure**: `src/server/forms/{journey}/`
2. **Verify required files exist**:
   - `index.js` - Plugin export
   - `routes.js` - Route constants (BASE_PATH, ROUTES)
   - `controller.js` - Handler functions
   - `views/` - Nunjucks templates (.njk)
3. **Check plugin registration**: `src/server/router.js`
4. **Check home page link**: `src/server/home/index.njk`

### How to Validate Controllers

1. **Read controller file**: `src/server/forms/{journey}/controller.js`
2. **For each page in spec**:
   - Find corresponding GET handler (e.g., `getPageNameController`)
   - Find corresponding POST handler (if form page)
   - Check handler uses `h.view('forms/{journey}/views/template', context)`
   - Verify required context passed (title, heading, backLink, data)
   - Check POST validates input
   - Check POST uses `request.yar.set()` for data storage
   - Check GET uses `request.yar.get()` to retrieve data
   - Verify error handling uses `request.yar.flash()`
3. **Check summary controller**: Passes ROUTES object, has guard redirect
4. **Check confirmation controller**: Clears session with `request.yar.reset()`

### How to Validate Routes Registration

1. **Read plugin file**: `src/server/forms/{journey}/index.js`
2. **Verify**:
   - All controllers imported
   - Plugin exports object with `plugin.name` and `plugin.register`
   - All routes registered in `server.route()` array
   - GET and POST routes for all pages
3. **Check router**: Plugin imported and registered in `src/server/router.js`

### Comparison Algorithm

For each page in specification:

```
1. Find corresponding view file (by path/name matching)
2. If not found → Add to "Missing Pages"
3. If found:
   a. Compare page title
   b. Validate form fields against data points
   c. Check error messages
   d. Verify conditional logic
   e. Check content completeness
   f. Validate GOV.UK components
4. Calculate compliance score for page
5. Document all discrepancies
```

For each view file in implementation:

```
1. Check if page exists in specification
2. If not → Add to "Extra Pages"
```

## Key Principles

- **Be thorough**: Check every aspect of implementation vs spec
- **Be precise**: Reference specific files, line numbers, and code
- **Be constructive**: Suggest fixes, not just problems
- **Be evidence-based**: Quote from spec and implementation
- **Be prioritized**: Distinguish critical from minor issues
- **Be actionable**: Provide clear next steps

## Common Discrepancy Types

### Content Discrepancies

- Page title wording differs
- Missing hint text
- Incorrect button labels
- Missing or extra paragraphs
- Heading hierarchy wrong

### Data Field Discrepancies

- Field name doesn't match spec
- Wrong input type (text vs email)
- Missing required attribute
- Extra fields not in spec
- Missing fields from spec

### Error Message Discrepancies

- Wording doesn't match exactly
- Missing error scenarios
- Wrong error message shown
- Error summary missing

### Structural Discrepancies

- Missing pages from journey
- Extra pages not in spec
- Wrong page order
- Incorrect paths

### Route Discrepancies

- Missing route definitions
- No validation logic
- Incorrect conditional routing
- Session data not handled

## Output Format

- Use **Markdown** with clear headers and sections
- Use **emoji indicators**: ✅ ❌ ⚠️
- Use **code references**: File paths and line numbers
- Use **comparison tables** for side-by-side analysis
- Use **checklists** for tracking validation items
- Use **metrics tables** for compliance scoring
- Be **detailed but scannable** (use bullets, short paragraphs)

## Exit Criteria for Full Sync

A journey implementation is considered "fully synced" when:

**Setup & Integration**

- ✅ Plugin registered in router
- ✅ Journey link on home page
- ✅ All required files present

**Required Patterns** (see `docs/README.md`)

- ✅ Back links on all non-start pages (conditional where needed)
- ✅ Change links on summary (ROUTES object passed)
- ✅ Session management (yar.set/get/reset)
- ✅ Error handling (flash messages)
- ✅ Form submission (POST validation and redirects)
- ✅ Guard redirects (summary/confirmation check for data)
- ✅ Conditional summary rows (hide irrelevant fields)

**Content & Structure**

- ✅ **100% page coverage**: All spec pages implemented
- ✅ **0 extra pages**: No unexpected pages (or documented)
- ✅ **Content matches**: Titles, headings, body text align
- ✅ **Data fields match**: All form fields match spec exactly
- ✅ **Error messages match**: All error text matches spec

**Implementation**

- ✅ **Routes complete**: All GET/POST routes implemented
- ✅ **Validation present**: Form validation in POST controllers
- ✅ **Conditional logic**: All conditional flows implemented
- ✅ **GOV.UK compliant**: Proper component usage
- ✅ **Templates extend**: layouts/page.njk

**Quality**

- ✅ **No common issues**: See docs/README.md checklist
- ✅ **Compliance score**: ≥95% overall
- ✅ **Pattern compliance**: 7 of 7 patterns implemented

## Tips for Users

### Before Running

1. Ensure specification file is up to date
2. Run prototype locally to verify pages work
3. Have both spec and implementation files ready

### Interpreting Results

- **Green (✅)**: Fully compliant, no action needed
- **Amber (⚠️)**: Minor issues, should fix before production
- **Red (❌)**: Critical issues, must fix before testing

### After Review

1. Prioritize critical and high issues first
2. Create tickets/tasks for each issue category
3. Re-run command after fixes to verify
4. Update specification if intentional changes made

### Keeping Synchronized

- Run this command after each specification update
- Run before user testing sessions
- Run as part of prototype review process
- Document any intentional deviations

## Deliverable

Produce a **comprehensive, actionable content sync report** that:

1. Clearly identifies all discrepancies between spec and implementation
2. Prioritizes issues by severity and impact
3. Provides specific, actionable recommendations
4. Includes metrics and compliance scoring
5. Gives clear verdict on readiness for testing
6. Serves as a quality gate for prototype development

Remember: The goal is to ensure high-quality prototype implementation that accurately reflects the specification, providing confidence for user research and stakeholder demonstrations.
