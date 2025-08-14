"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  FileText, 
  FileCode, 
  FileImage, 
  FileJson, 
  File, 
  FileText as FileHtml, 
  ChevronRight, 
  ChevronDown,
  FolderOpen,
  FolderClosed
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  size?: number;
  modified?: Date;
}

interface FileExplorerProps {
  files: { [key: string]: string };
  onFileSelect: (filename: string, content: string) => void;
  selectedFile?: string;
  className?: string;
}

export function FileExplorer({ files, onFileSelect, selectedFile, className = '' }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const buildFileTree = (files: { [key: string]: string }): FileNode[] => {
    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    Object.entries(files).forEach(([filename, content]) => {
      const parts = filename.split('/');
      let currentPath = '';
      
      // Create folder structure
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        
        if (!folderMap.has(currentPath)) {
          const folderNode: FileNode = {
            name: folderName,
            type: 'folder',
            children: [],
            modified: new Date()
          };
          
          if (parentPath && folderMap.has(parentPath)) {
            folderMap.get(parentPath)!.children!.push(folderNode);
          } else {
            tree.push(folderNode);
          }
          
          folderMap.set(currentPath, folderNode);
        }
      }
      
      // Add file
      const fileName = parts[parts.length - 1];
      const fileNode: FileNode = {
        name: fileName,
        type: 'file',
        content,
        language: getLanguageFromFilename(fileName),
        size: content.length,
        modified: new Date()
      };
      
      if (parts.length === 1) {
        tree.push(fileNode);
      } else {
        const parentPath = parts.slice(0, -1).join('/');
        if (folderMap.has(parentPath)) {
          folderMap.get(parentPath)!.children!.push(fileNode);
        }
      }
    });

    return tree;
  };

  const getLanguageFromFilename = (filename: string): string => {
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
      'kt': 'kotlin',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'gif': 'image',
      'svg': 'image'
    };
    return languageMap[ext || ''] || 'text';
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return expandedFolders.has(node.name) ? <FolderOpen className="h-4 w-4 text-blue-400" /> : <FolderClosed className="h-4 w-4 text-blue-400" />;
    }
    
    const language = node.language;
    switch (language) {
      case 'javascript':
      case 'typescript':
        return <FileCode className="h-4 w-4 text-yellow-400" />;
      case 'html':
        return <FileHtml className="h-4 w-4 text-orange-400" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <File className="h-4 w-4 text-pink-400" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-green-400" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-purple-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const filteredFiles = Object.entries(files).filter(([filename]) =>
    filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fileTree = buildFileTree(files);

  const renderNode = (node: FileNode, depth: number = 0): JSX.Element => {
    const isExpanded = expandedFolders.has(node.name);
    const isSelected = selectedFile === node.name;
    
    if (node.type === 'folder') {
      return (
        <div key={node.name}>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start h-8 px-2 text-left font-normal ${
              isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
            }`}
            onClick={() => toggleFolder(node.name)}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-2" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-2" />
            )}
            {getFileIcon(node)}
            <span className="ml-2 truncate">{node.name}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {node.children?.length || 0}
            </Badge>
          </Button>
          
          <AnimatePresence>
            {isExpanded && node.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {node.children.map(child => renderNode(child, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    } else {
      return (
        <Button
          key={node.name}
          variant="ghost"
          size="sm"
          className={`w-full justify-start h-8 px-2 text-left font-normal ${
            isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
          }`}
          onClick={() => onFileSelect(node.name, node.content || '')}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {getFileIcon(node)}
          <span className="ml-2 truncate">{node.name}</span>
          <Badge variant="outline" className="ml-auto text-xs opacity-60">
            {node.language}
          </Badge>
        </Button>
      );
    }
  };

  return (
    <Card className={`glass-effect border-white/10 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Folder className="h-4 w-4 text-blue-400" />
          Project Files
        </CardTitle>
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-white/50"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {searchTerm ? (
            // Show filtered results
            filteredFiles.map(([filename, content]) => (
              <Button
                key={filename}
                variant="ghost"
                size="sm"
                className={`w-full justify-start h-8 px-2 text-left font-normal ${
                  selectedFile === filename ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                }`}
                onClick={() => onFileSelect(filename, content)}
              >
                {getFileIcon({ name: filename, type: 'file', language: getLanguageFromFilename(filename) })}
                <span className="ml-2 truncate">{filename}</span>
                <Badge variant="outline" className="ml-auto text-xs opacity-60">
                  {getLanguageFromFilename(filename)}
                </Badge>
              </Button>
            ))
          ) : (
            // Show full tree
            fileTree.map(node => renderNode(node))
          )}
        </div>
        
        {searchTerm && filteredFiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files found matching "{searchTerm}"</p>
          </div>
        )}
        
        {!searchTerm && fileTree.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No project files available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 