import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Carregue as variáveis de ambiente do Supabase ou use valores padrão
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bxtebvdpjwthffndacuf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dGVidmRwand0aGZmbmRhY3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5NTk2NTEsImV4cCI6MjAzNjUzNTY1MX0.jwTZVmug6V6UbxCgKEebmLkUgKN4AoTEesTgx1RhbeM';

// Crie e exporte o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Log para debug
console.log('Supabase inicializado com URL:', supabaseUrl);
