// getting the API key from the dotenv file
require('dotenv').config();
// using axios to fetching the API endpoint
const axios = require('axios');
// using the crypto module in the Node.js -- OpenSSL's hash
const crypto = require('crypto');
// using the file system module to creating file
const fs = require('fs');


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

// from here we are creating the file from the API endpoint
const run = () => {
    const hash = crypto.createHash('sha256');
    const inputStream = fs.createReadStream('./test.txt');
    inputStream.pipe(hash);

    hash.on('readable', async () => {
        const data = hash.read();
        if (data) {
            const fileDigest = data.toString('hex').toUpperCase();
            try {
                const res = await instance.get(`/hash/${fileDigest}`);
                const { data } = res;
                if (data[fileDigest] === 'Not Found') {
                    console.log("Hash not found. Attempting file upload")
                    try {
                        const res = await instance.post('/file', fs.createReadStream('./test.txt'));
                        const { data } = res;
                        if (data.status === "inqueue") {
                        console.log('File has been queued for scanning');
                        } else {
                            console.log('Unable to queue the file for scanning');
                            console.log(data);
                        }
                    } catch (e) {
                        if (e.response.status === 500) {
                        console.log('Internal Server error, but starting poll loop anyway');
                        }
                        console.log("Something went wrong: ");
                        console.log(e);
                    }
                } else {
                    console.log('Cached result found');
                    printResults(data);
                }
            } catch (e) {
                console.log(e);
            }
        }
    });  
};