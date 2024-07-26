const axios = require('axios');


const VIRUSTOTAL_API_KEY = 'insert your API key here';
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3/ip_addresses/';

const checkIPWithVirusTotal = async (ip) => {
    try {
        const response = await axios.get(`${VIRUSTOTAL_API_URL}${ip}`, {
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('VirusTotal Error:', error.message); // Log error for debugging
        throw new Error(error.response ? error.response.data.error.message : error.message);
    }
};

module.exports = { checkIPWithVirusTotal };
