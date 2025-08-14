"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Download, Save, Loader2, CheckCircle, Bookmark, BookmarkCheck, FileText, FolderOpen, Github, Package } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

interface CodeOutputProps {
  code: string;
  isGenerating: boolean;
  prompt: string;
  projectTitle: string;
  projectId?: string;
  user: any;
}

export function CodeOutput({ code, isGenerating, prompt, projectTitle, projectId, user }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(!!projectId);
  const [activeTab, setActiveTab] = useState<string>('');
  const [editableCode, setEditableCode] = useState<{ [key: string]: string }>({});

  // Add this ref to track if files have been processed
  const filesProcessedRef = useRef(false);

  const copyToClipboard = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const downloadCode = () => {
    if (!code) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded successfully!');
  };

  const exportAsZip = async () => {
    if (!code || Object.keys(editableCode).length === 0) return;
    
    try {
      const zip = new JSZip();
      
      // Add each file to the zip
      Object.entries(editableCode).forEach(([filename, content]) => {
        zip.file(filename, content);
      });
      
      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const filename = `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip`;
      
      saveAs(zipBlob, filename);
      toast.success('Project exported as ZIP successfully!');
    } catch (error) {
      console.error('Error exporting ZIP:', error);
      toast.error('Failed to export project');
    }
  };

  const exportToGitHub = () => {
    // This would integrate with GitHub API
    toast.info('GitHub export coming soon!');
  };

  const saveProject = async () => {
    if (!code) {
      toast.error('No code to save');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          title: projectTitle,
          prompt: prompt,
          generatedCode: code,
          framework: 'react', // Will be auto-detected by backend
          tags: [] // Will be auto-detected by backend
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSaved(true);
        toast.success('Project saved successfully!');
      } else {
        throw new Error(data.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const parseGeneratedCode = (rawCode: string) => {
    // Try to parse different file types from the generated code
    const files: { [key: string]: string } = {};
    const lines = rawCode.split('\n');
    let currentFile = 'main.js';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('// ') && line.includes('.')) {
        // Save previous file
        if (currentContent.length > 0) {
          files[currentFile] = currentContent.join('\n');
        }
        // Start new file
        currentFile = line.replace('//', '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Save the last file
    if (currentContent.length > 0) {
      files[currentFile] = currentContent.join('\n');
    }

    return Object.keys(files).length > 1 ? files : { 'generated-code.js': rawCode };
  };

  const files = code ? parseGeneratedCode(code) : {};
  
  // Initialize editable code when files change
  useEffect(() => {
    if (Object.keys(files).length > 0 && !filesProcessedRef.current) {
      setEditableCode(files);
      setActiveTab(Object.keys(files)[0]);
      filesProcessedRef.current = true;
    }
  }, [files]);

  const handleCodeChange = (value: string | undefined, filename: string) => {
    if (value !== undefined) {
      setEditableCode(prev => ({
        ...prev,
        [filename]: value
      }));
    }
  };

  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin'
    };
    return languageMap[ext || ''] || 'javascript';
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Generated Code
            </CardTitle>
            <CardDescription>
              Your AI-generated project structure and code
            </CardDescription>
            {projectTitle && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-white">{projectTitle}</span>
                {isSaved && (
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    <BookmarkCheck className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {code && !isGenerating && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={copied}
                className="glass-effect border-white/20"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportAsZip}
                className="glass-effect border-white/20"
                title="Export as ZIP"
              >
                <Package className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToGitHub}
                className="glass-effect border-white/20"
                title="Export to GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
              {!isSaved && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveProject}
                  disabled={saving}
                  className="glass-effect border-white/20 hover:bg-green-500/10 hover:border-green-500/30"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              )}
              {isSaved && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="glass-effect border-green-500/30 text-green-400"
                >
                  <BookmarkCheck className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Generating your code...</h3>
                <p className="text-muted-foreground">
                  Our AI is crafting your project structure and implementation
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </motion.div>
          ) : code ? (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {Object.keys(files).length > 1 ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="glass-effect border-white/20">
                    {Object.keys(files).map((filename) => (
                      <TabsTrigger key={filename} value={filename} className="text-xs flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {filename}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(editableCode).map(([filename, content]) => (
                    <TabsContent key={filename} value={filename} className="mt-4">
                      <div className="border border-white/10 rounded-lg overflow-hidden">
                        <MonacoEditor
                          height="400px"
                          language={getLanguageFromFilename(filename)}
                          value={content}
                          onChange={(value) => handleCodeChange(value, filename)}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            suggestOnTriggerCharacters: true,
                            quickSuggestions: true,
                            parameterHints: { enabled: true },
                            hover: { enabled: true },
                            contextmenu: true,
                            find: { addExtraSpaceOnTop: false },
                            folding: true,
                            foldingStrategy: 'indentation',
                            showFoldingControls: 'always',
                            unfoldOnClickAfterEndOfLine: false,
                            links: true,
                            colorDecorators: true,
                            bracketPairColorization: { enabled: true },
                            guides: {
                              bracketPairs: true,
                              indentation: true,
                              highlightActiveIndentation: true
                            }
                          }}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <MonacoEditor
                    height="400px"
                    language={getLanguageFromFilename('generated-code.js')}
                    value={code}
                    onChange={(value) => setEditableCode({ 'generated-code.js': value || '' })}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on',
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: true,
                      parameterHints: { enabled: true },
                      hover: { enabled: true },
                      contextmenu: true,
                      find: { addExtraSpaceOnTop: false },
                      folding: true,
                      foldingStrategy: 'indentation',
                      showFoldingControls: 'always',
                      unfoldOnClickAfterEndOfLine: false,
                      links: true,
                      colorDecorators: true,
                      bracketPairColorization: { enabled: true },
                      guides: {
                        bracketPairs: true,
                        indentation: true,
                        highlightActiveIndentation: true
                      }
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <Badge variant="outline" className="glass-effect">
                  AI Generated
                </Badge>
                <Badge variant="outline" className="glass-effect">
                  Production Ready
                </Badge>
                <Badge variant="outline" className="glass-effect">
                  Modern Stack
                </Badge>
                <Badge variant="outline" className="glass-effect">
                  <FolderOpen className="h-3 w-3 mr-1" />
                  {Object.keys(files).length} Files
                </Badge>
                {isSaved && (
                  <Badge variant="outline" className="glass-effect bg-green-500/20 text-green-400 border-green-500/30">
                    <BookmarkCheck className="h-3 w-3 mr-1" />
                    Saved to Dashboard
                  </Badge>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Code className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ready to generate</h3>
              <p className="text-muted-foreground">
                Enter your project idea to see the magic happen
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}