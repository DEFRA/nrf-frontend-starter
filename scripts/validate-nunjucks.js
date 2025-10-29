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
    pattern: /\?[^}]*:[^}]*\?/g,
    message:
      'Nested ternary operators detected. These can cause unexpected behavior. Use if/else blocks or move logic to controller.'
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
  }
]

function checkProblematicPatterns(filePath, content) {
  const errors = []
  const lines = content.split('\n')
  const relativePath = path.relative(projectRoot, filePath)

  problematicPatterns.forEach(({ pattern, message }) => {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length
      const line = lines[lineNumber - 1]
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
    console.log('   • Use ~ instead of + for string concatenation')
    console.log(
      '   • Avoid ternary operators in templates - use if/else or move logic to controller'
    )
    console.log('   • Use "value if condition" instead of null values\n')
    process.exit(1)
  }
}

try {
  main()
} catch (error) {
  console.error('❌ Validation failed:', error)
  process.exit(1)
}
