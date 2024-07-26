
const axios = require('axios');

const ABUSEIPDB_API_KEY = 'e4c51b7d11205605c81ce79b9dfb13bd56d5956f3417a5dbf1084704a1674416a48e3686b6b091bc'; // Replace with your AbuseIPDB API key
const ABUSEIPDB_API_URL = 'https://api.abuseipdb.com/api/v2/check';

const checkIP = async (ip) => {
    try {
        const response = await axios.get(ABUSEIPDB_API_URL, {
            headers: {
                'Key': ABUSEIPDB_API_KEY,
                'Accept': 'application/json'
            },
            params: {
                ipAddress: ip,
                maxAgeInDays: 90 // Customize as needed
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error.message : error.message);
    }
};

module.exports = { checkIP };
