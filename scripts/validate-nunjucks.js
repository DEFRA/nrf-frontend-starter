#!/usr/bin/env node
/**
 * Nunjucks template validator
 * Validates Nunjucks syntax by attempting to compile all .njk files
 * This catches syntax errors that djLint won't catch (runtime errors, undefined filters, etc.)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

// Configure Nunjucks same way as the app
const nunjucksEnvironment = nunjucks.configure(
  [
    path.resolve(projectRoot, 'node_modules/govuk-frontend/dist/'),
    path.resolve(projectRoot, 'src/server/common/templates'),
    path.resolve(projectRoot, 'src/server/common/components')
  ],
  {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
    watch: false,
    noCache: true
  }
)

function findNunjucksFiles(
  dir = path.join(projectRoot, 'src', 'server'),
  fileList = []
) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findNunjucksFiles(filePath, fileList)
    } else if (file.endsWith('.njk')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

/**
 * Validates nested property access patterns in Nunjucks templates.
 * Checks for unsafe access like obj.prop1.prop2 without checking if prop1 exists first.
 *
 * @param {string} content - The template content to validate
 * @param {number} matchIndex - The index where the nested property was found
 * @param {Array} matchGroups - The regex match groups [fullMatch, obj, prop1, prop2]
 * @param {string} line - The line containing the match
 * @returns {boolean} - True if the nested property access is unsafe, false if it's safe
 */
