const prettier = require('prettier');
const { ESLint } = require('eslint');

class CodeProcessor {
  constructor() {
    this.eslint = new ESLint({
      useEslintrc: false,
      overrideConfig: {
        extends: ['eslint:recommended'],
        env: {
          browser: true,
          es2021: true,
          node: true,
        },
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        rules: {
          'no-eval': 'error',
          'no-implied-eval': 'error',
          'no-new-func': 'error',
          'no-script-url': 'error',
          'no-unsafe-finally': 'error',
          'no-unsafe-negation': 'error',
        },
      },
    });
  }

  /**
   * Process generated code with linting, formatting, and security review
   * @param {string} code - The generated code to process
   * @param {string} framework - The framework used (react, nextjs, vue, etc.)
   * @returns {Object} Processed code with metadata
   */
  async processCode(code, framework = 'javascript') {
    try {
      const results = {
        originalCode: code,
        processedCode: code,
        framework: framework,
        issues: [],
        securityWarnings: [],
        suggestions: [],
        metadata: {
          lineCount: this.countLines(code),
          characterCount: code.length,
          hasSecurityIssues: false,
          lintScore: 100,
        },
      };

      // Detect code language/framework
      const detectedFramework = this.detectFramework(code);
      if (detectedFramework !== framework) {
        results.framework = detectedFramework;
        results.suggestions.push(`Detected framework: ${detectedFramework}`);
      }

      // Security review
      const securityIssues = this.securityReview(code);
      results.securityWarnings = securityIssues;
      results.metadata.hasSecurityIssues = securityIssues.length > 0;

      // Format code based on framework
      try {
        results.processedCode = await this.formatCode(code, detectedFramework);
      } catch (error) {
        results.issues.push(`Formatting failed: ${error.message}`);
      }

      // Lint code
      try {
        const lintResults = await this.lintCode(results.processedCode, detectedFramework);
        results.issues = results.issues.concat(lintResults.issues);
        results.metadata.lintScore = lintResults.score;
      } catch (error) {
        results.issues.push(`Linting failed: ${error.message}`);
      }

      // Generate suggestions
      results.suggestions = results.suggestions.concat(
        this.generateSuggestions(results.processedCode, detectedFramework, results.issues)
      );

      return results;
    } catch (error) {
      console.error('Code processing error:', error);
      return {
        originalCode: code,
        processedCode: code,
        framework: framework,
        issues: [`Processing error: ${error.message}`],
        securityWarnings: [],
        suggestions: [],
        metadata: {
          lineCount: this.countLines(code),
          characterCount: code.length,
          hasSecurityIssues: false,
          lintScore: 0,
        },
      };
    }
  }

  /**
   * Detect the framework/language of the code
   */
  detectFramework(code) {
    const lowerCode = code.toLowerCase();
    
    if (lowerCode.includes('react') || lowerCode.includes('jsx') || lowerCode.includes('useState')) {
      return 'react';
    }
    if (lowerCode.includes('next') || lowerCode.includes('pages') || lowerCode.includes('app/')) {
      return 'nextjs';
    }
    if (lowerCode.includes('vue') || lowerCode.includes('v-bind') || lowerCode.includes('v-model')) {
      return 'vue';
    }
    if (lowerCode.includes('python') || lowerCode.includes('def ') || lowerCode.includes('import ')) {
      return 'python';
    }
    if (lowerCode.includes('angular') || lowerCode.includes('@component') || lowerCode.includes('ng')) {
      return 'angular';
    }
    if (lowerCode.includes('svelte') || lowerCode.includes('{#if') || lowerCode.includes('{#each')) {
      return 'svelte';
    }
    
    return 'javascript';
  }

