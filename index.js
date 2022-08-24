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
// printing the formating result as required
const printResults = (json) => {
    console.log(json)
    const filename = process.argv[2];
    const overallStatus = json.scan_results.scan_all_result_a;
    console.log('---------- SCAN RESULTS ----------');
    console.log('filename: ', filename);
    console.log('overall_status: ', overallStatus);
    console.log('');
  
    const scanDetails = json.scan_results.scan_details
    const engines = Object.keys(scanDetails);
    for (let engine of engines) {
        const details = scanDetails[engine];
        console.log('engine: ', engine);
        console.log('threat_found: ', details.threat_found);
        console.log('scan_result: ', details.scan_result_i);
        console.log('def_time: ', details.def_time);
        console.log('');
    }
    console.log('----------------------------------');
    console.log('END');
};
