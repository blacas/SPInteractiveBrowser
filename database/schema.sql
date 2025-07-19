-- Secure Remote Browser Database Schema
-- This schema supports the Electron app with comprehensive logging and monitoring
-- Uses auto-incrementing integer IDs and Clerk authentication

-- Create custom types
CREATE TYPE access_level_enum AS ENUM ('1', '2', '3');
CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'inactive');
CREATE TYPE vpn_status_enum AS ENUM ('connected', 'disconnected', 'failed', 'reconnecting');
CREATE TYPE event_severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE setting_category_enum AS ENUM ('vpn', 'security', 'general', 'sharepoint');

-- Users table for Secure Remote Browser
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    access_level INTEGER NOT NULL DEFAULT 1 CHECK (access_level IN (1, 2, 3)),
    status user_status_enum NOT NULL DEFAULT 'active',
    device_id TEXT,
    vpn_required BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_by BIGINT,
    
    -- Indexes
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_access_level ON users(access_level);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_device_id ON users(device_id);

-- User Sessions table for detailed session tracking
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    logout_time TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    vpn_endpoint TEXT,
    location TEXT,
    user_agent TEXT,
    vpn_status vpn_status_enum NOT NULL DEFAULT 'disconnected',
    session_duration INTEGER -- in seconds
);

-- Create indexes for user_sessions table
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_login_time ON user_sessions(login_time);
CREATE INDEX idx_user_sessions_device_id ON user_sessions(device_id);

-- Access Levels configuration table
CREATE TABLE access_levels (
    id BIGSERIAL PRIMARY KEY,
    level INTEGER UNIQUE NOT NULL CHECK (level IN (1, 2, 3)),
    name TEXT NOT NULL,
    description TEXT,
    allowed_domains TEXT[] NOT NULL DEFAULT '{}',
    blocked_domains TEXT[] NOT NULL DEFAULT '{}',
    max_windows INTEGER NOT NULL DEFAULT 1,
    session_timeout INTEGER NOT NULL DEFAULT 3600, -- in seconds
    vpn_required BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by BIGINT REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT access_levels_name_check CHECK (name IN ('Restricted', 'Manager', 'Full Access'))
);

-- Security Events table for comprehensive security logging
CREATE TABLE security_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    device_id TEXT,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    severity event_severity_enum NOT NULL DEFAULT 'low',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved BOOLEAN NOT NULL DEFAULT false,
    url TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    
    -- Constraints
    CONSTRAINT security_events_event_type_check CHECK (
        event_type IN ('download_blocked', 'domain_blocked', 'vpn_disconnected', 
                      'unauthorized_access', 'session_timeout', 'suspicious_activity')
    )
);

-- Create indexes for security_events table
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_timestamp ON security_events(timestamp);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_resolved ON security_events(resolved);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);

-- VPN Connections table for detailed VPN monitoring
CREATE TABLE vpn_connections (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    connection_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    connection_end TIMESTAMP WITH TIME ZONE,
    endpoint TEXT NOT NULL,
    server_location TEXT NOT NULL,
    client_ip INET,
    vpn_ip INET,
    status vpn_status_enum NOT NULL DEFAULT 'connected',
    latency INTEGER, -- in milliseconds
    data_transfer BIGINT DEFAULT 0 -- in bytes
);

-- Create indexes for vpn_connections table
CREATE INDEX idx_vpn_connections_user_id ON vpn_connections(user_id);
CREATE INDEX idx_vpn_connections_start ON vpn_connections(connection_start);
CREATE INDEX idx_vpn_connections_status ON vpn_connections(status);
CREATE INDEX idx_vpn_connections_device_id ON vpn_connections(device_id);

-- Navigation Logs table for tracking user browsing
CREATE TABLE navigation_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    url TEXT NOT NULL,
    domain TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    allowed BOOLEAN NOT NULL,
    access_level INTEGER NOT NULL CHECK (access_level IN (1, 2, 3)),
    vpn_active BOOLEAN NOT NULL,
    blocked_reason TEXT
);

-- Create indexes for navigation_logs table
CREATE INDEX idx_navigation_logs_user_id ON navigation_logs(user_id);
CREATE INDEX idx_navigation_logs_timestamp ON navigation_logs(timestamp);
CREATE INDEX idx_navigation_logs_domain ON navigation_logs(domain);
CREATE INDEX idx_navigation_logs_allowed ON navigation_logs(allowed);

-- Browsing History table for Chrome-like history functionality
CREATE TABLE browsing_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    url TEXT NOT NULL,
    domain TEXT NOT NULL,
    page_title TEXT NOT NULL,
    visit_count INTEGER NOT NULL DEFAULT 1,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT now(),
    favicon_url TEXT,
    is_bookmarked BOOLEAN NOT NULL DEFAULT false,
    access_level INTEGER NOT NULL CHECK (access_level IN (1, 2, 3)),
    
    -- Unique constraint to prevent duplicate URLs per user
    UNIQUE(user_id, url)
);

-- Create indexes for browsing_history table
CREATE INDEX idx_browsing_history_user_id ON browsing_history(user_id);
CREATE INDEX idx_browsing_history_last_visit ON browsing_history(last_visit DESC);
CREATE INDEX idx_browsing_history_domain ON browsing_history(domain);
CREATE INDEX idx_browsing_history_title ON browsing_history USING gin(to_tsvector('english', page_title));
CREATE INDEX idx_browsing_history_url ON browsing_history USING gin(to_tsvector('english', url));
CREATE INDEX idx_browsing_history_visit_count ON browsing_history(visit_count DESC);

