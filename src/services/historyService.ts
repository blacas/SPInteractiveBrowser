import { supabase } from '@/lib/supabase';

export interface HistoryEntry {
  id?: number;
  url: string;
  domain: string;
  pageTitle: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  faviconUrl?: string;
  isBookmarked: boolean;
  accessLevel: number;
}

export interface LocalHistoryEntry {
  url: string;
  domain: string;
  pageTitle: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  faviconUrl?: string;
  isBookmarked: boolean;
}

export class HistoryService {
  private static readonly HISTORY_KEY = 'browser_history';
  private static readonly MAX_LOCAL_ENTRIES = 1000;
  private static currentUser: any = null;

  // Initialize with current user
  static setCurrentUser(user: any) {
    this.currentUser = user;
  }

  // Add or update history entry
  static async addHistoryEntry(
    url: string, 
    pageTitle: string, 
    faviconUrl?: string
  ): Promise<void> {
    try {
      const domain = this.extractDomain(url);
      
      // Update local storage
      await this.updateLocalHistory(url, domain, pageTitle, faviconUrl);
      
      // Update database if user is logged in
      if (this.currentUser) {
        await this.updateDatabaseHistory(url, domain, pageTitle, faviconUrl);
      }
      
      // console.log('✅ History entry added:', { url, pageTitle, domain });
    } catch (error) {
      // console.error('❌ Failed to add history entry:', error);
    }
  }

