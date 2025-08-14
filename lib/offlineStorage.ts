export interface OfflineCode {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  timestamp: number;
  tags: string[];
  isFavorite: boolean;
}

export interface OfflineProject {
  id: string;
  name: string;
  description: string;
  codes: OfflineCode[];
  createdAt: number;
  updatedAt: number;
}

class OfflineStorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'HackForgeOffline';
  private readonly DB_VERSION = 1;
  private readonly STORES = {
    CODES: 'codes',
    PROJECTS: 'projects',
    SETTINGS: 'settings'
  };

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create codes store
        if (!db.objectStoreNames.contains(this.STORES.CODES)) {
          const codesStore = db.createObjectStore(this.STORES.CODES, { keyPath: 'id' });
          codesStore.createIndex('timestamp', 'timestamp', { unique: false });
          codesStore.createIndex('language', 'language', { unique: false });
          codesStore.createIndex('tags', 'tags', { unique: false });
        }

        // Create projects store
        if (!db.objectStoreNames.contains(this.STORES.PROJECTS)) {
          const projectsStore = db.createObjectStore(this.STORES.PROJECTS, { keyPath: 'id' });
          projectsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Create settings store
        if (!db.objectStoreNames.contains(this.STORES.SETTINGS)) {
          db.createObjectStore(this.STORES.SETTINGS, { keyPath: 'key' });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  // Code storage methods
  async saveCode(code: OfflineCode): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.CODES], 'readwrite');
      const store = transaction.objectStore(this.STORES.CODES);
      const request = store.put(code);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCode(id: string): Promise<OfflineCode | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.CODES], 'readonly');
      const store = transaction.objectStore(this.STORES.CODES);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCodes(): Promise<OfflineCode[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.CODES], 'readonly');
      const store = transaction.objectStore(this.STORES.CODES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getCodesByLanguage(language: string): Promise<OfflineCode[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.CODES], 'readonly');
      const store = transaction.objectStore(this.STORES.CODES);
      const index = store.index('language');
      const request = index.getAll(language);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async searchCodes(query: string): Promise<OfflineCode[]> {
    const allCodes = await this.getAllCodes();
    const lowerQuery = query.toLowerCase();
    
    return allCodes.filter(code => 
      code.title.toLowerCase().includes(lowerQuery) ||
      code.description.toLowerCase().includes(lowerQuery) ||
      code.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      code.code.toLowerCase().includes(lowerQuery)
    );
  }

  async deleteCode(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.CODES], 'readwrite');
      const store = transaction.objectStore(this.STORES.CODES);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async toggleFavorite(id: string): Promise<void> {
    const code = await this.getCode(id);
    if (code) {
      code.isFavorite = !code.isFavorite;
      await this.saveCode(code);
    }
  }

  // Project storage methods
  async saveProject(project: OfflineProject): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.PROJECTS], 'readwrite');
      const store = transaction.objectStore(this.STORES.PROJECTS);
      const request = store.put(project);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProject(id: string): Promise<OfflineProject | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.PROJECTS], 'readonly');
      const store = transaction.objectStore(this.STORES.PROJECTS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProjects(): Promise<OfflineProject[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.PROJECTS], 'readonly');
      const store = transaction.objectStore(this.STORES.PROJECTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.PROJECTS], 'readwrite');
      const store = transaction.objectStore(this.STORES.PROJECTS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Settings storage methods
  async saveSetting(key: string, value: any): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.SETTINGS], 'readwrite');
      const store = transaction.objectStore(this.STORES.SETTINGS);
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string): Promise<any> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.SETTINGS], 'readonly');
      const store = transaction.objectStore(this.STORES.SETTINGS);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Utility methods
  async getStorageInfo(): Promise<{ codes: number; projects: number; totalSize: number }> {
    const codes = await this.getAllCodes();
    const projects = await this.getAllProjects();
    
    // Estimate storage size (rough calculation)
    const totalSize = JSON.stringify({ codes, projects }).length;
    
    return {
      codes: codes.length,
      projects: projects.length,
      totalSize
    };
  }

  async clearAllData(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.CODES, this.STORES.PROJECTS, this.STORES.SETTINGS], 'readwrite');
      
      transaction.objectStore(this.STORES.CODES).clear();
      transaction.objectStore(this.STORES.PROJECTS).clear();
      transaction.objectStore(this.STORES.SETTINGS).clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Export/Import functionality
  async exportData(): Promise<string> {
    const codes = await this.getAllCodes();
    const projects = await this.getAllProjects();
    const settings = await this.getAllSettings();
    
    const data = {
      codes,
      projects,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.codes) {
        for (const code of data.codes) {
          await this.saveCode(code);
        }
      }
      
      if (data.projects) {
        for (const project of data.projects) {
          await this.saveProject(project);
        }
      }
      
      if (data.settings) {
        for (const setting of data.settings) {
          await this.saveSetting(setting.key, setting.value);
        }
      }
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }

  private async getAllSettings(): Promise<{ key: string; value: any }[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORES.SETTINGS], 'readonly');
      const store = transaction.objectStore(this.STORES.SETTINGS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();

// Initialize offline storage when the service is imported
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(console.error);
} 