function isUnsafeNestedPropertyAccess(content, matchIndex, matchGroups, line) {
  const [, obj, prop1, prop2] = matchGroups
  const parentPath = `${obj}.${prop1}`
  const fullPath = `${obj}.${prop1}.${prop2}`

  // Skip if it's a URL pattern (http://, https://, mailto:)
  if (/https?:\/\/|mailto:/.test(line)) {
    return false
  }

  // Skip if it's in a string literal (quoted string, not a template expression)
  const beforeMatch = line.substring(0, line.indexOf(matchGroups[0]))
  const beforeQuotes = (beforeMatch.match(/["']/g) || []).length
  if (beforeQuotes % 2 === 1) {
    return false // Inside a quoted string literal
  }

  // Skip if it's part of a URL in an attribute (href="https://...")
  if (/(href|src|action|url|link)\s*[:=]\s*["']?\s*https?/.test(beforeMatch)) {
    return false
  }

  // Get context around the match to check for safety checks
  const lineContext = content.substring(
    Math.max(0, matchIndex - 200),
    Math.min(content.length, matchIndex + matchGroups[0].length + 200)
  )

  // Skip if parent is already checked with 'and'
  if (
    lineContext.includes(' and ') &&
    (lineContext.match(
      new RegExp(
        `${parentPath.replace('.', '\\.')}\\s+and\\s+${fullPath.replace(/\./g, '\\.')}`,
        'i'
      )
    ) ||
      lineContext.includes('and ' + fullPath))
  ) {
    return false
  }

  // Skip if it's inside a conditional block checking the parent
  // e.g., {% if data.roomCounts %} ... {{ data.roomCounts.hotelCount }}
  // Only check if the {% if %} appears BEFORE the nested property access
  const ifBlockMatch = lineContext.match(
    new RegExp(`{%\\s+if\\s+${parentPath.replace('.', '\\.')}`, 'i')
  )
  if (ifBlockMatch) {
    const ifBlockIndex = lineContext.indexOf(ifBlockMatch[0])
    const nestedAccessIndex =
      matchGroups[0].length > 0
        ? lineContext.indexOf(matchGroups[0])
        : lineContext.length
    // Only skip if {% if %} comes before the nested property access
    if (ifBlockIndex < nestedAccessIndex) {
      return false
    }
  }

  // Skip if it's in a conditional expression checking the parent
  // e.g., {{ obj.prop.nested if obj.prop }}
  if (
    lineContext.match(
      new RegExp(
        `${fullPath.replace(/\./g, '\\.')}\\s+if\\s+${parentPath.replace('.', '\\.')}`,
        'i'
      )
    )
  ) {
    return false
  }

  // Skip if accessing specific property in conditional (like data.roomCounts.hotelCount if data.roomCounts.hotelCount)
  if (
    lineContext.match(
      new RegExp(
        `${fullPath.replace(/\./g, '\\.')}\\s+if\\s+${fullPath.replace(/\./g, '\\.')}`,
        'i'
      )
    )
  ) {
    return false
  }

  return true
}

/**
 * Detects unsafe nested property access patterns in Nunjucks templates.
 * Looks for patterns like obj.prop1.prop2 that aren't properly guarded.
 *
 * @param {string} filePath - The file path being validated
 * @param {string} content - The template content
 * @returns {Array} - Array of error objects
 */
export function checkUnsafeNestedPropertyAccess(filePath, content) {
  const errors = []
  const relativePath = path.relative(projectRoot, filePath)
  const lines = content.split('\n')

  // Pattern to match nested property access: obj.prop1.prop2
  // Matches when inside {{ }} or : (macro params)
  // Excludes cases where parent is checked with 'and'
  const pattern =
    /(?:{{|:)\s*([a-z][a-zA-Z0-9_]*)\.([a-zA-Z0-9_]*)\.([a-zA-Z0-9_]*)(?!\s+and\s+\1\.\2)/g

  let match
  const seenLines = new Set()

  while ((match = pattern.exec(content)) !== null) {
    const lineNumber = content.substring(0, match.index).split('\n').length
    const line = lines[lineNumber - 1]
    const lineKey = `${lineNumber}:nested-property`

    // Skip if we've already reported this line
    if (seenLines.has(lineKey)) {
      continue
    }
    seenLines.add(lineKey)

    // Skip URLs
    if (/https?:\/\//.test(line) || /mailto:/.test(line)) {
      continue
    }

    // Check if this nested property access is unsafe
    if (isUnsafeNestedPropertyAccess(content, match.index, match, line)) {
      errors.push({
        file: relativePath,
        line: lineNumber,
        message:
          'Unsafe nested property access detected (e.g., obj.prop1.prop2). Check parent object exists first using "obj.prop1 and obj.prop1.prop2" or initialize parent in controller.',
        code: line.trim(),
        type: 'pattern'
      })
    }
  }

  return errors
}

// Patterns that may cause runtime errors or are not recommended
const problematicPatterns = [
  {
    /**
     * Match ternary operator pattern: variable ? value : value
     *
     * This regex attempts to find usage of the JavaScript ternary operator in Nunjucks templates,
     * which is not supported. Nunjucks uses "value if condition else defaultValue" syntax instead.
     *
     * Pattern breakdown:
     * - \b(\w+) - Word boundary followed by a word (variable/condition)
     * - \s* - Optional whitespace
     * - \? - Question mark (ternary operator)
     * - \s* - Optional whitespace
     * - [^:}]+ - One or more characters that aren't ':' or '}' (the "true" value)
     * - : - Colon separator
     * - \s* - Optional whitespace
     * - [^}]+ - One or more characters that aren't '}' (the "false" value)
     *
     * The pattern is intentionally broad to catch most ternary operator usage, but can have
     * false positives in URLs, query strings, and other contexts. These are handled by the
     * exclude patterns below.
     *
     * Example matches:
     * - foo ? 'bar' : 'baz'
     * - user.isAdmin ? 'Admin' : 'User'
     * - condition ? value1 : value2
     *
     * Example false positives (excluded):
     * - https://example.com/?from=foo:bar (URL pattern)
     * - mailto:test@example.com?subject=foo (mailto link)
     * - href: ROUTES.PAGE ~ "?from=summary" (query string)
     */
    pattern: /\b(\w+)\s*\?\s*[^:}]+:\s*[^}]+/g,
    message:
      'Ternary operator (? :) detected. Nunjucks does not support ternary operators. Use "value if condition else defaultValue" syntax instead.',
    exclude: [
      /https?:\/\//, // URLs with http:// or https://
      /mailto:/, // Email links
      /[\w\s]+\?from=/, // Query strings like "?from=summary"
      /\?[a-z]+=/ // Query parameters like "?param=value"
    ]
  },
  {
    pattern: /\+\s*["'`]/g,
    message:
      'String concatenation with + detected. Use ~ (tilde) operator for string concatenation in Nunjucks.'
  },
  {
    pattern: /["'`]\s*\+/g,
    message:
      'String concatenation with + detected. Use ~ (tilde) operator for string concatenation in Nunjucks.'
  },
  {
    pattern: /:\s*null\b/g,
    message:
      'Null value detected. Avoid using null in Nunjucks - use conditional syntax like "value if condition" instead.'
  },
  {
    // Match array.join without safety check, but allow safe patterns
    // Only flag if NOT already protected with "if array" check
    pattern: /\b(\w+)\s*\|\s*join\s*\([^)]+\)(?!\s+if\s+\1|\)\s+if)/g,
    message:
      "Potentially unsafe array join. Consider checking array exists first: \"(array | join(', ')) if array else ''\""
  },
  {
    // Match .push() method calls - Nunjucks doesn't support JavaScript array methods
    // Pattern matches: variable.push(...)
    pattern: /\b([a-z][a-zA-Z0-9_]*)\s*\.\s*push\s*\(/g,
    message:
      'Array push() method detected. Nunjucks does not support JavaScript array methods like .push(). Build arrays inline with conditional syntax like "} if condition," instead.',
    exclude: [
      /\/\/.*\.push/, // Comments
      /\/\*[\s\S]*?\.push[\s\S]*?\*\// // Block comments
    ]
  },
  {
    // Match comma operator pattern used with push: (array.push(...), array)
    // This pattern often indicates an attempt to use JavaScript-style array mutation
    pattern: /\(\s*([a-z][a-zA-Z0-9_]*)\s*\.\s*push\s*\([^)]+\)\s*,\s*\1\s*\)/g,
    message:
      'Comma operator with push() detected. This JavaScript pattern does not work in Nunjucks. Build arrays inline with conditional row syntax: "} if condition," or prepare the array in the controller.'
  }
]

export function checkProblematicPatterns(filePath, content) {
  const errors = []
  const lines = content.split('\n')
  const relativePath = path.relative(projectRoot, filePath)

  problematicPatterns.forEach(({ pattern, message }) => {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    const seenLines = new Set()

    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length
      const line = lines[lineNumber - 1]

      // Skip if we've already reported this line (for patterns that match multiple times)
      const lineKey = `${lineNumber}:${message}`
      if (seenLines.has(lineKey)) {
        continue
      }
      seenLines.add(lineKey)

      // Skip if this pattern has exclude rules and line matches exclusions
      if (pattern.exclude) {
        const shouldExclude = pattern.exclude.some((excludePattern) =>
          excludePattern.test(line)
        )
        if (shouldExclude) {
          continue
        }
      }

      errors.push({
        file: relativePath,
        line: lineNumber,
        message,
        code: line.trim(),
        type: 'pattern'
      })
    }
  })

  return errors
}

function validateTemplate(filePath) {
  const errors = []
  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(projectRoot, filePath)

  // Check for unsafe nested property access (uses specialized validation)
  const nestedPropertyErrors = checkUnsafeNestedPropertyAccess(
    filePath,
    content
  )
  errors.push(...nestedPropertyErrors)

  // Check for other problematic patterns
  const patternErrors = checkProblematicPatterns(filePath, content)
  errors.push(...patternErrors)

  try {
    // Try to compile the template to catch syntax errors
    nunjucks.compile(content, nunjucksEnvironment, filePath)
  } catch (error) {
    // Extract line number from error message
    const lineNumber =
      error.lineno ||
      error.line ||
      error.message.match(/line (\d+)/i)?.[1] ||
      error.message.match(/\[Line (\d+)/i)?.[1] ||
      'unknown'

    errors.push({
      file: relativePath,
      line: lineNumber,
      message: error.message,
      type: 'syntax'
    })
  }

  return errors
}

function main() {
  const files = findNunjucksFiles()
  const allErrors = []

  console.log(`\n🔍 Validating ${files.length} Nunjucks template(s)...\n`)

  for (const file of files) {
    const errors = validateTemplate(file)
    if (Array.isArray(errors) && errors.length > 0) {
      allErrors.push(...errors)
    }
  }

  if (allErrors.length === 0) {
    console.log('✅ All templates compiled successfully!\n')
    process.exit(0)
  } else {
    console.log(`❌ Found ${allErrors.length} error(s):\n`)
    allErrors.forEach(({ file, line, message, code, type }) => {
      const icon = type === 'syntax' ? '🔴' : '⚠️'
      console.log(`  ${icon} ${file}:${line}`)
      console.log(`     ${message}`)
      if (code) {
        console.log(
          `     Code: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`
        )
      }
      console.log()
    })
    console.log('💡 Common fixes:')
    console.log(
      '   • Ternary operators: Replace "x ? y : z" with "y if x else z"'
    )
    console.log('   • Use ~ instead of + for string concatenation')
    console.log(
      '   • Nested properties: Check parent exists first - "(obj.prop and obj.prop.nested) | default(\'\')"'
    )
    console.log(
      "   • Array joins: Check array exists - \"(array | join(', ')) if array else ''\""
    )
    console.log(
      '   • Array push(): Don\'t use .push() - build arrays inline with "} if condition," syntax or prepare in controller'
    )
    console.log(
      '   • Use "value if condition" instead of null values or ternary operators\n'
    )
    process.exit(1)
  }
}

// Only run main if this file is executed directly, not imported
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main()
  } catch (error) {
    console.error('❌ Validation failed:', error)
    process.exit(1)
  }
}
