const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testAnonKey() {
    console.log("Testing Anon Key...");
    const { data, error } = await supabase.from('master_egzersizler').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data length:", data.length);
        if (data.length === 0) {
            console.log("Returned 0 rows. This means RLS is blocking access for anon key.");
        }
    }
}

testAnonKey();
