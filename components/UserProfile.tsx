'use client';

import { useState, useEffect } from 'react';
import { User, ROLES, FEATURES, TOKEN_LIMITS } from '@/lib/auth';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case ROLES.ENTERPRISE:
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case ROLES.PREMIUM:
        return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-slate-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case ROLES.ENTERPRISE:
        return '🏢';
      case ROLES.PREMIUM:
        return '⭐';
      default:
        return '👤';
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case FEATURES.ADVANCED_AI:
        return '🤖';
      case FEATURES.CUSTOM_TEMPLATES:
        return '📝';
      case FEATURES.TEAM_COLLABORATION:
        return '👥';
      case FEATURES.API_ACCESS:
        return '🔌';
      case FEATURES.PRIORITY_SUPPORT:
        return '🎯';
      case FEATURES.UNLIMITED_TOKENS:
        return '♾️';
      default:
        return '✨';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* User Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${getRoleColor(user.role)} text-white`}>
            {getRoleIcon(user.role)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.email}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Plan
              </span>
              <span className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Tokens & Usage */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            AI Token Usage
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Tokens:</span>
              <span className="font-semibold text-lg">
                {user.aiTokens === -1 ? '♾️ Unlimited' : user.aiTokens}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Max Tokens:</span>
              <span className="font-semibold">
                {user.maxTokens === -1 ? '♾️ Unlimited' : user.maxTokens}
              </span>
            </div>

            {user.aiTokens !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(user.aiTokens / user.maxTokens) * 100}%` }}
                ></div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              {user.aiTokens === -1 
                ? 'Enterprise plan includes unlimited AI tokens'
                : `${user.aiTokens} of ${user.maxTokens} tokens remaining`
              }
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✨</span>
            Available Features
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {user.features.map((feature) => (
              <div key={feature} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{getFeatureIcon(feature)}</span>
                <span className="text-gray-700 capitalize">
                  {feature.replace(/_/g, ' ')}
                </span>
                <span className="ml-auto text-green-500">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upgrade Your Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ROLES).map(([roleKey, roleValue]) => {
            if (roleValue === user.role) return null;
            
            return (
              <div key={roleValue} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl ${getRoleColor(roleValue)} text-white mb-3`}>
                    {getRoleIcon(roleValue)}
                  </div>
                  <h3 className="font-semibold text-gray-900 capitalize mb-2">
                    {roleValue} Plan
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {roleValue === 'premium' ? 'Advanced features & 1000 tokens' : 
                     roleValue === 'enterprise' ? 'Unlimited everything' : 'Basic features & 100 tokens'}
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Upgrade to {roleValue.charAt(0).toUpperCase() + roleValue.slice(1)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {new Date(user.lastActive).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Last Active</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {user.features.length}
            </div>
            <div className="text-sm text-gray-600">Active Features</div>
          </div>
        </div>
      </div>
    </div>
  );
} 