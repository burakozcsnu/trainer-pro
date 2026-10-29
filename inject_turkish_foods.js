const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mdcvljbbnoxqsfwcjvqz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const foodsToDelete = [
    '🥐 Unlu Mamüller',
    '🍫 Tatlı ve Atıştırmalıklar',
    '🍔 Hazır Yemekler',
    '🍎 Meyveler',
    '🥩 Et ve Tavuk Ürünleri',
    '🍲 Diğer Yemekler',
    '🧈 Yağlar',
    '🥦 Sebzeler',
    '🥤 İçecekler',
    '🌾 Tahıl ve Hububat',
    '🍼 Bebek Gıdaları',
    '🥚 Süt ve Yumurta',
    '🌿 Baharatlar',
    '🐟 Deniz Ürünleri',
    '🫘 Baklagiller'
];

const newTurkishFoods = [
    // --- 🥩 Et ve Tavuk Ürünleri ---
    { ad: "Tavuk Göğsü (Çiğ)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 120, protein: 23, karbonhidrat: 0, yag: 2.6 },
    { ad: "Tavuk Göğsü (Izgara/Haşlama)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 165, protein: 31, karbonhidrat: 0, yag: 3.6 },
    { ad: "Tavuk But (Derisiz)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 175, protein: 20, karbonhidrat: 0, yag: 10 },
    { ad: "Tavuk Kanat (Derili)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 254, protein: 17, karbonhidrat: 0, yag: 20 },
    { ad: "Hindi Göğsü", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 114, protein: 24, karbonhidrat: 0, yag: 1.5 },
    { ad: "Dana Kıyma (%10 Yağlı)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 212, protein: 26, karbonhidrat: 0, yag: 11 },
    { ad: "Dana Kıyma (%20 Yağlı)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 254, protein: 25, karbonhidrat: 0, yag: 16 },
    { ad: "Dana Antrikot (Çiğ)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 291, protein: 23, karbonhidrat: 0, yag: 21 },
    { ad: "Dana Bonfile", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 250, protein: 26, karbonhidrat: 0, yag: 15 },
    { ad: "Dana Biftek (Yağsız)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 150, protein: 26, karbonhidrat: 0, yag: 4 },
    { ad: "Kuzu Pirzola", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 360, protein: 22, karbonhidrat: 0, yag: 30 },
    { ad: "Dana Ciğer", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 165, protein: 26, karbonhidrat: 4, yag: 4.4 },
    { ad: "Sucuk (Dana)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 330, protein: 14, karbonhidrat: 2, yag: 30 },
    { ad: "Sosis (Dana)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 250, protein: 12, karbonhidrat: 3, yag: 22 },
    { ad: "Hindi Füme (Füme Et)", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 104, protein: 20, karbonhidrat: 1, yag: 2 },
    { ad: "Pastırma", tip: "🥩 Et ve Tavuk Ürünleri", kalori: 300, protein: 30, karbonhidrat: 1, yag: 20 },

    // --- 🐟 Deniz Ürünleri ---
    { ad: "Somon (Çiğ)", tip: "🐟 Deniz Ürünleri", kalori: 208, protein: 20, karbonhidrat: 0, yag: 13 },
    { ad: "Somon (Izgara)", tip: "🐟 Deniz Ürünleri", kalori: 250, protein: 25, karbonhidrat: 0, yag: 16 },
    { ad: "Ton Balığı (Konserve, Suda)", tip: "🐟 Deniz Ürünleri", kalori: 116, protein: 26, karbonhidrat: 0, yag: 1 },
    { ad: "Ton Balığı (Konserve, Yağda süzülmüş)", tip: "🐟 Deniz Ürünleri", kalori: 198, protein: 29, karbonhidrat: 0, yag: 8 },
    { ad: "Levrek", tip: "🐟 Deniz Ürünleri", kalori: 97, protein: 18, karbonhidrat: 0, yag: 2 },
    { ad: "Çipura", tip: "🐟 Deniz Ürünleri", kalori: 125, protein: 19, karbonhidrat: 0, yag: 5 },
    { ad: "Hamsi (Izgara)", tip: "🐟 Deniz Ürünleri", kalori: 210, protein: 20, karbonhidrat: 0, yag: 14 },
    { ad: "Mezgit", tip: "🐟 Deniz Ürünleri", kalori: 90, protein: 19, karbonhidrat: 0, yag: 1 },
    { ad: "Karides (Haşlanmış)", tip: "🐟 Deniz Ürünleri", kalori: 99, protein: 24, karbonhidrat: 0.2, yag: 0.3 },

    // --- 🥚 Süt ve Yumurta ---
    { ad: "Yumurta (Bütün, Haşlanmış)", tip: "🥚 Süt ve Yumurta", kalori: 155, protein: 13, karbonhidrat: 1.1, yag: 11 },
    { ad: "Yumurta Akı", tip: "🥚 Süt ve Yumurta", kalori: 52, protein: 11, karbonhidrat: 0.7, yag: 0.2 },
    { ad: "Lor Peyniri (Az Yağlı)", tip: "🥚 Süt ve Yumurta", kalori: 85, protein: 14, karbonhidrat: 3, yag: 1 },
    { ad: "Tam Yağlı Beyaz Peynir", tip: "🥚 Süt ve Yumurta", kalori: 280, protein: 14, karbonhidrat: 2, yag: 24 },
    { ad: "Süzme Peynir", tip: "🥚 Süt ve Yumurta", kalori: 98, protein: 11, karbonhidrat: 3.4, yag: 4.3 },
    { ad: "Kaşar Peyniri", tip: "🥚 Süt ve Yumurta", kalori: 350, protein: 26, karbonhidrat: 2.5, yag: 26 },
    { ad: "Cheddar Peyniri", tip: "🥚 Süt ve Yumurta", kalori: 400, protein: 25, karbonhidrat: 1.3, yag: 33 },
    { ad: "Süt (Tam Yağlı, %3.5)", tip: "🥚 Süt ve Yumurta", kalori: 61, protein: 3.2, karbonhidrat: 4.8, yag: 3.3 },
    { ad: "Süt (Yarım Yağlı, %1.5)", tip: "🥚 Süt ve Yumurta", kalori: 47, protein: 3.3, karbonhidrat: 4.8, yag: 1.5 },
    { ad: "Süt (Yağsız)", tip: "🥚 Süt ve Yumurta", kalori: 34, protein: 3.4, karbonhidrat: 5, yag: 0.1 },
    { ad: "Süzme Yoğurt (Tam Yağlı)", tip: "🥚 Süt ve Yumurta", kalori: 115, protein: 9, karbonhidrat: 4, yag: 7 },
    { ad: "Süzme Yoğurt (Yağsız)", tip: "🥚 Süt ve Yumurta", kalori: 59, protein: 10, karbonhidrat: 3.6, yag: 0.4 },
    { ad: "Ev Yoğurdu", tip: "🥚 Süt ve Yumurta", kalori: 61, protein: 3.5, karbonhidrat: 4.7, yag: 3.3 },
    { ad: "Kefir", tip: "🥚 Süt ve Yumurta", kalori: 43, protein: 3.3, karbonhidrat: 4, yag: 1.5 },
    { ad: "Tereyağı", tip: "🥚 Süt ve Yumurta", kalori: 717, protein: 0.9, karbonhidrat: 0.1, yag: 81 },

    // --- 🌾 Tahıl ve Hububat ---
    { ad: "Yulaf Ezmesi (Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 389, protein: 16.9, karbonhidrat: 66.3, yag: 6.9 },
    { ad: "Pirinç (Beyaz, Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 360, protein: 6.6, karbonhidrat: 80, yag: 0.6 },
    { ad: "Pirinç (Beyaz, Haşlanmış)", tip: "🌾 Tahıl ve Hububat", kalori: 130, protein: 2.7, karbonhidrat: 28, yag: 0.3 },
    { ad: "Esmer Pirinç (Kepekli, Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 362, protein: 7.5, karbonhidrat: 76, yag: 2.7 },
    { ad: "Bulgur (Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 342, protein: 12.3, karbonhidrat: 76, yag: 1.3 },
    { ad: "Bulgur (Haşlanmış)", tip: "🌾 Tahıl ve Hububat", kalori: 83, protein: 3.1, karbonhidrat: 18.6, yag: 0.2 },
    { ad: "Makarna (Beyaz, Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 371, protein: 13, karbonhidrat: 75, yag: 1.5 },
    { ad: "Makarna (Beyaz, Haşlanmış)", tip: "🌾 Tahıl ve Hububat", kalori: 131, protein: 5, karbonhidrat: 25, yag: 1 },
    { ad: "Tam Buğday Makarna (Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 348, protein: 15, karbonhidrat: 75, yag: 1.5 },
    { ad: "Kinoa (Quinoa, Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 368, protein: 14.1, karbonhidrat: 64, yag: 6 },
    { ad: "Karabuğday (Buckwheat, Çiğ)", tip: "🌾 Tahıl ve Hububat", kalori: 343, protein: 13.3, karbonhidrat: 71.5, yag: 3.4 },
    { ad: "Pirinç Patlağı (Pirinç Keki)", tip: "🌾 Tahıl ve Hububat", kalori: 387, protein: 8, karbonhidrat: 82, yag: 2.8 },
    { ad: "Tam Buğday Ekmeği", tip: "🌾 Tahıl ve Hububat", kalori: 250, protein: 10, karbonhidrat: 43, yag: 4 },
    { ad: "Beyaz Ekmek", tip: "🌾 Tahıl ve Hububat", kalori: 265, protein: 9, karbonhidrat: 49, yag: 3.2 },
    { ad: "Çavdar Ekmeği", tip: "🌾 Tahıl ve Hububat", kalori: 259, protein: 9, karbonhidrat: 48, yag: 3.3 },

    // --- 🫘 Baklagiller ---
    { ad: "Kırmızı Mercimek (Çiğ)", tip: "🫘 Baklagiller", kalori: 353, protein: 25.8, karbonhidrat: 60, yag: 1.1 },
    { ad: "Yeşil Mercimek (Çiğ)", tip: "🫘 Baklagiller", kalori: 353, protein: 25, karbonhidrat: 60, yag: 1.1 },
    { ad: "Mercimek (Haşlanmış)", tip: "🫘 Baklagiller", kalori: 116, protein: 9, karbonhidrat: 20, yag: 0.4 },
    { ad: "Nohut (Çiğ)", tip: "🫘 Baklagiller", kalori: 364, protein: 19, karbonhidrat: 61, yag: 6 },
    { ad: "Nohut (Haşlanmış)", tip: "🫘 Baklagiller", kalori: 164, protein: 8.9, karbonhidrat: 27, yag: 2.6 },
    { ad: "Kuru Fasulye (Çiğ)", tip: "🫘 Baklagiller", kalori: 347, protein: 21, karbonhidrat: 63, yag: 1.2 },
    { ad: "Kuru Fasulye (Haşlanmış)", tip: "🫘 Baklagiller", kalori: 127, protein: 8.7, karbonhidrat: 23, yag: 0.5 },
    { ad: "Barbunya (Çiğ)", tip: "🫘 Baklagiller", kalori: 333, protein: 24, karbonhidrat: 60, yag: 0.8 },
    { ad: "Bezelye (Taze)", tip: "🫘 Baklagiller", kalori: 81, protein: 5.4, karbonhidrat: 14, yag: 0.4 },
    { ad: "Soya Fasulyesi", tip: "🫘 Baklagiller", kalori: 446, protein: 36, karbonhidrat: 30, yag: 20 },
    { ad: "Edamame (Soya Fasulyesi, Haşlanmış)", tip: "🫘 Baklagiller", kalori: 121, protein: 11.9, karbonhidrat: 8.9, yag: 5.2 },

    // --- 🥦 Sebzeler ---
    { ad: "Brokoli (Çiğ)", tip: "🥦 Sebzeler", kalori: 34, protein: 2.8, karbonhidrat: 6.6, yag: 0.4 },
    { ad: "Brokoli (Haşlanmış)", tip: "🥦 Sebzeler", kalori: 35, protein: 2.4, karbonhidrat: 7.2, yag: 0.4 },
    { ad: "Ispanak (Çiğ)", tip: "🥦 Sebzeler", kalori: 23, protein: 2.9, karbonhidrat: 3.6, yag: 0.4 },
    { ad: "Kuşkonmaz", tip: "🥦 Sebzeler", kalori: 20, protein: 2.2, karbonhidrat: 3.9, yag: 0.1 },
    { ad: "Patates (Beyaz, Çiğ)", tip: "🥦 Sebzeler", kalori: 77, protein: 2, karbonhidrat: 17, yag: 0.1 },
    { ad: "Patates (Fırınlanmış/Haşlanmış)", tip: "🥦 Sebzeler", kalori: 93, protein: 2.5, karbonhidrat: 21, yag: 0.1 },
    { ad: "Tatlı Patates (Çiğ)", tip: "🥦 Sebzeler", kalori: 86, protein: 1.6, karbonhidrat: 20, yag: 0.1 },
    { ad: "Havuç", tip: "🥦 Sebzeler", kalori: 41, protein: 0.9, karbonhidrat: 9.6, yag: 0.2 },
    { ad: "Domates", tip: "🥦 Sebzeler", kalori: 18, protein: 0.9, karbonhidrat: 3.9, yag: 0.2 },
    { ad: "Salatalık", tip: "🥦 Sebzeler", kalori: 15, protein: 0.7, karbonhidrat: 3.6, yag: 0.1 },
    { ad: "Kabak", tip: "🥦 Sebzeler", kalori: 16, protein: 0.7, karbonhidrat: 3.4, yag: 0.2 },
    { ad: "Marul / Göbek", tip: "🥦 Sebzeler", kalori: 14, protein: 0.9, karbonhidrat: 2.9, yag: 0.1 },
    { ad: "Roka", tip: "🥦 Sebzeler", kalori: 25, protein: 2.6, karbonhidrat: 3.7, yag: 0.7 },
    { ad: "Kırmızı Biber (Kapya)", tip: "🥦 Sebzeler", kalori: 31, protein: 1, karbonhidrat: 6, yag: 0.3 },
    { ad: "Yeşil Biber (Çarliston/Sivri)", tip: "🥦 Sebzeler", kalori: 20, protein: 0.9, karbonhidrat: 4.6, yag: 0.2 },
    { ad: "Mantar (Kültür)", tip: "🥦 Sebzeler", kalori: 22, protein: 3.1, karbonhidrat: 3.3, yag: 0.3 },
    { ad: "Soğan (Kuru)", tip: "🥦 Sebzeler", kalori: 40, protein: 1.1, karbonhidrat: 9.3, yag: 0.1 },
    { ad: "Sarımsak", tip: "🥦 Sebzeler", kalori: 149, protein: 6.4, karbonhidrat: 33, yag: 0.5 },
    { ad: "Kabak (Yeşil)", tip: "🥦 Sebzeler", kalori: 17, protein: 1.2, karbonhidrat: 3.1, yag: 0.3 },
    { ad: "Patlıcan", tip: "🥦 Sebzeler", kalori: 25, protein: 1, karbonhidrat: 5.9, yag: 0.2 },
    { ad: "Karnabahar", tip: "🥦 Sebzeler", kalori: 25, protein: 1.9, karbonhidrat: 5, yag: 0.3 },
    { ad: "Lahana", tip: "🥦 Sebzeler", kalori: 25, protein: 1.3, karbonhidrat: 5.8, yag: 0.1 },

    // --- 🍎 Meyveler ---
    { ad: "Muz", tip: "🍎 Meyveler", kalori: 89, protein: 1.1, karbonhidrat: 23, yag: 0.3 },
    { ad: "Elma", tip: "🍎 Meyveler", kalori: 52, protein: 0.3, karbonhidrat: 14, yag: 0.2 },
    { ad: "Portakal", tip: "🍎 Meyveler", kalori: 47, protein: 0.9, karbonhidrat: 12, yag: 0.1 },
    { ad: "Mandalina", tip: "🍎 Meyveler", kalori: 53, protein: 0.8, karbonhidrat: 13.3, yag: 0.3 },
    { ad: "Karpuz", tip: "🍎 Meyveler", kalori: 30, protein: 0.6, karbonhidrat: 7.6, yag: 0.2 },
    { ad: "Kavun", tip: "🍎 Meyveler", kalori: 34, protein: 0.8, karbonhidrat: 8.2, yag: 0.2 },
    { ad: "Üzüm", tip: "🍎 Meyveler", kalori: 69, protein: 0.7, karbonhidrat: 18, yag: 0.2 },
    { ad: "Çilek", tip: "🍎 Meyveler", kalori: 32, protein: 0.7, karbonhidrat: 7.7, yag: 0.3 },
    { ad: "Yaban Mersini (Blueberry)", tip: "🍎 Meyveler", kalori: 57, protein: 0.7, karbonhidrat: 14, yag: 0.3 },
    { ad: "Böğürtlen", tip: "🍎 Meyveler", kalori: 43, protein: 1.4, karbonhidrat: 9.6, yag: 0.5 },
    { ad: "Avokado", tip: "🍎 Meyveler", kalori: 160, protein: 2, karbonhidrat: 8.5, yag: 14.7 },
    { ad: "Kiraz", tip: "🍎 Meyveler", kalori: 50, protein: 1, karbonhidrat: 12, yag: 0.3 },
    { ad: "Şeftali", tip: "🍎 Meyveler", kalori: 39, protein: 0.9, karbonhidrat: 9.5, yag: 0.3 },
    { ad: "Kayısı", tip: "🍎 Meyveler", kalori: 48, protein: 1.4, karbonhidrat: 11, yag: 0.4 },
    { ad: "Armut", tip: "🍎 Meyveler", kalori: 57, protein: 0.4, karbonhidrat: 15, yag: 0.1 },
    { ad: "İncir (Taze)", tip: "🍎 Meyveler", kalori: 74, protein: 0.8, karbonhidrat: 19, yag: 0.3 },
    { ad: "Limon", tip: "🍎 Meyveler", kalori: 29, protein: 1.1, karbonhidrat: 9.3, yag: 0.3 },
    { ad: "Ananas", tip: "🍎 Meyveler", kalori: 50, protein: 0.5, karbonhidrat: 13, yag: 0.1 },
    { ad: "Hurma (Taze)", tip: "🍎 Meyveler", kalori: 74, protein: 0.8, karbonhidrat: 19, yag: 0.3 },
    { ad: "Hurma (Kuru, Trabzon/Medjool)", tip: "🍎 Meyveler", kalori: 277, protein: 1.8, karbonhidrat: 75, yag: 0.2 },
    { ad: "Kuru Üzüm", tip: "🍎 Meyveler", kalori: 299, protein: 3.1, karbonhidrat: 79, yag: 0.5 },
    { ad: "Kuru İncir", tip: "🍎 Meyveler", kalori: 249, protein: 3.3, karbonhidrat: 64, yag: 0.9 },
    { ad: "Kuru Kayısı", tip: "🍎 Meyveler", kalori: 241, protein: 3.4, karbonhidrat: 63, yag: 0.5 },

    // --- 🧈 Yağlar ve Kuru Yemişler (Snacks) ---
    { ad: "Zeytinyağı", tip: "🧈 Yağlar", kalori: 884, protein: 0, karbonhidrat: 0, yag: 100 },
    { ad: "Hindistan Cevizi Yağı", tip: "🧈 Yağlar", kalori: 862, protein: 0, karbonhidrat: 0, yag: 100 },
    { ad: "Badem (Çiğ)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 579, protein: 21, karbonhidrat: 21, yag: 50 },
    { ad: "Ceviz (Çiğ)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 654, protein: 15, karbonhidrat: 14, yag: 65 },
    { ad: "Fıstık (Yer Fıstığı, Tuzsuz)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 567, protein: 26, karbonhidrat: 16, yag: 49 },
    { ad: "Fıstık Ezmesi (Şekersiz, Doğal)", tip: "🧈 Yağlar", kalori: 588, protein: 25, karbonhidrat: 20, yag: 50 },
    { ad: "Badem Ezmesi (Şekersiz)", tip: "🧈 Yağlar", kalori: 614, protein: 21, karbonhidrat: 19, yag: 56 },
    { ad: "Kaju (Çiğ)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 553, protein: 18, karbonhidrat: 30, yag: 44 },
    { ad: "Antep Fıstığı (Kavrulmuş)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 562, protein: 20, karbonhidrat: 28, yag: 45 },
    { ad: "Fındık (Kavrulmuş)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 628, protein: 15, karbonhidrat: 17, yag: 61 },
    { ad: "Ay Çekirdeği (Kavrulmuş, İç)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 584, protein: 21, karbonhidrat: 20, yag: 51 },
    { ad: "Kabak Çekirdeği (Kavrulmuş, İç)", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 574, protein: 30, karbonhidrat: 15, yag: 49 },
    { ad: "Chia Tohumu", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 486, protein: 16.5, karbonhidrat: 42, yag: 30.7 },
    { ad: "Keten Tohumu", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 534, protein: 18.3, karbonhidrat: 28.9, yag: 42.2 },

    // --- 🥤 İçecekler ---
    { ad: "Filtre Kahve (Şekersiz, Sütsüz)", tip: "🥤 İçecekler", kalori: 2, protein: 0.1, karbonhidrat: 0, yag: 0 },
    { ad: "Türk Kahvesi (Sade)", tip: "🥤 İçecekler", kalori: 7, protein: 0.4, karbonhidrat: 1.5, yag: 0.1 },
    { ad: "Çay (Siyah, Şekersiz)", tip: "🥤 İçecekler", kalori: 1, protein: 0, karbonhidrat: 0.3, yag: 0 },
    { ad: "Yeşil Çay (Şekersiz)", tip: "🥤 İçecekler", kalori: 1, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Kola (Normal)", tip: "🥤 İçecekler", kalori: 42, protein: 0, karbonhidrat: 10.6, yag: 0 },
    { ad: "Kola (Zero/Light)", tip: "🥤 İçecekler", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Soda / Maden Suyu (Sade)", tip: "🥤 İçecekler", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Ayran (Tam Yağlı)", tip: "🥤 İçecekler", kalori: 38, protein: 2, karbonhidrat: 2.8, yag: 2.1 },
    { ad: "Ayran (Yarım Yağlı)", tip: "🥤 İçecekler", kalori: 28, protein: 2.1, karbonhidrat: 3, yag: 0.8 },

    // --- 🍔 Hazır Yemekler & Diğer ---
    { ad: "Zeytin (Siyah)", tip: "🍲 Diğer Yemekler", kalori: 115, protein: 0.8, karbonhidrat: 6.3, yag: 10.7 },
    { ad: "Zeytin (Yeşil)", tip: "🍲 Diğer Yemekler", kalori: 145, protein: 1, karbonhidrat: 3.8, yag: 15.3 },
    { ad: "Bal", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 304, protein: 0.3, karbonhidrat: 82, yag: 0 },
    { ad: "Pekmez", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 290, protein: 0, karbonhidrat: 74, yag: 0 },
    { ad: "Tahin", tip: "🍫 Tatlı ve Atıştırmalıklar", kalori: 595, protein: 17, karbonhidrat: 21, yag: 54 },
    { ad: "Yulaf Unu", tip: "🌾 Tahıl ve Hububat", kalori: 404, protein: 15, karbonhidrat: 66, yag: 9 },
    { ad: "Pirinç Unu", tip: "🌾 Tahıl ve Hububat", kalori: 366, protein: 6, karbonhidrat: 80, yag: 1.4 },
    { ad: "Esmer Şeker", tip: "🌿 Baharatlar", kalori: 380, protein: 0.1, karbonhidrat: 98, yag: 0 },
    { ad: "Beyaz Şeker", tip: "🌿 Baharatlar", kalori: 387, protein: 0, karbonhidrat: 100, yag: 0 },
    { ad: "Tuz", tip: "🌿 Baharatlar", kalori: 0, protein: 0, karbonhidrat: 0, yag: 0 },
    { ad: "Kakao Tozu (Şekersiz)", tip: "🌿 Baharatlar", kalori: 228, protein: 20, karbonhidrat: 58, yag: 14 },
    { ad: "Tarçın", tip: "🌿 Baharatlar", kalori: 247, protein: 4, karbonhidrat: 81, yag: 1.2 },
    { ad: "Karabiber", tip: "🌿 Baharatlar", kalori: 251, protein: 10, karbonhidrat: 64, yag: 3.3 },
    { ad: "Ketçap", tip: "🍲 Diğer Yemekler", kalori: 112, protein: 1.2, karbonhidrat: 26, yag: 0.1 },
    { ad: "Mayonez", tip: "🍲 Diğer Yemekler", kalori: 680, protein: 1, karbonhidrat: 0.6, yag: 75 },
    { ad: "Hardal", tip: "🍲 Diğer Yemekler", kalori: 66, protein: 4.4, karbonhidrat: 5.8, yag: 3.3 }
];

async function replaceLibrary() {
    console.log('Step 1: Deleting old bloated USDA foods...');
    
    // Delete in chunks using IN clause for food categories
    // Or better, delete where tip is in foodsToDelete
    
    const { data, error: deleteError } = await supabase
        .from('master_besinler')
        .delete()
        .in('tip', foodsToDelete);

    if (deleteError) {
        console.error('Error deleting old foods:', deleteError);
    } else {
        console.log('Old USDA foods successfully wiped!');
    }

    console.log(`Step 2: Preparing to inject ${newTurkishFoods.length} curated Turkish foods...`);
    
    const timestamp = Date.now();
    const formattedFoods = newTurkishFoods.map((f, index) => ({
        id: timestamp + index,
        ad: f.ad,
        tip: f.tip,
        porsiyon: "100g", // Default measurement for absolute precision
        kalori: f.kalori,
        protein: f.protein,
        karbonhidrat: f.karbonhidrat,
        yag: f.yag
    }));

    const { error: insertError } = await supabase
        .from('master_besinler')
        .upsert(formattedFoods, { onConflict: 'id' });

    if (insertError) {
        console.error('Error injecting new foods:', insertError);
    } else {
        console.log('Successfully injected the curated Turkish Food Library!');
    }
}

replaceLibrary().catch(console.error);