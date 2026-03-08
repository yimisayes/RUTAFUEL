import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Obtener credenciales de Figma Make
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);