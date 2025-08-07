import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Clerk } from '@clerk/clerk-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export let supabase: SupabaseClient;

export const initSupabaseClient = async (): Promise<SupabaseClient> => {
  const clerk = window.Clerk as Clerk;

  // ✅ Wait for Clerk to fully load if not already
  if (!clerk?.loaded) {
    await clerk?.load();
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch,
    },
    accessToken: async () => {
      const clerk = window.Clerk as Clerk;
    
      if (!clerk?.loaded) {
        console.warn("🛑 Clerk is not ready yet. No session available.");
        return null;
      }
    
      const session = clerk.session;
      if (!session) {
        console.warn("🛑 Clerk session is undefined.");
        return null;
      }
    
      try {
        const token = await session.getToken({ template: 'supabase' });
        console.log("✅ JWT token:", token);
        return token ?? null;
      } catch (err) {
        console.error("❌ Failed to get Clerk token:", err);
        return null;
      }
    } 
  });

  return supabase;
};


// TypeScript interfaces for database entities (using integer IDs)
export interface User {
  id: number // Changed from string to number
  email: string
  name: string
  access_level: number
  status: 'active' | 'suspended' | 'inactive'
  device_id?: string
  vpn_required: boolean
  can_edit_access_level: boolean
  created_at: string
  updated_at: string
  last_login?: string
  created_by?: number // Changed from string to number
}

export interface UserSession {
  id: number // Changed from string to number
  user_id: number // Changed from string to number
  device_id: string
  login_time: string
  logout_time?: string
  ip_address?: string
  vpn_endpoint?: string
  location?: string
  user_agent?: string
  vpn_status: 'connected' | 'disconnected' | 'failed' | 'reconnecting'
  session_duration?: number
}

export interface AccessLevel {
  id: number // Changed from string to number
  level: number
  name: string
  description?: string
  allowed_domains: string[]
  blocked_domains: string[]
  max_windows: number
  session_timeout: number
  vpn_required: boolean
  updated_at: string
  updated_by?: number // Changed from string to number
}

export interface SecurityEvent {
  id: number // Changed from string to number
  user_id?: number // Changed from string to number
  device_id?: string
  event_type: 'download_blocked' | 'domain_blocked' | 'vpn_disconnected' | 'unauthorized_access' | 'session_timeout' | 'suspicious_activity'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  resolved: boolean
  url?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
}

export interface VPNConnection {
  id: number // Changed from string to number
  user_id: number // Changed from string to number
  device_id: string
  connection_start: string
  connection_end?: string
  endpoint: string
  server_location: string
  client_ip?: string
  vpn_ip?: string
  status: 'connected' | 'disconnected' | 'failed' | 'reconnecting'
  latency?: number
  data_transfer?: number
}

export interface NavigationLog {
  id: number // Changed from string to number
  user_id: number // Changed from string to number
  device_id: string
  url: string
  domain: string
  timestamp: string
  allowed: boolean
  access_level: number
  vpn_active: boolean
  blocked_reason?: string
}

export interface SystemSettings {
  id: number // Changed from string to number
  key: string
  value: string
  category: 'vpn' | 'security' | 'general' | 'sharepoint'
  description?: string
  updated_at: string
  updated_by?: number // Changed from string to number
}

// Database service class with static methods
export class DatabaseService {
  
  // User operations
  static async getCurrentUser(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) {
        console.error('Error fetching user:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Exception in getCurrentUser:', error)
      return null
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating user:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Exception in createUser:', error)
      return null
    }
  }

  // Session operations
  static async createUserSession(sessionData: Omit<UserSession, 'id'>): Promise<UserSession | null> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating session:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Exception in createUserSession:', error)
      return null
    }
  }

  static async updateUserSession(sessionId: number, updates: Partial<UserSession>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update(updates)
        .eq('id', sessionId)
      
      if (error) {
        console.error('Error updating session:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Exception in updateUserSession:', error)
      return false
    }
  }

  // Security events
  static async logSecurityEvent(
    eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>,
    supabaseClient: SupabaseClient
  ): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('security_events')
        .insert({
          ...eventData,
          timestamp: new Date().toISOString(),
          resolved: false
        });
  
      if (error) {
        console.error('Error logging security event:', error);
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Exception in logSecurityEvent:', error);
      return false;
    }
  }
  

  // VPN connections
  static async logVPNConnection(connectionData: Omit<VPNConnection, 'id' | 'connection_start'>): Promise<VPNConnection | null> {
    try {
      const insertData = {
        ...connectionData,
        connection_start: new Date().toISOString()
      }

      // console.log('🔧 DatabaseService.logVPNConnection - Inserting data:', insertData)

      const { data, error } = await supabase
        .from('vpn_connections')
        .insert(insertData)
        .select()
        .single()
      
      if (error) {
        // console.error('❌ Error logging VPN connection to database:', error)
        // console.error('❌ Error details:', {
        //   message: error.message,
        //   details: error.details,
        //   hint: error.hint,
        //   code: error.code
        // })
        return null
      }
      
      // console.log('✅ VPN connection successfully inserted into database:', data)
      return data
    } catch (error) {
      // console.error('❌ Exception in logVPNConnection:', error)
      return null
    }
  }

  // Navigation logs
  static async logNavigation(navigationData: Omit<NavigationLog, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('navigation_logs')
        .insert({
          ...navigationData,
          timestamp: new Date().toISOString()
        })
      
      if (error) {
        // console.error('Error logging navigation:', error)
        return false
      }
      
      return true
    } catch (error) {
      // console.error('Exception in logNavigation:', error)
      return false
    }
  }

  // Access levels
  static async getAccessLevel(level: number): Promise<AccessLevel | null> {
    try {
      const { data, error } = await supabase
        .from('access_levels')
        .select('*')
        .eq('level', level)
        .single()
      
      if (error) {
        // console.error('Error fetching access level:', error)
        return null
      }
      
      return data
    } catch (error) {
      // console.error('Exception in getAccessLevel:', error)
      return null
    }
  }

  // System settings
  static async getSystemSettings(category?: string): Promise<SystemSettings[]> {
    try {
      let query = supabase.from('system_settings').select('*')
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query
      
      if (error) {
        // console.error('Error fetching system settings:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      // console.error('Exception in getSystemSettings:', error)
      return []
    }
  }

  static async updateSystemSetting(key: string, value: string, updatedBy?: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          value, 
          updated_by: updatedBy,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
      
      if (error) {
        // console.error('Error updating system setting:', error)
        return false
      }
      
      return true
    } catch (error) {
      // console.error('Exception in updateSystemSetting:', error)
      return false
    }
  }
}

// Real-time service class
export class RealtimeService {
  
  static subscribeToUserSessions(userId: number, callback: (payload: any) => void) {
    return supabase
      .channel('user-sessions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_sessions',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }

  static subscribeToSecurityEvents(callback: (payload: any) => void) {
    return supabase
      .channel('security-events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_events'
      }, callback)
      .subscribe()
  }

  static subscribeToVPNConnections(userId: number, callback: (payload: any) => void) {
    return supabase
      .channel('vpn-connections')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vpn_connections',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }

  static subscribeToNavigationLogs(userId: number, callback: (payload: any) => void) {
    return supabase
      .channel('navigation-logs')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'navigation_logs',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
} 