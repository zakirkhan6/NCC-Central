import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

let supabase = null;

const apiKey = config.supabaseServiceRoleKey || config.supabaseAnonKey;

if (config.supabaseUrl && apiKey) {
  try {
    supabase = createClient(config.supabaseUrl, apiKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    logger.info(`Supabase Client initialized successfully for ${config.supabaseUrl}`);
  } catch (err) {
    logger.error('Failed to initialize Supabase client:', err.message);
  }
} else {
  logger.warn('Supabase URL or Anon Key missing in environment variables.');
}

export { supabase };
