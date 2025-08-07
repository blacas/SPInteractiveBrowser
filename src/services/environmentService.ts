import { DatabaseService } from '@/lib/supabase';

export async function fetchEnvironmentConfig(accessLevel: number): Promise<Record<string, string | undefined>> {
  const env: Record<string, string | undefined> = {};

  // Load generic system settings from Supabase
  const settings = await DatabaseService.getSystemSettings();
  for (const setting of settings) {
    env[setting.key.toUpperCase()] = setting.value;
  }

  // Include access level specific domain restrictions
  const access = await DatabaseService.getAccessLevel(accessLevel);
  if (access?.allowed_domains) {
    env[`LEVEL${accessLevel}_DOMAINS`] = access.allowed_domains.join(',');
  }

  // Fallback defaults for environment validation
  env.NODE_ENV = env.NODE_ENV || 'production';
  env.VPN_PROVIDER = env.VPN_PROVIDER || 'wireguard';
  env.WIREGUARD_ENDPOINT = env.WIREGUARD_ENDPOINT || '134.199.169.102:59926';
  env.WIREGUARD_CONFIG_PATH = env.WIREGUARD_CONFIG_PATH || './config/wireguard.conf';
  env.LOG_LEVEL = env.LOG_LEVEL || 'info';

  return env;
}
