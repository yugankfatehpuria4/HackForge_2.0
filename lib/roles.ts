/**
 * Role and feature definitions shared by client and server code.
 *
 * These live apart from lib/auth.ts on purpose: lib/auth.ts imports the Redis
 * cache at module scope, so a client component importing it would pull ioredis
 * into the browser bundle. Import roles from here in components.
 */

export interface User {
  id: string;
  email: string;
  role: 'free' | 'premium' | 'enterprise';
  aiTokens: number;
  maxTokens: number;
  features: string[];
  createdAt: Date;
  lastActive: Date;
}

export const ROLES = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const FEATURES = {
  ADVANCED_AI: 'advanced_ai',
  CUSTOM_TEMPLATES: 'custom_templates',
  TEAM_COLLABORATION: 'team_collaboration',
  API_ACCESS: 'api_access',
  PRIORITY_SUPPORT: 'priority_support',
  UNLIMITED_TOKENS: 'unlimited_tokens',
} as const;

// Token limits per role (-1 means unlimited)
export const TOKEN_LIMITS = {
  [ROLES.FREE]: 100,
  [ROLES.PREMIUM]: 1000,
  [ROLES.ENTERPRISE]: -1,
} as const;

// Features per role
export const ROLE_FEATURES = {
  [ROLES.FREE]: [FEATURES.ADVANCED_AI] as string[],
  [ROLES.PREMIUM]: [
    FEATURES.ADVANCED_AI,
    FEATURES.CUSTOM_TEMPLATES,
    FEATURES.API_ACCESS,
    FEATURES.PRIORITY_SUPPORT,
  ] as string[],
  [ROLES.ENTERPRISE]: [
    FEATURES.ADVANCED_AI,
    FEATURES.CUSTOM_TEMPLATES,
    FEATURES.TEAM_COLLABORATION,
    FEATURES.API_ACCESS,
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.UNLIMITED_TOKENS,
  ] as string[],
} as const;
