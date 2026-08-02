import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://avcprnnlsednlwkanzsh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Y3Bybm5sc2Vkbmx3a2FuenNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2ODk0MjcsImV4cCI6MjEwMTI2NTQyN30.23HvO736dq1_HCMT-Tcs-LY6faPQi5tElqMPJKqrNAI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
