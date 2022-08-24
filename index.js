// getting the API key from the dotenv file
require('dotenv').config();
// using axios to fetching the API endpoint
const axios = require('axios');

// getting the api working
const instance = axios.create({
    baseURL: 'https://api.metadefender.com/v4',
    headers: {
        'apikey': process.env.API_KEY,
    },
});