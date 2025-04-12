import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Carregue as variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crie e exporte o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
