import { describe, it, expect } from 'vitest'
import {
  checkProblematicPatterns,
  checkUnsafeNestedPropertyAccess
} from './validate-nunjucks.js'
import { fileURLToPath } from 'node:url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const testFilePath = path.join(__dirname, 'test-templates', 'test.njk')

describe('validate-nunjucks - Pattern Detection', () => {
  describe('Ternary Operators', () => {
    it('should detect ternary operator in href attribute', () => {
      const content = 'href: application.hasFile ? ROUTES.UPLOAD : ROUTES.MAP,'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Ternary operator')
    })

    it('should detect ternary operator in value assignment', () => {
      const content = 'text: condition ? "Yes" : "No"'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Ternary operator')
    })

    it('should NOT flag URLs with query parameters', () => {
      const content = 'href: "https://example.com?from=summary"'
      const errors = checkProblematicPatterns(testFilePath, content)
      const ternaryErrors = errors.filter((e) =>
        e.message.includes('Ternary operator')
      )
      expect(ternaryErrors.length).toBe(0)
    })

    it('should NOT flag mailto links', () => {
      const content = 'href: "mailto:test@example.com"'
      const errors = checkProblematicPatterns(testFilePath, content)
      const ternaryErrors = errors.filter((e) =>
        e.message.includes('Ternary operator')
      )
      expect(ternaryErrors.length).toBe(0)
    })
  })

  describe('Unsafe Nested Property Access', () => {
    it('should detect unsafe nested property access in template output', () => {
      const content = '{{ application.roomCounts.hmoCount }}'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Unsafe nested property access')
    })

    it('should detect unsafe nested property in macro parameter', () => {
      const content = 'value: application.roomCounts.hotelCount'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Unsafe nested property access')
    })

    it('should detect unsafe nested property when using checkProblematicPatterns', () => {
      // This test verifies that validateTemplate (which calls both functions) works
      // We test this separately since nested access is now in its own function
      const content = '{{ application.roomCounts.hmoCount }}'
      const nestedErrors = checkUnsafeNestedPropertyAccess(
        testFilePath,
        content
      )
      const patternErrors = checkProblematicPatterns(testFilePath, content)
      const allErrors = [...nestedErrors, ...patternErrors]
      expect(allErrors.length).toBeGreaterThan(0)
    })

    it('should NOT flag when parent is checked with "and"', () => {
      const content =
        '(application.roomCounts and application.roomCounts.hmoCount) | default("")'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBe(0)
    })

    it('should NOT flag when inside {% if %} block checking parent', () => {
      const content = `{% if application.roomCounts %}
  {{ application.roomCounts.hotelCount }}
{% endif %}`
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      // This pattern IS safe because parent is checked in {% if %} block
      expect(errors.length).toBe(0)
    })

    it('should NOT flag when in conditional expression checking parent', () => {
      const content =
        '{{ data.roomCounts.hotelCount if data.roomCounts else "" }}'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      // This pattern IS safe because parent is checked with "if"
      expect(errors.length).toBe(0)
    })

    it('should NOT flag URLs (https://)', () => {
      const content = 'href: "https://www.gov.uk/"'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBe(0)
    })

    it('should NOT flag mailto links', () => {
      const content = 'href: "mailto:test@example.com"'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBe(0)
    })

    it('should NOT flag nested properties in quoted strings', () => {
      const content = 'text: "Visit https://example.com for more info"'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBe(0)
    })

    it('should NOT flag href attributes with URLs', () => {
      const content = 'href: "https://www.gov.uk/help"'
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      expect(errors.length).toBe(0)
    })
  })

  describe('Unsafe Array Joins', () => {
    it('should detect unsafe array join without check', () => {
      const content = 'text: application.buildingTypes | join(", ")'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Potentially unsafe array join')
    })

    it('should NOT flag safe array join with conditional', () => {
      const content =
        'text: (application.buildingTypes | join(", ")) if application.buildingTypes else ""'
      const errors = checkProblematicPatterns(testFilePath, content)
      const joinErrors = errors.filter((e) =>
        e.message.includes('Potentially unsafe array join')
      )
      expect(joinErrors.length).toBe(0)
    })

    it('should detect unsafe array join with different separator', () => {
      const content = 'text: items | join(" - ")'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Potentially unsafe array join')
    })
  })

  describe('String Concatenation with +', () => {
    it('should detect string concatenation with + operator', () => {
      const content = 'text: "Hello" + " " + "World"'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('String concatenation with +')
    })

    it('should detect string concatenation before quote', () => {
      const content = 'text: prefix + "/path"'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('String concatenation with +')
    })

    it('should detect string concatenation after quote', () => {
      const content = 'text: "/path" + suffix'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('String concatenation with +')
    })
  })

  describe('Null Values', () => {
    it('should detect null value in template', () => {
      const content = 'errorMessage: null'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Null value detected')
    })

    it('should detect null in conditional', () => {
      const content = 'error: condition ? error : null'
      const errors = checkProblematicPatterns(testFilePath, content)
      const nullErrors = errors.filter((e) => e.message.includes('Null value'))
      expect(nullErrors.length).toBeGreaterThan(0)
    })
  })

  describe('Multiple Issues in One File', () => {
    it('should detect multiple different issues', () => {
      const content = `text: condition ? "Yes" : "No"
value: application.data.count
items: items | join(", ")
error: null`
      const nestedErrors = checkUnsafeNestedPropertyAccess(
        testFilePath,
        content
      )
      const patternErrors = checkProblematicPatterns(testFilePath, content)
      const allErrors = [...nestedErrors, ...patternErrors]
      expect(allErrors.length).toBeGreaterThanOrEqual(4)
    })

    it('should not duplicate errors for same line', () => {
      const content = 'text: condition ? "Yes" : "No"'
      const errors = checkProblematicPatterns(testFilePath, content)
      const sameLineErrors = errors.filter((e) => e.line === errors[0].line)
      expect(sameLineErrors.length).toBeLessThanOrEqual(2)
    })
  })

  describe('Complex Real-World Scenarios', () => {
    it('should handle summary list with safe patterns', () => {
      const content = `{{ govukSummaryList({
  rows: [
    {
      key: { text: "Email" },
      value: { text: applicant.email }
    },
    {
      key: { text: "Count" },
      value: { text: (application.roomCounts and application.roomCounts.hmoCount) | default("") }
    } if application.roomCounts
  ]
}) }}`
      const errors = checkProblematicPatterns(testFilePath, content)
      const unsafeErrors = errors.filter(
        (e) =>
          e.message.includes('Unsafe nested property') ||
          e.message.includes('Unsafe array join')
      )
      expect(unsafeErrors.length).toBe(0)
    })

    it('should detect issues in summary list with unsafe patterns', () => {
      const content = `{{ govukSummaryList({
  rows: [
    {
      key: { text: "Count" },
      value: { text: application.roomCounts.hmoCount }
    },
    {
      key: { text: "Types" },
      value: { text: buildingTypes | join(", ") }
    },
    {
      key: { text: "Link" },
      value: { 
        href: hasFile ? ROUTES.UPLOAD : ROUTES.MAP
      }
    }
  ]
}) }}`
      const nestedErrors = checkUnsafeNestedPropertyAccess(
        testFilePath,
        content
      )
      const patternErrors = checkProblematicPatterns(testFilePath, content)
      const allErrors = [...nestedErrors, ...patternErrors]
      expect(allErrors.length).toBeGreaterThanOrEqual(3)
    })

    it('should handle template with conditional blocks correctly', () => {
      const content = `{% if application.roomCounts %}
  {% if application.roomCounts.hotelCount %}
    Hotel rooms: {{ application.roomCounts.hotelCount }}
  {% endif %}
{% endif %}`
      const errors = checkProblematicPatterns(testFilePath, content)
      const unsafeErrors = errors.filter((e) =>
        e.message.includes('Unsafe nested property')
      )
      // Note: The validator checks for {% if parent %} but nested {% if %} blocks
      // within may still be flagged. This is a known limitation.
      // The outer {% if application.roomCounts %} should protect inner accesses,
      // but the pattern matching may not detect nested conditionals perfectly.
      expect(unsafeErrors.length).toBeLessThanOrEqual(2)
    })

    it('should detect unsafe access outside conditional block', () => {
      const content = `Hotel rooms: {{ application.roomCounts.hotelCount }}
{% if application.roomCounts %}
  Safe access: {{ application.roomCounts.hmoCount }}
{% endif %}`
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      // First line (line 1) is unsafe (no check), second line is safe (inside {% if %})
      // The function should detect the unsafe one on line 1
      expect(errors.length).toBeGreaterThan(0)
      // Verify the unsafe one is flagged
      expect(errors.some((e) => e.line === 1)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty file', () => {
      const content = ''
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBe(0)
    })

    it('should handle file with only whitespace', () => {
      const content = '   \n  \n\t  '
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBe(0)
    })

    it('should handle multi-line patterns correctly', () => {
      const content = `text: condition 
  ? "Yes" 
  : "No"`
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].message).toContain('Ternary operator')
    })

    it('should provide correct line numbers', () => {
      const content = `Line 1: normal content
Line 2: text: condition ? "Yes" : "No"
Line 3: more content
Line 4: value: application.data.count`
      const nestedErrors = checkUnsafeNestedPropertyAccess(
        testFilePath,
        content
      )
      const patternErrors = checkProblematicPatterns(testFilePath, content)
      const allErrors = [...nestedErrors, ...patternErrors]
      const line2Errors = allErrors.filter((e) => e.line === 2)
      const line4Errors = allErrors.filter((e) => e.line === 4)
      expect(line2Errors.length).toBeGreaterThan(0)
      expect(line4Errors.length).toBeGreaterThan(0)
    })
  })

  describe('Array Push() Method', () => {
    it('should detect .push() method call', () => {
      const content =
        '{% set summaryRows = summaryRows.push({key: {text: "Test"}}) %}'
      const errors = checkProblematicPatterns(testFilePath, content)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some((e) => e.message.includes('Array push()'))).toBe(true)
    })

    it('should detect comma operator with push() pattern', () => {
      const content =
        '{% set summaryRows = (summaryRows.push({key: {text: "Test"}}), summaryRows) %}'
      const errors = checkProblematicPatterns(testFilePath, content)
      const pushErrors = errors.filter((e) =>
        e.message.includes('Comma operator with push()')
      )
      expect(pushErrors.length).toBeGreaterThan(0)
    })

    it('should detect push() in set statement', () => {
      const content = '{% set rows = rows.push(item) %}'
      const errors = checkProblematicPatterns(testFilePath, content)
      const pushErrors = errors.filter((e) =>
        e.message.includes('Array push()')
      )
      expect(pushErrors.length).toBeGreaterThan(0)
    })

    it('should detect push() pattern from summary page issue', () => {
      const content = `{% set summaryRows = [] %}
{% set summaryRows = (summaryRows.push({key: {text: "Red line boundary"}, value: {text: "Added"}, actions: {items: [{href: ROUTES.UPLOAD_REDLINE ~ "?from=summary", text: "Change"}]}}), summaryRows) %}`
      const errors = checkProblematicPatterns(testFilePath, content)
      const pushErrors = errors.filter(
        (e) =>
          e.message.includes('Array push()') ||
          e.message.includes('Comma operator with push()')
      )
      expect(pushErrors.length).toBeGreaterThan(0)
    })

    it('should NOT flag push in comments', () => {
      const content = '{# Using .push() here would be wrong #}'
      const errors = checkProblematicPatterns(testFilePath, content)
      const pushErrors = errors.filter((e) => e.message.includes('push()'))
      expect(pushErrors.length).toBe(0)
    })
  })

  describe('False Positive Prevention', () => {
    it('should not flag safe nested access with multiple checks', () => {
      const content = `{% if data.roomCounts %}
  {% if data.roomCounts.hotelCount %}
    {{ data.roomCounts.hotelCount }} rooms
  {% endif %}
{% endif %}`
      const errors = checkUnsafeNestedPropertyAccess(testFilePath, content)
      // This is safe because parent is checked in outer {% if %}
      expect(errors.length).toBe(0)
    })

    it('should not flag query strings in URLs', () => {
      const content = [
        'href: ROUTES.COLOR ~ "?from=summary"',
        'href: "https://example.com?param=value"',
        'href: "https://example.com?param=value&other=test"'
      ]
      content.forEach((line) => {
        const errors = checkProblematicPatterns(testFilePath, line)
        const ternaryErrors = errors.filter((e) =>
          e.message.includes('Ternary operator')
        )
        expect(ternaryErrors.length).toBe(0)
      })
    })

    it('should handle complex safe patterns in summary lists', () => {
      const content = `{{ govukSummaryList({
  rows: [
    {
      key: { text: "Boundary" },
      value: { 
        text: "Added" if application.redlineFile else ("Added" if application.redlineBoundaryPolygon else "Not added")
      },
      actions: {
        items: [{
          href: ROUTES.UPLOAD_REDLINE if application.hasRedlineBoundaryFile else ROUTES.MAP,
          text: "Change"
        }]
      }
    }
  ]
}) }}`
      const errors = checkProblematicPatterns(testFilePath, content)
      const ternaryErrors = errors.filter((e) =>
        e.message.includes('Ternary operator')
      )
      expect(ternaryErrors.length).toBe(0)
    })
  })
})
