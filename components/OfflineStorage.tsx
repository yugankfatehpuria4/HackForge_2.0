'use client';

import { useState, useEffect } from 'react';
import { offlineStorage, OfflineCode, OfflineProject } from '@/lib/offlineStorage';

export default function OfflineStorage() {
  const [codes, setCodes] = useState<OfflineCode[]>([]);
  const [projects, setProjects] = useState<OfflineProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'codes' | 'projects'>('codes');
  const [stats, setStats] = useState<{ codes: number; projects: number; totalSize: number } | null>(null);

  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = async () => {
    try {
      setLoading(true);
      const [codesData, projectsData, statsData] = await Promise.all([
        offlineStorage.getAllCodes(),
        offlineStorage.getAllProjects(),
        offlineStorage.getStorageInfo()
      ]);
      
      setCodes(codesData);
      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCode = async (codeData: Partial<OfflineCode>) => {
    try {
      const newCode: OfflineCode = {
        id: `offline_${Date.now()}`,
        title: codeData.title || 'Untitled Code',
        description: codeData.description || '',
        code: codeData.code || '',
        language: codeData.language || 'text',
        timestamp: Date.now(),
        tags: codeData.tags || [],
        isFavorite: false
      };

      await offlineStorage.saveCode(newCode);
      await loadOfflineData();
    } catch (error) {
      console.error('Failed to save code:', error);
    }
  };

  const handleToggleFavorite = async (codeId: string) => {
    try {
      await offlineStorage.toggleFavorite(codeId);
      await loadOfflineData();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    try {
      await offlineStorage.deleteCode(codeId);
      await loadOfflineData();
    } catch (error) {
      console.error('Failed to delete code:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = await offlineStorage.exportData();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hackforge-offline-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await offlineStorage.importData(text);
      await loadOfflineData();
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  const filteredCodes = codes.filter(code =>
    code.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Offline Storage</h1>
          <div className="flex space-x-2">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              📥 Import
            </label>
            <button
              onClick={handleExportData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📤 Export
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.codes}</div>
              <div className="text-sm text-gray-600">Offline Codes</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.projects}</div>
              <div className="text-sm text-gray-600">Offline Projects</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(stats.totalSize / 1024).toFixed(1)} KB
              </div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab('codes')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'codes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 Codes ({codes.length})
            </button>
            <button
              onClick={() => setSelectedTab('projects')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'projects'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📁 Projects ({projects.length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search offline content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'codes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCodes.map((code) => (
            <div key={code.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 truncate">{code.title}</h3>
                <button
                  onClick={() => handleToggleFavorite(code.id)}
                  className={`text-xl ${code.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  {code.isFavorite ? '⭐' : '☆'}
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{code.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {code.language}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(code.timestamp).toLocaleDateString()}
                </span>
              </div>

              {code.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {code.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Code
                </button>
                <button
                  onClick={() => handleDeleteCode(code.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  {project.codes.length} codes
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Open Project
                </button>
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((selectedTab === 'codes' && filteredCodes.length === 0) || 
        (selectedTab === 'projects' && filteredProjects.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No results found' : 'No offline content yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Start by saving some code or projects for offline access'
            }
          </p>
          {!searchQuery && (
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Save First Item
            </button>
          )}
        </div>
      )}
    </div>
  );
} 