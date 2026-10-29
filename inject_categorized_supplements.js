const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categorizedSupplements = [
    // --- 💪 PROTEIN TOZLARI ---
    { ad: "Whey Protein İsole (İzole Whey)", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (30g)", kalori: 110, protein: 25, karbonhidrat: 1, yag: 0.5 },
    { ad: "Whey Protein Konsantre", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (30g)", kalori: 120, protein: 23, karbonhidrat: 2, yag: 1.5 },
    { ad: "Kazein Proteini (Casein)", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (30g)", kalori: 110, protein: 24, karbonhidrat: 3, yag: 1 },
    { ad: "Bitkisel/Vegan Protein Blend", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (30g)", kalori: 120, protein: 22, karbonhidrat: 3, yag: 2 },
    { ad: "Et Proteini (Beef Protein Isolate)", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (30g)", kalori: 115, protein: 27, karbonhidrat: 0, yag: 0 },
    { ad: "Kolajen Peptit (Tip 1, 2, 3)", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (10g)", kalori: 35, protein: 9, karbonhidrat: 0, yag: 0 },
    { ad: "Yumurta Akı Proteini (Egg White)", tip: "💪 Protein Tozları", porsiyon: "1 Ölçek (30g)", kalori: 110, protein: 24, karbonhidrat: 1, yag: 0 },

    // --- 🔋 KARBONHİDRATLAR & GAINERS ---
    { ad: "Karbonhidrat Tozu (Mass Gainer)", tip: "🔋 Karbonhidratlar", porsiyon: "1 Porsiyon (330g)", kalori: 1250, protein: 50, karbonhidrat: 250, yag: 5 },
    { ad: "Maltodekstrin", tip: "🔋 Karbonhidratlar", porsiyon: "1 Ölçek (50g)", kalori: 190, protein: 0, karbonhidrat: 47, yag: 0 },
    { ad: "Dekstroz (Dextrose)", tip: "🔋 Karbonhidratlar", porsiyon: "1 Ölçek (50g)", kalori: 190, protein: 0, karbonhidrat: 47, yag: 0 },
    { ad: "Vitargo (Yüksek Moleküler Carb)", tip: "🔋 Karbonhidratlar", porsiyon: "1 Ölçek (50g)", kalori: 190, protein: 0, karbonhidrat: 47, yag: 0 },
    { ad: "Siklik Dekstrin (Cluster Dextrin)", tip: "🔋 Karbonhidratlar", porsiyon: "1 Ölçek (25g)", kalori: 95, protein: 0, karbonhidrat: 24, yag: 0 },

    // --- 🧬 AMİNO ASİTLER ---
    { ad: "BCAA (2:1:1)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (7g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "EAA (Esansiyel Amino Asitler)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (10g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "L-Glutamin (Glutamine)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Arjinin (L-Arginine)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Beta-Alanin", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (3g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Sitrülin Malat (Citrulline Malate)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "L-Tirozin (L-Tyrosine)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (1g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Taurin (Taurine)", tip: "🧬 Amino Asitler", porsiyon: "1 Ölçek (2g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },

    // --- ⚡ PERFORMANS & ENERJİ ---
    { ad: "Kreatin Monohidrat (Creatine)", tip: "⚡ Performans & Enerji", porsiyon: "1 Ölçek (5g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Pre-Workout (Antrenman Öncesi)", tip: "⚡ Performans & Enerji", porsiyon: "1 Ölçek (15g)", kalori: 10, protein: 0, karbonhidrat: 2, yag: 0 },
    { ad: "Kreatin HCL", tip: "⚡ Performans & Enerji", porsiyon: "1 Ölçek (2g)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Kafein (Caffeine Pill)", tip: "⚡ Performans & Enerji", porsiyon: "1 Kapsül (200mg)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Elektrolit Tozu (Electrolytes)", tip: "⚡ Performans & Enerji", porsiyon: "1 Ölçek (5g)", kalori: 5, protein: 0, karbonhidrat: 1, yag: 0 },

    // --- 🔥 YAĞ YAKICILAR & METABOLİZMA ---
    { ad: "L-Karnitin (L-Carnitine Liquid)", tip: "🔥 Yağ Yakıcılar", porsiyon: "1 Servis (30ml)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "CLA (Konjuge Linoleik Asit)", tip: "🔥 Yağ Yakıcılar", porsiyon: "1 Kapsül", kalori: 10, protein: 0, karbonhidrat: 0, yag: 1 },
    { ad: "Termojenik Yağ Yakıcı (Thermogenic)", tip: "🔥 Yağ Yakıcılar", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Yeşil Çay Ekstresi (Green Tea Extract)", tip: "🔥 Yağ Yakıcılar", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },

    // --- 💊 VİTAMİNLER ---
    { ad: "Multivitamin (Geniş Spektrum)", tip: "💊 Vitaminler", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin C (1000mg Ascorbic Acid)", tip: "💊 Vitaminler", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin D3 (Cholecalciferol)", tip: "💊 Vitaminler", porsiyon: "1 Kapsül (1000-5000 IU)", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "B-Kompleks Vitamini", tip: "💊 Vitaminler", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "B12 Vitamini (Methylcobalamin)", tip: "💊 Vitaminler", porsiyon: "1 Dilaltı Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin E (Tocopherol)", tip: "💊 Vitaminler", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin K2 (MK-7)", tip: "💊 Vitaminler", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Folik Asit (B9 Vitamini)", tip: "💊 Vitaminler", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Biotin (B7 Vitamini)", tip: "💊 Vitaminler", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Vitamin A (Retinol)", tip: "💊 Vitaminler", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },

    // --- 🪨 MİNERALLER ---
    { ad: "Magnezyum Sitrat (Magnesium Citrate)", tip: "🪨 Mineraller", porsiyon: "1 Tablet/Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Magnezyum Glisinat (Magnesium Glycinate)", tip: "🪨 Mineraller", porsiyon: "1 Tablet/Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Magnezyum Malat (Magnesium Malate)", tip: "🪨 Mineraller", porsiyon: "1 Tablet/Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Çinko Pikolinat (Zinc Picolinate)", tip: "🪨 Mineraller", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "ZMA (Çinko, Magnezyum, B6)", tip: "🪨 Mineraller", porsiyon: "3 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Demir (Iron Bisglycinate)", tip: "🪨 Mineraller", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Kalsiyum (Calcium)", tip: "🪨 Mineraller", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Potasyum (Potassium Citrate)", tip: "🪨 Mineraller", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Selenyum (Selenium)", tip: "🪨 Mineraller", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "İyot (Iodine/Kelp)", tip: "🪨 Mineraller", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },

    // --- 🌿 SAĞLIK & WELLNESS ---
    { ad: "Omega-3 Balık Yağı (Fish Oil)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 10, protein: 0, karbonhidrat: 0, yag: 1 },
    { ad: "Krill Yağı (Krill Oil)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 5, protein: 0, karbonhidrat: 0, yag: 0.5 },
    { ad: "Ashwagandha KSM-66", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Maca Kökü (Maca Root)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Melatonin", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Tablet", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Probiyotik (Probiotics - 10B CFU)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Sindirimi Enzimleri (Digestive Enzymes)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Zerdeçal/Kurkumin (Turmeric/Curcumin)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Sarımsak Ekstresi (Garlic Extract)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Ginseng (Panax)", tip: "🌿 Sağlık & Wellness", porsiyon: "1 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Glukozamin & Kondroitin (Joint Support)", tip: "🌿 Sağlık & Wellness", porsiyon: "2 Kapsül", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 }
];

async function injectGroupedSupplements() {
    console.log('Step 1: Deleting old generic "💊 Supplement" entries to avoid duplicates...');
    const { error: deleteError } = await supabase
        .from('master_besinler')
        .delete()
        .eq('tip', '💊 Supplement');
        
    if (deleteError) {
        console.error('Error deleting old supplements:', deleteError);
    } else {
        console.log('Old generic supplements deleted successfully.');
    }

    console.log(`Step 2: Preparing to inject ${categorizedSupplements.length} newly categorized supplements...`);
    
    const timestamp = Date.now();
    const formattedSupplements = categorizedSupplements.map((sup, index) => ({
        id: timestamp + index,
        ad: sup.ad,
        tip: sup.tip,
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
        console.log('Successfully injected all categorized supplements into the database!');
    }
}

injectGroupedSupplements().catch(console.error);