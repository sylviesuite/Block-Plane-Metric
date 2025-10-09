import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: If you're doing server-side admin tasks
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL, // not ADMIN_URL — reuse base URL
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);