-- System Settings table for application configuration
CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    category setting_category_enum NOT NULL DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by BIGINT REFERENCES users(id)
);

-- Create indexes for system_settings table
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_key ON system_settings(key);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_levels_updated_at 
    BEFORE UPDATE ON access_levels 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default access levels
INSERT INTO access_levels (level, name, description, allowed_domains, max_windows, session_timeout, vpn_required) VALUES
(1, 'Restricted', 'SharePoint-only access with strict domain restrictions', 
 ARRAY['datalifesaver.sharepoint.com', 'sharepoint.com', 'onedrive.com', 'office365.com'], 1, 3600, true),

(2, 'Manager', 'SharePoint plus approved business domains', 
 ARRAY['datalifesaver.sharepoint.com', 'sharepoint.com', 'microsoft.com', 'office.com', 'msn.com', 'live.com'], 2, 7200, true),

(3, 'Full Access', 'Unrestricted browsing through VPN', 
 ARRAY['*'], 5, 14400, true);

-- Insert default system settings
INSERT INTO system_settings (key, value, category, description) VALUES
('vpn_provider', 'wireguard', 'vpn', 'Default VPN provider'),
('vpn_endpoint', '134.199.169.102:59926', 'vpn', 'VPN server endpoint'),
('vpn_server_region', 'australia', 'vpn', 'VPN server region'),
('vpn_auto_connect', 'true', 'vpn', 'Automatically connect to VPN on startup'),
('vpn_fail_closed', 'true', 'vpn', 'Block browser access if VPN fails'),

('security_block_downloads', 'true', 'security', 'Block all file downloads'),
('security_https_only', 'true', 'security', 'Force HTTPS connections only'),
('security_block_devtools', 'true', 'security', 'Block developer tools access'),

('sharepoint_tenant_url', 'https://datalifesaver.sharepoint.com', 'sharepoint', 'Primary SharePoint tenant URL'),
('sharepoint_auto_login', 'true', 'sharepoint', 'Enable automatic SharePoint login'),
('sharepoint_default_access_level', '1', 'sharepoint', 'Default user access level'),

('log_level', 'info', 'general', 'Application logging level'),
('session_timeout_warning', '300', 'general', 'Session timeout warning (seconds)'),
('max_concurrent_sessions', '3', 'general', 'Maximum concurrent sessions per user');

-- Row Level Security Policies
-- Note: Since we're using Clerk authentication, we'll implement basic RLS without auth.email()
-- The application layer will handle most access control through Clerk

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow read/write for all authenticated users (Clerk handles the real auth)
-- In production, you might want to be more restrictive
CREATE POLICY "Allow authenticated access to users" ON users
    FOR ALL USING (true);

-- User Sessions policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to user_sessions" ON user_sessions
    FOR ALL USING (true);

-- Access Levels policies
ALTER TABLE access_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to access_levels" ON access_levels
    FOR SELECT USING (true);

-- Security Events policies
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to security_events" ON security_events
    FOR ALL USING (true);

-- VPN Connections policies
ALTER TABLE vpn_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to vpn_connections" ON vpn_connections
    FOR ALL USING (true);

-- Navigation Logs policies
ALTER TABLE navigation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to navigation_logs" ON navigation_logs
    FOR ALL USING (true);

-- Browsing History policies
ALTER TABLE browsing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to browsing_history" ON browsing_history
    FOR ALL USING (true);

-- System Settings policies
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to system_settings" ON system_settings
    FOR SELECT USING (true);

-- Create helpful views
CREATE VIEW user_activity AS
SELECT 
    u.email,
    u.name,
    u.access_level,
    u.status,
    us.login_time,
    us.vpn_status,
    us.location,
    vc.endpoint,
    vc.server_location
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
LEFT JOIN vpn_connections vc ON u.id = vc.user_id
WHERE us.logout_time IS NULL; -- Only active sessions

CREATE VIEW security_summary AS
SELECT 
    DATE(timestamp) as date,
    event_type,
    severity,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as affected_users
FROM security_events
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(timestamp), event_type, severity
ORDER BY date DESC, event_count DESC;

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE security_events;
ALTER PUBLICATION supabase_realtime ADD TABLE vpn_connections;
ALTER PUBLICATION supabase_realtime ADD TABLE navigation_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE browsing_history;

-- Grant permissions for authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_sessions TO authenticated;
GRANT SELECT, INSERT ON security_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON vpn_connections TO authenticated;
GRANT SELECT, INSERT ON navigation_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON browsing_history TO authenticated;
GRANT SELECT ON access_levels TO authenticated;
GRANT SELECT ON system_settings TO authenticated;

-- Grant permissions for service role (for admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant usage on sequences for auto-increment IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Comments for documentation
COMMENT ON TABLE users IS 'Secure Remote Browser user accounts with access control';
COMMENT ON TABLE user_sessions IS 'Detailed session tracking for security monitoring';
COMMENT ON TABLE access_levels IS 'Access level configurations and domain restrictions';
COMMENT ON TABLE security_events IS 'Security incident logging and monitoring';
COMMENT ON TABLE vpn_connections IS 'VPN connection monitoring and analytics';
COMMENT ON TABLE navigation_logs IS 'User browsing activity and access control logs';
COMMENT ON TABLE browsing_history IS 'Chrome-like browsing history with local and cloud sync';
COMMENT ON TABLE system_settings IS 'Application configuration and system settings'; 