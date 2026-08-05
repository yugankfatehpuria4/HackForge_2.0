const mongoose = require('mongoose');
const geminiService = require('../services/geminiService');
const Project = require('../models/Project');

const generateCode = async (req, res) => {
  console.log('🎯 Code generation request received:', {
    hasPrompt: !!req.body.prompt,
    promptLength: req.body.prompt?.length || 0
  });

  try {
    const { prompt, saveToHistory = true, projectTitle } = req.body;

    if (!prompt) {
      console.log('❌ No prompt provided');
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
        error: 'MISSING_PROMPT'
      });
    }

    if (prompt.length < 10) {
      console.log('❌ Prompt too short');
      return res.status(400).json({
        success: false,
        message: 'Please provide a more detailed description (at least 10 characters)',
        error: 'PROMPT_TOO_SHORT'
      });
    }

    console.log('🤖 Generating code with Gemini...');
    const startTime = Date.now();
    const generatedCode = await geminiService.generateCode(prompt);
    const generationTime = Date.now() - startTime;
    console.log('✅ Code generated successfully');

    // Auto-save to project history if requested.
    // Skip entirely when there is no database, otherwise Mongoose buffers the
    // save and adds 10s to a request that already succeeded.
    // Only save when the caller is actually signed in — optionalAuth sets
    // req.userId from a verified token. Anonymous visitors can still generate
    // code, they just get nothing written to a history that isn't theirs.
    let savedProject = null;
    if (saveToHistory && req.userId && mongoose.connection.readyState === 1) {
      try {
        const userId = req.userId;
        const title = projectTitle || `Generated from: ${prompt.substring(0, 50)}...`;
        
        // Extract language and framework from the prompt or generated code
        const framework = extractFramework(prompt, generatedCode);
        const tags = extractTags(prompt, generatedCode);

        const project = new Project({
          userId,
          title,
          prompt,
          generatedCode,
          framework,
          tags,
          metadata: {
            tokensUsed: Math.ceil(generatedCode.length / 4), // Rough estimate
            generationTime,
            model: 'gemini-2.0-flash'
          }
        });

        savedProject = await project.save();
        console.log('💾 Project saved to history:', savedProject._id);
      } catch (saveError) {
        console.error('⚠️ Failed to save project to history:', saveError.message);
        // Don't fail the request if saving fails
      }
    }

    res.json({
      success: true,
      code: generatedCode,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      projectId: savedProject?._id,
      generationTime
    });
  } catch (error) {
    console.error('❌ Code generation error:', error.message);
    
    let errorMessage = 'Failed to generate code';
    let errorCode = 'GENERATION_ERROR';
    
    // Map upstream failures to something the user can act on. Matching only
    // on the words "API key" and "quota" let Google's own 401 text — which
    // says neither — fall through to a bare "Failed to generate code".
    let status = 500;

    if (error.message.includes('Gemini API key not configured')) {
      errorMessage = 'Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env';
      errorCode = 'GEMINI_NOT_CONFIGURED';
    } else if (error.message.includes('(401)') || error.message.includes('API_KEY_INVALID') || error.message.includes('invalid authentication credentials')) {
      errorMessage =
        'Gemini rejected the API key. Check GEMINI_API_KEY in backend/.env has no quotes or trailing spaces, and that it is a key from https://aistudio.google.com/apikey';
      errorCode = 'INVALID_API_KEY';
      status = 502;
    } else if (error.message.includes('(429)') || error.message.toLowerCase().includes('quota')) {
      errorMessage =
        'Gemini quota exceeded. If the limit shows as 0, the Generative Language API is probably not enabled for this key’s Google Cloud project.';
      errorCode = 'QUOTA_EXCEEDED';
      status = 429;
    } else if (error.message.includes('safety filters')) {
      errorMessage = error.message;
      errorCode = 'PROMPT_BLOCKED';
      status = 400;
    } else if (error.message.includes('API key')) {
      errorMessage = 'Invalid Gemini API key. Please check your API key in backend/.env';
      errorCode = 'INVALID_API_KEY';
      status = 502;
    }

    res.status(status).json({
      success: false,
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions to extract metadata from prompt and code
const extractLanguage = (prompt, code) => {
  const promptLower = prompt.toLowerCase();
  const codeLower = code.toLowerCase();
  
  if (promptLower.includes('python') || codeLower.includes('def ') || codeLower.includes('import ')) {
    return 'python';
  } else if (promptLower.includes('javascript') || promptLower.includes('js') || codeLower.includes('function ') || codeLower.includes('const ')) {
    return 'javascript';
  } else if (promptLower.includes('typescript') || promptLower.includes('ts') || codeLower.includes(': string') || codeLower.includes(': number')) {
    return 'typescript';
  } else if (promptLower.includes('react') || codeLower.includes('jsx') || codeLower.includes('react')) {
    return 'javascript';
  } else if (promptLower.includes('html') || codeLower.includes('<!doctype') || codeLower.includes('<html')) {
    return 'html';
  } else if (promptLower.includes('css') || codeLower.includes('{') && codeLower.includes(':')) {
    return 'css';
  } else if (promptLower.includes('java') || codeLower.includes('public class')) {
    return 'java';
  } else if (promptLower.includes('c++') || codeLower.includes('#include')) {
    return 'cpp';
  } else if (promptLower.includes('c#') || codeLower.includes('using System')) {
    return 'csharp';
  } else if (promptLower.includes('php') || codeLower.includes('<?php')) {
    return 'php';
  } else if (promptLower.includes('ruby') || codeLower.includes('def ') && codeLower.includes('end')) {
    return 'ruby';
  } else if (promptLower.includes('go') || codeLower.includes('package main')) {
    return 'go';
  } else if (promptLower.includes('rust') || codeLower.includes('fn ')) {
    return 'rust';
  } else if (promptLower.includes('swift') || codeLower.includes('import Swift')) {
    return 'swift';
  } else if (promptLower.includes('kotlin') || codeLower.includes('fun ')) {
    return 'kotlin';
  }
  
  return 'javascript'; // Default
};

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
  if (promptLower.includes('authentication') || promptLower.includes('auth') || codeLower.includes('login') || codeLower.includes('jwt')) {
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

module.exports = {
  generateCode
};