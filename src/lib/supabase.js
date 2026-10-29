import { createClient } from '@supabase/supabase-js';

/** Supabase 클라이언트. URL / anon 키는 .env 에서만 읽어옵니다. (코드에 직접 입력 금지) */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
