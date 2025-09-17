const { sendToPythonAPI } = require('../utils/callPythonAPI');

exports.uploadOmr = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const filePath = req.file.path;

        // Call Python API for predictions
        const prediction = await sendToPythonAPI(filePath);

        // Delete temp file
        fs.unlinkSync(filePath);

        // Save result in MongoDB
        const result = await OmrResult.create({
            studentId: req.body.studentId || 'Unknown',
            answers: prediction.answers  // <- this comes from Python API
        });

        res.json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to process OMR' });
    }
};