  /**
   * Security review of the code
   */
  securityReview(code) {
    const warnings = [];
    const lowerCode = code.toLowerCase();

    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: 'eval(', message: 'Use of eval() is dangerous and should be avoided' },
      { pattern: 'new function', message: 'Dynamic function creation can be a security risk' },
      { pattern: 'innerhtml', message: 'innerHTML can lead to XSS attacks, consider textContent' },
      { pattern: 'document.write', message: 'document.write can be dangerous in certain contexts' },
      { pattern: 'settimeout', message: 'setTimeout with user input can be a security risk' },
      { pattern: 'setinterval', message: 'setInterval with user input can be a security risk' },
      { pattern: 'localstorage', message: 'Be careful with localStorage, ensure data validation' },
      { pattern: 'sessionstorage', message: 'Be careful with sessionStorage, ensure data validation' },
    ];

    dangerousPatterns.forEach(({ pattern, message }) => {
      if (lowerCode.includes(pattern)) {
        warnings.push(message);
      }
    });

    // Check for potential SQL injection patterns (if applicable)
    if (lowerCode.includes('sql') || lowerCode.includes('query')) {
      if (lowerCode.includes('${') && lowerCode.includes('}')) {
        warnings.push('Potential SQL injection risk with template literals in queries');
      }
    }

    // Check for potential XSS patterns
    if (lowerCode.includes('innerhtml') || lowerCode.includes('outerhtml')) {
      warnings.push('Potential XSS risk with innerHTML/outerHTML, consider textContent');
    }

    return warnings;
  }

  /**
   * Format code using Prettier
   */
  async formatCode(code, framework) {
    try {
      const config = this.getPrettierConfig(framework);
      return await prettier.format(code, config);
    } catch (error) {
      // If formatting fails, return original code
      console.warn('Code formatting failed:', error.message);
      return code;
    }
  }

  /**
   * Get Prettier configuration for specific framework
   */
  getPrettierConfig(framework) {
    const baseConfig = {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
      trailingComma: 'es5',
    };

    switch (framework) {
      case 'react':
      case 'nextjs':
        return {
          ...baseConfig,
          jsxSingleQuote: true,
          jsxBracketSameLine: false,
        };
      case 'vue':
        return {
          ...baseConfig,
          vueIndentScriptAndStyle: true,
        };
      case 'python':
        return {
          ...baseConfig,
          parser: 'python',
          tabWidth: 4,
        };
      default:
        return baseConfig;
    }
  }

  /**
   * Lint code using ESLint
   */
  async lintCode(code, framework) {
    try {
      const results = await this.eslint.lintText(code);
      const issues = [];
      let errorCount = 0;
      let warningCount = 0;

      if (results[0] && results[0].messages) {
        results[0].messages.forEach(message => {
          const issue = {
            line: message.line,
            column: message.column,
            severity: message.severity === 2 ? 'error' : 'warning',
            message: message.message,
            ruleId: message.ruleId,
          };
          issues.push(issue);

          if (message.severity === 2) errorCount++;
          else warningCount++;
        });
      }

      // Calculate lint score (100 - errors * 10 - warnings * 2)
      const score = Math.max(0, 100 - (errorCount * 10) - (warningCount * 2));

      return { issues, score, errorCount, warningCount };
    } catch (error) {
      console.warn('Code linting failed:', error.message);
      return { issues: [], score: 0, errorCount: 0, warningCount: 0 };
    }
  }

  /**
   * Generate improvement suggestions
   */
  generateSuggestions(code, framework, issues) {
    const suggestions = [];

    // Framework-specific suggestions
    switch (framework) {
      case 'react':
        if (!code.includes('useState') && !code.includes('useEffect')) {
          suggestions.push('Consider using React hooks for state management');
        }
        if (code.includes('class ') && code.includes('extends')) {
          suggestions.push('Consider converting class component to functional component with hooks');
        }
        break;
      case 'nextjs':
        if (code.includes('pages/') && !code.includes('getStaticProps') && !code.includes('getServerSideProps')) {
          suggestions.push('Consider adding data fetching methods for better SEO');
        }
        break;
      case 'vue':
        if (code.includes('data()') && !code.includes('computed')) {
          suggestions.push('Consider using computed properties for derived state');
        }
        break;
    }

    // General suggestions based on issues
    if (issues.length > 0) {
      suggestions.push('Fix linting issues to improve code quality');
    }

    // Performance suggestions
    if (code.includes('map(') && code.includes('filter(')) {
      suggestions.push('Consider combining map and filter operations for better performance');
    }

    if (code.includes('setTimeout') || code.includes('setInterval')) {
      suggestions.push('Remember to clear timeouts/intervals to prevent memory leaks');
    }

    return suggestions;
  }

  /**
   * Count lines in code
   */
  countLines(code) {
    return code.split('\n').length;
  }

  /**
   * Explain code using AI (placeholder for future implementation)
   */
  async explainCode(code, framework) {
    // This would integrate with Gemini AI to explain the code
    // For now, return a basic explanation
    return {
      summary: `This is a ${framework} application with ${this.countLines(code)} lines of code.`,
      keyFeatures: this.extractKeyFeatures(code, framework),
      complexity: this.assessComplexity(code),
    };
  }

  /**
   * Extract key features from code
   */
  extractKeyFeatures(code, framework) {
    const features = [];
    const lowerCode = code.toLowerCase();

    if (lowerCode.includes('useState') || lowerCode.includes('state')) features.push('State Management');
    if (lowerCode.includes('useEffect') || lowerCode.includes('effect')) features.push('Side Effects');
    if (lowerCode.includes('async') || lowerCode.includes('await')) features.push('Async Operations');
    if (lowerCode.includes('fetch') || lowerCode.includes('axios')) features.push('API Integration');
    if (lowerCode.includes('router') || lowerCode.includes('navigate')) features.push('Routing');
    if (lowerCode.includes('form') || lowerCode.includes('input')) features.push('Form Handling');
    if (lowerCode.includes('css') || lowerCode.includes('styled')) features.push('Styling');

    return features;
  }

  /**
   * Assess code complexity
   */
  assessComplexity(code) {
    const lines = this.countLines(code);
    const functions = (code.match(/function|=>/g) || []).length;
    const conditionals = (code.match(/if|else|switch|case/g) || []).length;
    const loops = (code.match(/for|while|do|forEach|map|filter/g) || []).length;

    let complexity = 'Low';
    if (lines > 100 || functions > 10 || conditionals > 20 || loops > 10) {
      complexity = 'High';
    } else if (lines > 50 || functions > 5 || conditionals > 10 || loops > 5) {
      complexity = 'Medium';
    }

    return {
      level: complexity,
      metrics: { lines, functions, conditionals, loops },
    };
  }
}

module.exports = CodeProcessor; 