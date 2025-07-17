import { DatabaseService, User, UserSession, VPNConnection, supabase } from '@/lib/supabase'

// Generate unique device ID for this Electron instance
const DEVICE_ID = `electron-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export class SecureBrowserDatabaseService {
  private static currentUser: User | null = null
  private static currentSession: UserSession | null = null
  private static currentVPNConnection: VPNConnection | null = null

  // Initialize user session when authentication succeeds
  static async initializeUserSession(email: string, name: string): Promise<boolean> {
    try {
      console.log('🔑 Initializing user session for:', email)

      // Check if user exists in database
      let user = await DatabaseService.getCurrentUser(email)
      
      if (!user) {
        console.log('📝 Creating new user in database')
        // Create user in database if doesn't exist
        const { data, error } = await supabase
          .from('users')
          .insert({
            email,
            name,
            access_level: 1, // Default to restricted access
            status: 'active',
            device_id: DEVICE_ID,
            vpn_required: true
          })
          .select()
          .single()

        if (error) {
          console.error('❌ Failed to create user:', error)
          return false
        }
        user = data
      }

      if (!user) {
        console.error('❌ User data is null after creation/retrieval')
        return false
      }

      this.currentUser = user
      console.log('✅ User session initialized:', { 
        id: user.id, 
        email: user.email, 
        access_level: user.access_level 
      })

      // Create session record
      await this.createSession()
      
      return true
    } catch (error) {
      console.error('❌ Failed to initialize user session:', error)
      return false
    }
  }

  // Create a new session record
  static async createSession(): Promise<UserSession | null> {
    if (!this.currentUser) {
      console.warn('⚠️ Cannot create session: no current user')
      return null
    }

    try {
      const sessionData = {
        user_id: this.currentUser.id,
        device_id: DEVICE_ID,
        login_time: new Date().toISOString(),
        ip_address: await this.getCurrentIP(),
        location: 'Unknown', // Will be updated when VPN connects
        user_agent: navigator.userAgent,
        vpn_status: 'disconnected' as const
      }

      const session = await DatabaseService.createUserSession(sessionData)
      if (session) {
        this.currentSession = session
        console.log('✅ Session created:', session.id)
      }
      
      return session
    } catch (error) {
      console.error('❌ Failed to create session:', error)
      return null
    }
  }

  // Update session when VPN status changes
  static async updateVPNStatus(connected: boolean, endpoint?: string, location?: string) {
    if (!this.currentSession) return

    try {
      const updates = {
        vpn_status: connected ? 'connected' as const : 'disconnected' as const,
        vpn_endpoint: endpoint,
        location: location || this.currentSession.location
      }

      await DatabaseService.updateUserSession(this.currentSession.id, updates)
      
      // Update local session data
      this.currentSession = { ...this.currentSession, ...updates }
      
      console.log('✅ Session VPN status updated:', { connected, endpoint, location })
    } catch (error) {
      console.error('❌ Failed to update VPN status:', error)
    }
  }

  // Log VPN connection details
  static async logVPNConnection(endpoint: string, serverLocation: string, clientIP: string, vpnIP: string) {
    if (!this.currentUser) return null

    try {
      const connectionData = {
        user_id: this.currentUser.id,
        device_id: DEVICE_ID,
        endpoint,
        server_location: serverLocation,
        client_ip: clientIP,
        vpn_ip: vpnIP,
        status: 'connected' as const
      }

      const connection = await DatabaseService.logVPNConnection(connectionData)
      if (connection) {
        this.currentVPNConnection = connection
        console.log('✅ VPN connection logged:', connection.id)
      }
      
      return connection
    } catch (error) {
      console.error('❌ Failed to log VPN connection:', error)
      return null
    }
  }

  // End VPN connection
  static async endVPNConnection() {
    if (!this.currentVPNConnection) return

    try {
      await supabase
        .from('vpn_connections')
        .update({
          connection_end: new Date().toISOString(),
          status: 'disconnected'
        })
        .eq('id', this.currentVPNConnection.id)

      console.log('✅ VPN connection ended:', this.currentVPNConnection.id)
      this.currentVPNConnection = null
    } catch (error) {
      console.error('❌ Failed to end VPN connection:', error)
    }
  }

  // Log security events
  static async logSecurityEvent(
    eventType: 'download_blocked' | 'domain_blocked' | 'vpn_disconnected' | 'unauthorized_access' | 'session_timeout',
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    url?: string
  ) {
    try {
      const eventData = {
        user_id: this.currentUser?.id,
        device_id: DEVICE_ID,
        event_type: eventType,
        description,
        severity,
        url,
        ip_address: await this.getCurrentIP(),
        user_agent: navigator.userAgent
      }

      const success = await DatabaseService.logSecurityEvent(eventData)
      if (success) {
        console.log('🔒 Security event logged:', { eventType, severity, description })
      }
      
      return success
    } catch (error) {
      console.error('❌ Failed to log security event:', error)
      return false
    }
  }

  // Log navigation attempts
  static async logNavigation(url: string, allowed: boolean, blockedReason?: string) {
    if (!this.currentUser) return false

    try {
      const domain = new URL(url).hostname

      const navigationData = {
        user_id: this.currentUser.id,
        device_id: DEVICE_ID,
        url,
        domain,
        allowed,
        access_level: this.currentUser.access_level,
        vpn_active: this.currentSession?.vpn_status === 'connected',
        blocked_reason: blockedReason
      }

      const success = await DatabaseService.logNavigation(navigationData)
      if (success && !allowed) {
        console.log('🚫 Navigation blocked and logged:', { url, domain, blockedReason })
      }
      
      return success
    } catch (error) {
      console.error('❌ Failed to log navigation:', error)
      return false
    }
  }

  // End session when user logs out
  static async endSession() {
    if (!this.currentSession) return

    try {
      const endTime = new Date().toISOString()
      const sessionDuration = Math.floor(
        (Date.now() - new Date(this.currentSession.login_time).getTime()) / 1000
      )

      await DatabaseService.updateUserSession(this.currentSession.id, {
        logout_time: endTime,
        session_duration: sessionDuration
      })

      console.log('✅ Session ended:', { 
        sessionId: this.currentSession.id, 
        duration: sessionDuration 
      })

      // Clean up
      this.currentSession = null
      this.currentUser = null
      
      // End VPN connection if active
      await this.endVPNConnection()
      
    } catch (error) {
      console.error('❌ Failed to end session:', error)
    }
  }

  // Get current user data
  static getCurrentUser(): User | null {
    return this.currentUser
  }

  // Get current session data
  static getCurrentSession(): UserSession | null {
    return this.currentSession
  }

  // Update user's last login time
  static async updateLastLogin() {
    if (!this.currentUser) return

    try {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', this.currentUser.id)

      console.log('✅ Last login updated for user:', this.currentUser.email)
    } catch (error) {
      console.error('❌ Failed to update last login:', error)
    }
  }

  // Helper function to get current IP (simplified)
  private static async getCurrentIP(): Promise<string> {
    try {
      // In Electron, we can get this from the main process
      // For now, return a placeholder
      return '127.0.0.1'
    } catch (error) {
      return '127.0.0.1'
    }
  }

  // Check if user exists and get their access level
  static async getUserAccessLevel(email: string): Promise<number> {
    try {
      const user = await DatabaseService.getCurrentUser(email)
      return user?.access_level || 1
    } catch (error) {
      console.error('❌ Failed to get user access level:', error)
      return 1 // Default to most restrictive
    }
  }

  // Monitor session health
  static startSessionMonitoring() {
    // Monitor session every 5 minutes
    setInterval(async () => {
      if (this.currentUser && this.currentSession) {
        try {
          // Update session heartbeat
          await DatabaseService.updateUserSession(this.currentSession.id, {
            // Add a heartbeat timestamp or extend session
          })
        } catch (error) {
          console.warn('⚠️ Session monitoring error:', error)
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  // Get device ID for this session
  static getDeviceId(): string {
    return DEVICE_ID
  }
} 