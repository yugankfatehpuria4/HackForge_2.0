"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  StarOff, 
  Trash2, 
  Edit, 
  Eye, 
  Code, 
  Calendar,
  Clock,
  Tag,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  _id: string;
  title: string;
  prompt: string;
  generatedCode: string;
  framework: string;
  tags: string[];
  isFavorite: boolean;
  metadata: {
    tokensUsed: number;
    generationTime: number;
    model: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Create motion component with proper type inference
const MotionDiv = motion.div;

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        userId: 'demo-user',
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${API_URL}/api/projects?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (projectId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user' })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setProjects(projects.map(project => 
          project._id === projectId 
            ? { ...project, isFavorite: !project.isFavorite }
            : project
        ));
        toast.success(data.message);
      } else {
        toast.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status. Please check if the backend server is running.');
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}?userId=demo-user`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(project => project._id !== projectId));
        toast.success('Project deleted successfully');
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please check if the backend server is running.');
    }
  };

  // View project code
  const viewProject = (project: Project) => {
    setSelectedProject(project);
    setShowCodeModal(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get framework icon
  const getFrameworkIcon = (framework: string) => {
    const icons: { [key: string]: string } = {
      react: '⚛️',
      nextjs: '▲',
      vue: '💚',
      angular: '🅰️',
      express: '🚂',
      django: '🐍',
      flask: '🔥',
      laravel: '🔴',
      spring: '🍃',
      fastapi: '⚡',
      javascript: '⚡',
      typescript: '🔷',
      python: '🐍',
      html: '🌐',
      css: '🎨',
      java: '☕',
      cpp: '⚙️',
      csharp: '🔷',
      php: '🐘',
      ruby: '💎',
      go: '🚀',
      rust: '🦀',
      swift: '🍎',
      kotlin: '🔶'
    };
    return icons[framework] || '🔧';
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, sortBy, sortOrder, pagination.page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 neon-text">
            Project Dashboard
          </h1>
          <p className="text-gray-300">
            Manage and view all your generated projects
          </p>
        </MotionDiv>

        {/* Search and Filters */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-effect border-white/10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="framework">Framework</option>
              </select>
              <Button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="outline"
                className="glass-effect border-white/10"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </MotionDiv>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Generate your first project to see it here'}
            </p>
            {!searchTerm && (
              <Button asChild className="glass-effect hover:neon-glow">
                <a href="/generate">Generate Code</a>
              </Button>
            )}
          </MotionDiv>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <MotionDiv
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-white line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(project._id)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          {project.isFavorite ? (
                            <Star className="h-4 w-4 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          {getFrameworkIcon(project.framework)}
                          {project.framework}
                        </span>
                      </div>

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.metadata.generationTime}ms
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => viewProject(project)}
                          className="flex-1 glass-effect hover:neon-glow"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProject(project._id)}
                          className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="glass-effect border-white/10"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-white">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="glass-effect border-white/10"
              >
                Next
              </Button>
            </div>
          </MotionDiv>
        )}
      </div>

      {/* Code Modal */}
      {showCodeModal && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">{selectedProject.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCodeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Prompt</h4>
                  <div className="bg-slate-800 p-3 rounded text-sm text-gray-200">
                    {selectedProject.prompt}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Generated Code</h4>
                  <pre className="bg-slate-800 p-4 rounded text-sm text-gray-200 overflow-x-auto">
                    <code>{selectedProject.generatedCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </div>
  );
}
