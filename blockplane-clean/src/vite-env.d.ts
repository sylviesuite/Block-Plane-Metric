/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_CLAUDE_API_KEY: string;
  // Add any others here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
