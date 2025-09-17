const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function sendToPythonAPI(filePath, answerKey = {}) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    // Include the answer key as JSON string
    form.append('answerKey', JSON.stringify(answerKey));

    try {
        const response = await axios.post('http://localhost:5001/predict', form, {
            headers: form.getHeaders()
        });

        return response.data; // Expect { answers: {1: 'A', 2: 'B', ...} }
    } catch (err) {
        console.error('Error calling Python API:', err.message);
        throw err;
    }
}

module.exports = { sendToPythonAPI };
