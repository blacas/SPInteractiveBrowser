import { DatabaseService } from '@/lib/supabase';

export async function fetchEnvironmentConfig(accessLevel: number): Promise<Record<string, string | undefined>> {
  const env: Record<string, string | undefined> = {};

  // Load generic system settings
  const settings = await DatabaseService.getSystemSettings();
  for (const setting of settings) {
    env[setting.key.toUpperCase()] = setting.value;
  }

  // Include access level specific domain restrictions
  const access = await DatabaseService.getAccessLevel(accessLevel);
  if (access?.allowed_domains) {
    env[`LEVEL${accessLevel}_DOMAINS`] = access.allowed_domains.join(',');
  }

  return env;
}
