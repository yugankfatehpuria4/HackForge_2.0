import { cacheService } from './cache';

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

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasFeature: (feature: string) => boolean;
  canUseTokens: (tokens: number) => boolean;
}

// Role definitions
export const ROLES = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const;

// Feature definitions
export const FEATURES = {
  ADVANCED_AI: 'advanced_ai',
  CUSTOM_TEMPLATES: 'custom_templates',
  TEAM_COLLABORATION: 'team_collaboration',
  API_ACCESS: 'api_access',
  PRIORITY_SUPPORT: 'priority_support',
  UNLIMITED_TOKENS: 'unlimited_tokens'
} as const;

// Token limits per role
export const TOKEN_LIMITS = {
  [ROLES.FREE]: 100,
  [ROLES.PREMIUM]: 1000,
  [ROLES.ENTERPRISE]: -1 // Unlimited
} as const;

// Features per role
export const ROLE_FEATURES = {
  [ROLES.FREE]: [
    FEATURES.ADVANCED_AI
  ] as string[],
  [ROLES.PREMIUM]: [
    FEATURES.ADVANCED_AI,
    FEATURES.CUSTOM_TEMPLATES,
    FEATURES.API_ACCESS,
    FEATURES.PRIORITY_SUPPORT
  ] as string[],
  [ROLES.ENTERPRISE]: [
    FEATURES.ADVANCED_AI,
    FEATURES.CUSTOM_TEMPLATES,
    FEATURES.TEAM_COLLABORATION,
    FEATURES.API_ACCESS,
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.UNLIMITED_TOKENS
  ] as string[]
} as const;

export class AuthService {
  private static instance: AuthService;
  private users: Map<string, User> = new Map();

  private constructor() {
    this.initializeDefaultUsers();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeDefaultUsers() {
    // Demo users for testing
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'demo@hackforge.com',
        role: ROLES.FREE,
        aiTokens: 100,
        maxTokens: TOKEN_LIMITS[ROLES.FREE],
        features: ROLE_FEATURES[ROLES.FREE],
        createdAt: new Date(),
        lastActive: new Date()
      },
      {
        id: '2',
        email: 'premium@hackforge.com',
        role: ROLES.PREMIUM,
        aiTokens: 1000,
        maxTokens: TOKEN_LIMITS[ROLES.PREMIUM],
        features: ROLE_FEATURES[ROLES.PREMIUM],
        createdAt: new Date(),
        lastActive: new Date()
      },
      {
        id: '3',
        email: 'enterprise@hackforge.com',
        role: ROLES.ENTERPRISE,
        aiTokens: -1,
        maxTokens: TOKEN_LIMITS[ROLES.ENTERPRISE],
        features: ROLE_FEATURES[ROLES.ENTERPRISE],
        createdAt: new Date(),
        lastActive: new Date()
      }
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    // In a real app, this would validate against a database
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (user) {
      user.lastActive = new Date();
      await this.updateUserActivity(user.id);
      return user;
    }
    
    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    let user = await cacheService.get(cacheKey);
    
    if (!user) {
      user = this.users.get(id) || null;
      if (user) {
        await cacheService.set(cacheKey, user, 300); // Cache for 5 minutes
      }
    }
    
    return user;
  }

  async updateUserActivity(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastActive = new Date();
      await cacheService.set(`user:${userId}`, user, 300);
    }
  }

  async consumeTokens(userId: string, tokens: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    // Enterprise users have unlimited tokens
    if (user.role === ROLES.ENTERPRISE) return true;

    // Check if user has enough tokens
    if (user.aiTokens < tokens) return false;

    // Consume tokens
    user.aiTokens -= tokens;
    this.users.set(userId, user);
    await cacheService.set(`user:${userId}`, user, 300);

    return true;
  }

  async upgradeUser(userId: string, newRole: keyof typeof ROLES): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    user.role = ROLES[newRole];
    user.maxTokens = TOKEN_LIMITS[ROLES[newRole]];
    user.features = ROLE_FEATURES[ROLES[newRole]];
    
    // Reset tokens for new role
    if (newRole === 'ENTERPRISE') {
      user.aiTokens = -1; // Unlimited
    } else {
      user.aiTokens = TOKEN_LIMITS[ROLES[newRole]];
    }

    this.users.set(userId, user);
    await cacheService.set(`user:${userId}`, user, 300);

    return true;
  }

  hasRole(user: User, role: string): boolean {
    return user.role === role;
  }

  hasFeature(user: User, feature: string): boolean {
    return user.features.includes(feature);
  }

  canUseTokens(user: User, tokens: number): boolean {
    if (user.role === ROLES.ENTERPRISE) return true;
    return user.aiTokens >= tokens;
  }

  getRemainingTokens(user: User): number {
    if (user.role === ROLES.ENTERPRISE) return -1; // Unlimited
    return Math.max(0, user.aiTokens);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Middleware for checking role-based access
export function requireRole(role: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const user = args[0]?.user || args[0]?.userId;
      
      if (!user) {
        throw new Error('Authentication required');
      }

      const userData = await authService.getUserById(user.id || user);
      if (!userData || !authService.hasRole(userData, role)) {
        throw new Error(`Role '${role}' required`);
      }

      return method.apply(this, args);
    };
  };
}

// Middleware for checking feature access
export function requireFeature(feature: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const user = args[0]?.user || args[0]?.userId;
      
      if (!user) {
        throw new Error('Authentication required');
      }

      const userData = await authService.getUserById(user.id || user);
      if (!userData || !authService.hasFeature(userData, feature)) {
        throw new Error(`Feature '${feature}' required`);
      }

      return method.apply(this, args);
    };
  };
} 