// Google Sheets data fetching module
const SHEET_ID = '1TeBUmbUFM1ArcaMdFkSpszqjCzZQFqj-7jhoYAJB54Y';
const PARKING_SHEET = 'Parking';
const RESIDENTS_SHEET = 'Residents';

/**
 * Fetch CSV data from Google Sheets and convert to array of objects
 * @param {string} sheetName - Name of the sheet to fetch
 * @returns {Promise<Array>} Array of objects representing rows
 */
async function fetchSheetData(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error(`Error fetching data from ${sheetName}:`, error);
        throw error;
    }
}

/**
 * Parse CSV text to array of objects
 * @param {string} csvText - CSV formatted text
 * @returns {Array} Array of objects
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Parse header
    const headers = parseCSVLine(lines[0]);

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }

    return data;
}

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array<string>} Array of values
 */
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    return values;
}

/**
 * Fetch parking spaces data
 * @returns {Promise<Array>} Array of parking objects
 */
async function getParkingData() {
    return await fetchSheetData(PARKING_SHEET);
}

/**
 * Fetch residents data
 * @returns {Promise<Array>} Array of resident objects
 */
async function getResidentsData() {
    return await fetchSheetData(RESIDENTS_SHEET);
}

/**
 * Get resident info for a parking space
 * @param {string} parkingId - Parking space ID (e.g., "P-001")
 * @param {Array} residents - Array of resident objects
 * @returns {Array} Array of residents who own this parking space
 */
function getResidentsForParking(parkingId, residents) {
    return residents.filter(resident => {
        const parkingSpaces = resident.parking_spaces.split(',').map(p => p.trim());
        return parkingSpaces.includes(parkingId);
    });
}

/**
 * Check if parking space is part of a tandem pair
 * @param {string} parkingId - Parking space ID
 * @param {Array} parkingData - Array of parking objects
 * @returns {Object|null} Tandem partner info or null
 */
function getTandemPartner(parkingId, parkingData) {
    const parking = parkingData.find(p => p.parking_id === parkingId);
    if (!parking || parking.type !== 'tandem' || !parking.linked_id) {
        return null;
    }

    const partner = parkingData.find(p => p.parking_id === parking.linked_id);
    return partner || null;
}

// Export functions
export {
    getParkingData,
    getResidentsData,
    getResidentsForParking,
    getTandemPartner
};
