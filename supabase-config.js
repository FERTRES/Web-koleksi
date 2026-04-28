// SUPABASE CONFIGURATION
// Thornex Digital Entity - MorvithSERV

const SUPABASE_CONFIG = {
    url: 'https://tycspbyxzzisqtwpmybd.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Y3NwYnl4enppc3F0d3BteWJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM2OTM5MiwiZXhwIjoyMDkyOTQ1MzkyfQ.N3Te9HORcOU4BbV-EBusKvgLQD_AbNEvcTUPrLv_GBI'
};

// CATATAN: Lo harus ganti anonKey dengan key asli dari Supabase project lo
// Ambil di Project Settings > API > Project API keys

// Initialize Supabase
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);