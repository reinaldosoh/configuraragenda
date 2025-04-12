import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Defina as credenciais do Supabase diretamente para garantir que funcionem no Cloudflare
const SUPABASE_URL = 'https://bxtebvdpjwthffndacuf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dGVidmRwand0aGZmbmRhY3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5NTk2NTEsImV4cCI6MjAzNjUzNTY1MX0.jwTZVmug6V6UbxCgKEebmLkUgKN4AoTEesTgx1RhbeM';

// Tente usar as variáveis de ambiente se disponíveis, caso contrário use os valores definidos acima
const supabaseUrl = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_URL 
  ? import.meta.env.VITE_SUPABASE_URL 
  : SUPABASE_URL;

const supabaseAnonKey = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_ANON_KEY 
  ? import.meta.env.VITE_SUPABASE_ANON_KEY 
  : SUPABASE_ANON_KEY;

// Verifique se as credenciais estão definidas antes de criar o cliente
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Credenciais do Supabase não encontradas!');
}

// Crie e exporte o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Log para debug
console.log('Supabase inicializado com URL:', supabaseUrl);
