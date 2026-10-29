const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
    const { data: exercises, error } = await supabase.from('master_egzersizler').select('*');
    if (error) {
        console.error(error);
        return;
    }
    
    for (const ex of exercises) {
        console.log(`Ex: ${ex.ad}, Gruplar: ${ex.gruplar}`);
        if (typeof ex.gruplar === 'string') {
            try {
                JSON.parse(ex.gruplar || '{}');
            } catch (e) {
                console.error(`PARSE ERROR for ${ex.ad}:`, e.message, "Data:", ex.gruplar);
            }
        }
    }
    
    const { data: programs } = await supabase.from('programlar').select('*');
    for (const p of programs) {
        console.log(`Prog: ${p.program_adi}, Detaylar: ${p.detaylar}`);
        if (typeof p.detaylar === 'string') {
            try {
                JSON.parse(p.detaylar || '[]');
            } catch (e) {
                console.error(`PARSE ERROR for ${p.program_adi}:`, e.message, "Data:", p.detaylar);
            }
        }
    }
}

checkData();