  // Update local storage history
  private static async updateLocalHistory(
    url: string,
    domain: string,
    pageTitle: string,
    faviconUrl?: string
  ): Promise<void> {
    try {
      const localHistory = this.getLocalHistory();
      const now = new Date().toISOString();
      
      // Find existing entry
      const existingIndex = localHistory.findIndex(entry => entry.url === url);
      
      if (existingIndex >= 0) {
        // Update existing entry
        localHistory[existingIndex] = {
          ...localHistory[existingIndex],
          pageTitle,
          visitCount: localHistory[existingIndex].visitCount + 1,
          lastVisit: now,
          faviconUrl: faviconUrl || localHistory[existingIndex].faviconUrl
        };
      } else {
        // Add new entry
        const newEntry: LocalHistoryEntry = {
          url,
          domain,
          pageTitle,
          visitCount: 1,
          firstVisit: now,
          lastVisit: now,
          faviconUrl,
          isBookmarked: false
        };
        
        localHistory.unshift(newEntry);
        
        // Limit to MAX_LOCAL_ENTRIES
        if (localHistory.length > this.MAX_LOCAL_ENTRIES) {
          localHistory.splice(this.MAX_LOCAL_ENTRIES);
        }
      }
      
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(localHistory));
    } catch (error) {
      // console.error('❌ Failed to update local history:', error);
    }
  }

  // Update database history
  private static async updateDatabaseHistory(
    url: string,
    domain: string,
    pageTitle: string,
    faviconUrl?: string
  ): Promise<void> {
    try {
      if (!this.currentUser?.dbId) return;

      const deviceId = this.getDeviceId();
      const now = new Date().toISOString();
      
      // Try to insert or update using upsert
      const { error } = await supabase
        .from('browsing_history')
        .upsert({
          user_id: this.currentUser.dbId,
          device_id: deviceId,
          url,
          domain,
          page_title: pageTitle,
          visit_count: 1, // This will be incremented by a trigger or conflict resolution
          last_visit: now,
          favicon_url: faviconUrl,
          access_level: this.currentUser.accessLevel || 1
        }, {
          onConflict: 'user_id,url',
          ignoreDuplicates: false
        });

      if (error) {
        // If upsert fails, try manual update
        await this.handleDatabaseConflict(url, domain, pageTitle, faviconUrl);
      }
    } catch (error) {
      // console.error('❌ Failed to update database history:', error);
    }
  }

  // Handle database conflicts manually
  private static async handleDatabaseConflict(
    url: string,
    domain: string,
    pageTitle: string,
    faviconUrl?: string
  ): Promise<void> {
    try {
      const deviceId = this.getDeviceId();
      const now = new Date().toISOString();

      // First, try to get existing entry
      const { data: existing } = await supabase
        .from('browsing_history')
        .select('*')
        .eq('user_id', this.currentUser.dbId)
        .eq('url', url)
        .single();

      if (existing) {
        // Update existing entry
        await supabase
          .from('browsing_history')
          .update({
            page_title: pageTitle,
            visit_count: existing.visit_count + 1,
            last_visit: now,
            favicon_url: faviconUrl || existing.favicon_url
          })
          .eq('user_id', this.currentUser.dbId)
          .eq('url', url);
      } else {
        // Insert new entry
        await supabase
          .from('browsing_history')
          .insert({
            user_id: this.currentUser.dbId,
            device_id: deviceId,
            url,
            domain,
            page_title: pageTitle,
            visit_count: 1,
            first_visit: now,
            last_visit: now,
            favicon_url: faviconUrl,
            access_level: this.currentUser.accessLevel || 1
          });
      }
    } catch (error) {
      // console.error('❌ Failed to handle database conflict:', error);
    }
  }

  // Get local history
  static getLocalHistory(): LocalHistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // console.error('❌ Failed to get local history:', error);
      return [];
    }
  }

  // Get database history
  static async getDatabaseHistory(limit: number = 100): Promise<HistoryEntry[]> {
    try {
      if (!this.currentUser?.dbId) return [];

      const { data, error } = await supabase
        .from('browsing_history')
        .select('*')
        .eq('user_id', this.currentUser.dbId)
        .order('last_visit', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(row => ({
        id: row.id,
        url: row.url,
        domain: row.domain,
        pageTitle: row.page_title,
        visitCount: row.visit_count,
        firstVisit: row.first_visit,
        lastVisit: row.last_visit,
        faviconUrl: row.favicon_url,
        isBookmarked: row.is_bookmarked,
        accessLevel: row.access_level
      })) || [];
    } catch (error) {
      // console.error('❌ Failed to get database history:', error);
      return [];
    }
  }

  // Get combined history (local + database, deduplicated)
  static async getCombinedHistory(limit: number = 100): Promise<HistoryEntry[]> {
    try {
      const [localHistory, dbHistory] = await Promise.all([
        Promise.resolve(this.getLocalHistory()),
        this.getDatabaseHistory(limit)
      ]);

      // Convert local entries to HistoryEntry format
      const localEntries: HistoryEntry[] = localHistory.map(entry => ({
        url: entry.url,
        domain: entry.domain,
        pageTitle: entry.pageTitle,
        visitCount: entry.visitCount,
        firstVisit: entry.firstVisit,
        lastVisit: entry.lastVisit,
        faviconUrl: entry.faviconUrl,
        isBookmarked: entry.isBookmarked,
        accessLevel: this.currentUser?.accessLevel || 1
      }));

      // Combine and deduplicate
      const combined = new Map<string, HistoryEntry>();
      
      // Add database entries first (they have priority)
      dbHistory.forEach(entry => {
        combined.set(entry.url, entry);
      });
      
      // Add local entries if not in database
      localEntries.forEach(entry => {
        if (!combined.has(entry.url)) {
          combined.set(entry.url, entry);
        }
      });

      // Sort by last visit and return
      return Array.from(combined.values())
        .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to get combined history:', error);
      return this.getLocalHistory().slice(0, limit).map(entry => ({
        url: entry.url,
        domain: entry.domain,
        pageTitle: entry.pageTitle,
        visitCount: entry.visitCount,
        firstVisit: entry.firstVisit,
        lastVisit: entry.lastVisit,
        faviconUrl: entry.faviconUrl,
        isBookmarked: entry.isBookmarked,
        accessLevel: this.currentUser?.accessLevel || 1
      }));
    }
  }

  // Search history
  static async searchHistory(query: string, limit: number = 50): Promise<HistoryEntry[]> {
    try {
      const allHistory = await this.getCombinedHistory(500);
      const lowercaseQuery = query.toLowerCase();
      
      return allHistory
        .filter(entry => 
          entry.pageTitle.toLowerCase().includes(lowercaseQuery) ||
          entry.url.toLowerCase().includes(lowercaseQuery) ||
          entry.domain.toLowerCase().includes(lowercaseQuery)
        )
        .slice(0, limit);
    } catch (error) {
      // console.error('❌ Failed to search history:', error);
      return [];
    }
  }

  // Clear history
  static async clearHistory(timeRange: 'hour' | 'day' | 'week' | 'month' | 'all' = 'all'): Promise<void> {
    try {
      const cutoffDate = this.getCutoffDate(timeRange);
      
      // Clear local history
      if (timeRange === 'all') {
        localStorage.removeItem(this.HISTORY_KEY);
      } else {
        const localHistory = this.getLocalHistory();
        const filtered = localHistory.filter(entry => 
          new Date(entry.lastVisit) < cutoffDate
        );
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
      }
      
      // Clear database history
      if (this.currentUser?.dbId) {
        let query = supabase
          .from('browsing_history')
          .delete()
          .eq('user_id', this.currentUser.dbId);
          
        if (timeRange !== 'all') {
          query = query.gte('last_visit', cutoffDate.toISOString());
        }
        
        await query;
      }
      
      // console.log('✅ History cleared for timeRange:', timeRange);
    } catch (error) {
      // console.error('❌ Failed to clear history:', error);
    }
  }

  // Helper methods
  private static extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  private static getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private static getCutoffDate(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case 'hour':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  }

  // Sync local history to database
  static async syncLocalToDatabase(): Promise<void> {
    try {
      if (!this.currentUser?.id) return;
      
      const localHistory = this.getLocalHistory();
      // console.log(`🔄 Syncing ${localHistory.length} local history entries to database...`);
      
      for (const entry of localHistory) {
        await this.updateDatabaseHistory(
          entry.url,
          entry.domain,
          entry.pageTitle,
          entry.faviconUrl
        );
      }
      
      // console.log('✅ Local history synced to database');
    } catch (error) {
      // console.error('❌ Failed to sync local history to database:', error);
    }
  }
} 