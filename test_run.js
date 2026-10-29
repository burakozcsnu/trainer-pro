const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let state = {
    members: [], exercises: [], programs: [], measurements: [], workouts: [], documents: [], cloudFiles: [],
    activeMemberId: null, undoStack: [], navHistory: ['members-view'],
    surveyAnswers: {}, currentStep: 0, measurementRequired: false
};

async function sync() {
    try {
        const results = await Promise.all([
            supabase.from('uyeler').select('*'),
            supabase.from('programlar').select('*'),
            supabase.from('olcumler').select('*'),
            supabase.from('antrenmanlar').select('*'),
            supabase.from('dokumanlar').select('*'),
            supabase.from('master_egzersizler').select('*')
        ]);
        
        if (!results[0].error) state.members = results[0].data;
        if (!results[1].error) state.programs = results[1].data;
        if (!results[2].error) state.measurements = results[2].data;
        if (!results[3].error) state.workouts = results[3].data;
        if (!results[4].error) state.documents = results[4].data;
        if (!results[5].error) state.exercises = results[5].data;

        console.log("Sync complete. Members:", state.members.length, "Exercises:", state.exercises.length);
        
        // Test renderExercises
        const groups = { 'Üst Ekstremite': [], 'Alt Ekstremite': [], 'Branşa Özel': [], 'Genel': [] };
        state.exercises.forEach(ex => {
            const g = typeof ex.gruplar === 'string' ? JSON.parse(ex.gruplar || '{}') : ex.gruplar || {};
            if (g.bodyPart === 'Üst Ekstremite') groups['Üst Ekstremite'].push(ex);
            else if (g.bodyPart === 'Alt Ekstremite') groups['Alt Ekstremite'].push(ex);
            else if ((g.branch && g.branch !== 'Fitness') || (ex.brans && ex.brans !== 'Fitness')) groups['Branşa Özel'].push(ex);
            else groups['Genel'].push(ex);
        });
        console.log("Rendered exercises successfully.");
        
    } catch (e) { 
        console.error("Sync partial failure:", e); 
    }
}

sync();
