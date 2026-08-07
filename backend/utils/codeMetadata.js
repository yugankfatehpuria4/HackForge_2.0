/**
 * Heuristics for labelling a generated project.
 *
 * These used to live inside codeController.js, so only the auto-save path could
 * use them. projectController.createProject fell back to a hardcoded 'react',
 * which meant every manually saved project was labelled React no matter what
 * was actually generated.
 */

const extractFramework = (prompt, code) => {
  const promptLower = prompt.toLowerCase();
  const codeLower = code.toLowerCase();
  
  if (promptLower.includes('react') || codeLower.includes('react') || codeLower.includes('jsx')) {
    return 'react';
  } else if (promptLower.includes('next.js') || promptLower.includes('nextjs') || codeLower.includes('next')) {
    return 'nextjs';
  } else if (promptLower.includes('vue') || codeLower.includes('vue')) {
    return 'vue';
  } else if (promptLower.includes('angular') || codeLower.includes('angular')) {
    return 'angular';
  } else if (promptLower.includes('express') || codeLower.includes('express')) {
    return 'express';
  } else if (promptLower.includes('django') || codeLower.includes('django')) {
    return 'django';
  } else if (promptLower.includes('flask') || codeLower.includes('flask')) {
    return 'flask';
  } else if (promptLower.includes('laravel') || codeLower.includes('laravel')) {
    return 'laravel';
  } else if (promptLower.includes('spring') || codeLower.includes('spring')) {
    return 'spring';
  } else if (promptLower.includes('fastapi') || codeLower.includes('fastapi')) {
    return 'fastapi';
  }
  
  return 'react'; // Default
};

const extractTags = (prompt, code) => {
  const tags = [];
  const promptLower = prompt.toLowerCase();
  const codeLower = code.toLowerCase();
  
  // Common tags based on content
  if (promptLower.includes('api') || codeLower.includes('fetch') || codeLower.includes('axios')) {
    tags.push('api');
  }
  if (promptLower.includes('database') || promptLower.includes('db') || codeLower.includes('mongodb') || codeLower.includes('sql')) {
    tags.push('database');
  }
  // 'login' was checked against the generated code only, unlike every other
  // rule here, so "build a login page" produced no authentication tag.
  if (promptLower.includes('authentication') || promptLower.includes('auth') || promptLower.includes('login') || codeLower.includes('login') || codeLower.includes('jwt')) {
    tags.push('authentication');
  }
  if (promptLower.includes('ui') || promptLower.includes('interface') || promptLower.includes('component')) {
    tags.push('ui');
  }
  if (promptLower.includes('responsive') || promptLower.includes('mobile')) {
    tags.push('responsive');
  }
  if (promptLower.includes('animation') || codeLower.includes('animation') || codeLower.includes('transition')) {
    tags.push('animation');
  }
  if (promptLower.includes('form') || codeLower.includes('form') || codeLower.includes('input')) {
    tags.push('form');
  }
  if (promptLower.includes('todo') || promptLower.includes('task')) {
    tags.push('todo');
  }
  if (promptLower.includes('ecommerce') || promptLower.includes('shop')) {
    tags.push('ecommerce');
  }
  if (promptLower.includes('blog') || promptLower.includes('cms')) {
    tags.push('blog');
  }
  
  return tags;
};

module.exports = { extractFramework, extractTags };
