const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categoryMap = {
    'Beef Products': '🥩 Et ve Tavuk Ürünleri',
    'Pork Products': '🥩 Et ve Tavuk Ürünleri',
    'Poultry Products': '🥩 Et ve Tavuk Ürünleri',
    'Lamb, Veal, and Game Products': '🥩 Et ve Tavuk Ürünleri',
    'Sausages and Luncheon Meats': '🥩 Et ve Tavuk Ürünleri',
    'Finfish and Shellfish Products': '🐟 Deniz Ürünleri',
    'Dairy and Egg Products': '🥚 Süt ve Yumurta',
    'Fruits and Fruit Juices': '🍎 Meyveler',
    'Vegetables and Vegetable Products': '🥦 Sebzeler',
    'Cereal Grains and Pasta': '🌾 Tahıl ve Hububat',
    'Breakfast Cereals': '🌾 Tahıl ve Hububat',
    'Legumes and Legume Products': '🫘 Baklagiller',
    'Baked Products': '🥐 Unlu Mamüller',
    'Fats and Oils': '🧈 Yağlar',
    'Sweets': '🍫 Tatlı ve Atıştırmalıklar',
    'Snacks': '🍫 Tatlı ve Atıştırmalıklar',
    'Beverages': '🥤 İçecekler',
    'İçecek': '🥤 İçecekler',
    'Fast Foods': '🍔 Hazır Yemekler',
    'Restaurant Foods': '🍔 Hazır Yemekler',
    'Spices and Herbs': '🌿 Baharatlar',
    'Baby Foods': '🍼 Bebek Gıdaları',
    'American Indian/Alaska Native Foods': '🍲 Diğer Yemekler',
    'Yemek': '🍲 Diğer Yemekler',
    'Supplement': '💊 Supplement',
};

async function fetchAll(table) {
    let allData = [];
    let from = 0;
    const step = 1000;
    while (true) {
        const { data, error } = await supabase.from(table).select('id, tip').range(from, from + step - 1);
        if (error) throw error;
        if (data && data.length > 0) {
            allData = allData.concat(data);
            from += step;
            if (data.length < step) break;
        } else {
            break;
        }
    }
    return allData;
}

async function groupFoods() {
    console.log('Fetching all foods from database...');
    const foods = await fetchAll('master_besinler');
    console.log(`Fetched ${foods.length} foods.`);

    const updates = [];
    let updatedCount = 0;

    for (const food of foods) {
        const currentType = food.tip || 'Yemek';
        const newType = categoryMap[currentType] || '🍲 Diğer Yemekler';
        
        if (currentType !== newType) {
            updates.push({ id: food.id, tip: newType });
            updatedCount++;
        }
    }

    console.log(`Found ${updatedCount} foods that need category updates.`);

    if (updates.length > 0) {
        console.log('Starting bulk update...');
        const BATCH_SIZE = 500;
        for (let i = 0; i < updates.length; i += BATCH_SIZE) {
            const batch = updates.slice(i, i + BATCH_SIZE);
            console.log(`Updating batch ${i / BATCH_SIZE + 1} of ${Math.ceil(updates.length / BATCH_SIZE)}...`);
            
            // We need to fetch the full records to upsert properly because upsert requires all NOT NULL fields or we might overwrite things.
            // Actually, Supabase `update` can be done individually, but bulk update is tricky without upserting all columns.
            // A better way is to do individual updates with Promise.all in small chunks to avoid missing fields.
            
            const promises = batch.map(u => supabase.from('master_besinler').update({ tip: u.tip }).eq('id', u.id));
            await Promise.all(promises);
        }
    }

    console.log('Smart categorization complete!');
}

groupFoods().catch(console.error);