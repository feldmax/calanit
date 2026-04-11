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

/**
 * Store user phone number in localStorage
 * @param {string} phone - User's phone number
 */
function setUserPhone(phone) {
    localStorage.setItem('calanit_user_phone', phone);
}

/**
 * Get user phone number from localStorage
 * @returns {string|null} User's phone number or null
 */
function getUserPhone() {
    return localStorage.getItem('calanit_user_phone');
}

/**
 * Detect device phone number
 * Uses device settings on mobile (iOS: Settings > Cellular > My Number)
 * Falls back to 050-1234567 for desktop testing
 *
 * Note: Browser-based web apps cannot directly access device phone number due to privacy.
 * For production iOS app, this would require:
 * - Native iOS app with proper permissions (CoreTelephony framework)
 * - Or SMS-based verification during onboarding
 * - Or deep link with phone number parameter
 *
 * For MVP testing: Uses default phone 050-1234567 (matches David Cohen in sample data)
 *
 * @returns {Promise<string>} Phone number
 */
async function detectDevicePhoneNumber() {
    // Check if phone number already stored
    let phone = getUserPhone();
    if (phone) {
        return phone;
    }

    // Default phone for desktop/web testing - matches David Cohen (apartment 1)
    const DEFAULT_PHONE = '050-1234567';

    try {
        // Check if we're on a mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (!isMobile) {
            // Desktop browser - use default test phone
            console.log('Desktop detected, using test phone:', DEFAULT_PHONE);
            setUserPhone(DEFAULT_PHONE);
            return DEFAULT_PHONE;
        }

        // Mobile device detected
        // For MVP web app: use default phone (same as desktop)
        // TODO: For native iOS app, integrate CoreTelephony to read actual device number
        console.log('Mobile detected, using test phone:', DEFAULT_PHONE);
        setUserPhone(DEFAULT_PHONE);
        return DEFAULT_PHONE;

    } catch (error) {
        console.log('Phone detection error, using default:', error);
        setUserPhone(DEFAULT_PHONE);
        return DEFAULT_PHONE;
    }
}

/**
 * Check if phone number exists in residents list
 * @param {string} phone - Phone number to check
 * @param {Array} residents - Array of resident objects
 * @returns {boolean} True if phone exists in residents list
 */
function isPhoneRegistered(phone, residents) {
    if (!phone || !residents) return false;

    // Normalize phone number (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '');

    return residents.some(resident => {
        const residentPhone = resident.phone.replace(/\D/g, '');
        return residentPhone === normalizedPhone;
    });
}

/**
 * Get resident by phone number
 * @param {string} phone - Phone number
 * @param {Array} residents - Array of resident objects
 * @returns {Object|null} Resident object or null
 */
function getResidentByPhone(phone, residents) {
    if (!phone || !residents) return null;

    // Normalize phone number (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '');

    return residents.find(resident => {
        const residentPhone = resident.phone.replace(/\D/g, '');
        return residentPhone === normalizedPhone;
    }) || null;
}

// Export functions
export {
    getParkingData,
    getResidentsData,
    getResidentsForParking,
    getTandemPartner,
    setUserPhone,
    getUserPhone,
    detectDevicePhoneNumber,
    isPhoneRegistered,
    getResidentByPhone
};
