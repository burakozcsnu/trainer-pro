const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FILE_PATH = 'c:\\Users\\bnboz\\Desktop\\FoodData_Central_foundation_food_json_2026-04-30\\FoodData_Central_foundation_food_json_2026-04-30.json';

async function importFoodData() {
    console.log('Reading JSON file...');
    const rawData = fs.readFileSync(FILE_PATH, 'utf8');
    const jsonData = JSON.parse(rawData);
    
    if (!jsonData.FoundationFoods) {
        console.error('Invalid JSON structure: Missing FoundationFoods array.');
        return;
    }

    const foods = jsonData.FoundationFoods;
    console.log(`Found ${foods.length} foods to import.`);

    const formattedFoods = [];

    for (const food of foods) {
        if (!food) continue;
        const nutrients = food.foodNutrients || [];
        
        const getNutrient = (id) => {
            const n = nutrients.find(x => x.nutrient.id === id);
            return n ? n.amount : 0;
        };

        const kalori = getNutrient(1008); // Energy (kcal)
        const protein = getNutrient(1003); // Protein
        const karbonhidrat = getNutrient(1005); // Carbohydrate
        const yag = getNutrient(1004); // Total lipid (fat)

        formattedFoods.push({
            id: food.fdcId, // Use fdcId to prevent duplicates if re-run
            ad: food.description.substring(0, 255), // Truncate just in case
            tip: food.foodCategory ? food.foodCategory.description : 'Yemek',
            porsiyon: '100g', // USDA standard
            kalori: parseFloat(kalori.toFixed(1)),
            protein: parseFloat(protein.toFixed(1)),
            karbonhidrat: parseFloat(karbonhidrat.toFixed(1)),
            yag: parseFloat(yag.toFixed(1))
        });
    }

    console.log('Transform complete. Starting upload to Supabase in batches...');

    const BATCH_SIZE = 500;
    for (let i = 0; i < formattedFoods.length; i += BATCH_SIZE) {
        const batch = formattedFoods.slice(i, i + BATCH_SIZE);
        console.log(`Uploading batch ${i / BATCH_SIZE + 1} of ${Math.ceil(formattedFoods.length / BATCH_SIZE)}...`);
        
        const { error } = await supabase
            .from('master_besinler')
            .upsert(batch, { onConflict: 'id' });

        if (error) {
            console.error('Error uploading batch:', error);
        }
    }

    console.log('Import completed successfully!');
}

importFoodData().catch(console.error);
