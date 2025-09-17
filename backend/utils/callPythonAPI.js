const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function sendToPythonAPI(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post('http://localhost:5001/predict', form, {
        headers: form.getHeaders()
    });

    return response.data;
}

module.exports = { sendToPythonAPI };
