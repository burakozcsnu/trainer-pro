const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const supplementsList = [
    { ad: "Whey Protein İsole (İzole Whey)", porsiyon: "1 Ölçek (30g)", kalori: 110, protein: 25, karbonhidrat: 1, yag: 0.5 },
    { ad: "Whey Protein Konsantre", porsiyon: "1 Ölçek (30g)", kalori: 120, protein: 23, karbonhidrat: 2, yag: 1.5 },
    { ad: "Kazein Proteini (Casein)", porsiyon: "1 Ölçek (30g)", kalori: 110, protein: 24, karbonhidrat: 3, yag: 1 },
    { ad: "Bitkisel/Vegan Protein", porsiyon: "1 Ölçek (30g)", kalori: 120, protein: 22, karbonhidrat: 3, yag: 2 },
    { ad: "Et Proteini (Beef Protein)", porsiyon: "1 Ölçek (30g)", kalori: 115, protein: 27, karbonhidrat: 0, yag: 0 },
    { ad: "Kolajen Peptit (Collagen)", porsiyon: "1 Ölçek (10g)", kalori: 35, protein: 9, karbonhidrat: 0, yag: 0 },
    { ad: "Karbonhidrat Tozu (Mass Gainer)", porsiyon: "1 Porsiyon (330g)", kalori: 1250, protein: 50, karbonhidrat: 250, yag: 5 },
    { ad: "Maltodekstrin", porsiyon: "1 Ölçek (50g)", kalori: 190, protein: 0, karbonhidrat: 47, yag: 0 },
    { ad: "Dekstroz (Dextrose)", porsiyon: "1 Ölçek (50g)", kalori: 190, protein: 0, karbonhidrat: 47, yag: 0 },
    { ad: "Vitargo (Kompleks Karbonhidrat)", porsiyon: "1 Ölçek (50g)", kalori: 190, protein: 0, karbonhidrat: 47, yag: 0 },
    { ad: "Kreatin Monohidrat (Creatine)", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "BCAA (2:1:1)", porsiyon: "1 Ölçek (7g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "EAA (Esansiyel Amino Asitler)", porsiyon: "1 Ölçek (10g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "L-Glutamin (Glutamine)", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Pre-Workout (Antrenman Öncesi)", porsiyon: "1 Ölçek (15g)", kalori: 10, protein: 0, karbonhidrat: 2, yag: 0 },
    { ad: "Beta-Alanin", porsiyon: "1 Ölçek (3g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Sitrülin Malat (Citrulline Malate)", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Arjinin (L-Arginine)", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Omega-3 Balık Yağı", porsiyon: "1 Kapsül", kalori: 10, protein: 0, karbonhidrat: 0, yag: 1 },
    { ad: "CLA (Konjuge Linoleik Asit)", porsiyon: "1 Kapsül", kalori: 10, protein: 0, karbonhidrat: 0, yag: 1 },
    { ad: "L-Karnitin (L-Carnitine Liquid)", porsiyon: "1 Servis (30ml)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Multivitamin", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin C (1000mg)", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin D3", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Magnezyum (Magnesium)", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Çinko (Zinc)", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "ZMA", porsiyon: "3 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Elektrolit Tozu", porsiyon: "1 Ölçek (5g)", kalori: 5, protein: 0, karbonhidrat: 1, yag: 0 },
    { ad: "Ashwagandha", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Melatonin", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 }
];

async function injectSupplements() {
    console.log(`Preparing to inject ${supplementsList.length} supplements...`);
    
    // We will assign a unique ID using Date.now() + index to avoid collisions,
    // and explicitly set the 'tip' to the new '💊 Supplement' smart category.
    const timestamp = Date.now();
    const formattedSupplements = supplementsList.map((sup, index) => ({
        id: timestamp + index,
        ad: sup.ad,
        tip: '💊 Supplement',
        porsiyon: sup.porsiyon,
        kalori: sup.kalori,
        protein: sup.protein,
        karbonhidrat: sup.karbonhidrat,
        yag: sup.yag
    }));

    const { data, error } = await supabase
        .from('master_besinler')
        .upsert(formattedSupplements, { onConflict: 'id' });

    if (error) {
        console.error('Error injecting supplements:', error);
    } else {
        console.log('Successfully injected all supplements into the database!');
    }
}

injectSupplements().catch(console.error);