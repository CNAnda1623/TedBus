const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thblatubtblmsqxhwoxp.supabase.co'; // ✅ Replace this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYmxhdHVidGJsbXNxeGh3b3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MjY1OTgsImV4cCI6MjA2OTEwMjU5OH0.4KTlM5o-RIMIWyCtmq9-XxLKkdG0R5fPbx8D2YVfjOg';              // ✅ Replace this

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
