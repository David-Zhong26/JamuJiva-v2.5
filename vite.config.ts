import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function browserSafeSupabaseKey(key: string) {
  const value = key.trim();
  if (!value || value.startsWith('sb_secret_')) return '';

  const parts = value.split('.');
  if (parts.length !== 3) return value;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.role === 'service_role') return '';
    return value;
  } catch {
    return '';
  }
}

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Get API key from environment (supports both VITE_UNSPLASH_ACCESS_KEY and UNSPLASH_ACCESS_KEY)
  const apiKey = env.VITE_UNSPLASH_ACCESS_KEY || env.UNSPLASH_ACCESS_KEY || '';
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
  const supabaseKey = browserSafeSupabaseKey(
    env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || ''
  );

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Expose UNSPLASH_ACCESS_KEY via define for backward compatibility
    // Standard Vite way: use VITE_UNSPLASH_ACCESS_KEY in .env file (automatically available via import.meta.env.VITE_UNSPLASH_ACCESS_KEY)
    // This define also supports UNSPLASH_ACCESS_KEY for backward compatibility
    define: {
      __UNSPLASH_ACCESS_KEY__: JSON.stringify(apiKey),
      __SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __SUPABASE_PUBLISHABLE_KEY__: JSON.stringify(supabaseKey),
    },
  };
});
