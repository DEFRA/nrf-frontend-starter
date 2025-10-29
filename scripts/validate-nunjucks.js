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

// Patterns that may cause runtime errors or are not recommended
const problematicPatterns = [
  {
    // Match ternary operator pattern: variable ? value : value
    // Exclude URLs and other common false positives
    pattern: /\b(\w+)\s*\?\s*[^:}]+:\s*[^}]+/g,
    message:
      'Ternary operator (? :) detected. Nunjucks does not support ternary operators. Use "value if condition else defaultValue" syntax instead.',
    exclude: [
      /https?:\/\//, // URLs
      /mailto:/, // Email links
      /[\w\s]+\?from=/, // Query strings
      /\?[a-z]+=/ // Query parameters
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
    // Match nested property access like application.roomCounts.hmoCount
    // Only match when it's NOT in a string literal or URL
    // Pattern looks for: word.word.word where word starts with lowercase (variable names)
    // Excludes URLs by requiring it to be inside {{ }} or : (macro params)
    pattern:
      /(?:{{|:)\s*([a-z][a-zA-Z0-9_]*)\.([a-zA-Z0-9_]*)\.([a-zA-Z0-9_]*)(?!\s+and\s+\1\.\2)/g,
    message:
      'Unsafe nested property access detected (e.g., obj.prop1.prop2). Check parent object exists first using "obj.prop1 and obj.prop1.prop2" or initialize parent in controller.',
    exclude: [/https?:\/\//, /mailto:/] // URLs
  },
  {
    // Match array.join without safety check, but allow safe patterns
    // Only flag if NOT already protected with "if array" check
    pattern: /\b(\w+)\s*\|\s*join\s*\([^)]+\)(?!\s+if\s+\1|\)\s+if)/g,
    message:
      "Potentially unsafe array join. Consider checking array exists first: \"(array | join(', ')) if array else ''\""
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

      // Additional context-aware checks for nested property access
      if (pattern.source.includes('\\w*\\.\\w*\\.\\w*')) {
        // Skip if it's a URL pattern (http://, https://, mailto:)
        if (/https?:\/\/|mailto:/.test(line)) {
          continue
        }

        // Skip if it's in a string literal (quoted string, not a template expression)
        const beforeMatch = line.substring(0, line.indexOf(match[0]))
        // Check if it's inside a quoted string (before has odd number of quotes)
        const beforeQuotes = (beforeMatch.match(/["']/g) || []).length
        if (beforeQuotes % 2 === 1) {
          continue // Inside a quoted string literal
        }
        // Check if it's part of a URL in an attribute (href="https://...")
        if (
          /(href|src|action|url|link)\s*[:=]\s*["']?\s*https?/.test(beforeMatch)
        ) {
          continue
        }

        const lineContext = content.substring(
          Math.max(0, match.index - 200),
          Math.min(content.length, match.index + match[0].length + 200)
        )
        const parentPath = match[1] + '.' + match[2]
        const fullPath = match[1] + '.' + match[2] + '.' + match[3]

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
          continue
        }

        // Skip if it's inside a conditional block checking the parent
        // e.g., {% if data.roomCounts %} ... {{ data.roomCounts.hotelCount }}
        if (
          lineContext.includes('{% if ' + parentPath) ||
          lineContext.match(
            new RegExp(`{%\\s+if\\s+${parentPath.replace('.', '\\.')}`, 'i')
          )
        ) {
          continue
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
          continue
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

  // Check for problematic patterns first
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
