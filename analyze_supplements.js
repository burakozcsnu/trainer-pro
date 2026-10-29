const XLSX = require('xlsx');

const FILE_PATH = 'c:\\Users\\bnboz\\Desktop\\supplements.xlsx';

function analyzeExcel() {
    try {
        const workbook = XLSX.readFile(FILE_PATH);
        
        for (const sheetName of workbook.SheetNames) {
            console.log(`\n\n--- Sheet: ${sheetName} ---`);
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            console.log(`Total rows: ${data.length}`);
            if (data.length > 0) {
                console.log(JSON.stringify(data.slice(0, 3), null, 2));
            }
        }
    } catch (e) {
        console.error('Error reading Excel file:', e);
    }
}

analyzeExcel();