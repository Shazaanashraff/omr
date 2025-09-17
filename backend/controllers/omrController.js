const { sendToPythonAPI } = require('../utils/callPythonAPI');
const fs = require('fs');

exports.uploadOmr = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        if (!req.body.answers || !req.body.quizName) 
            return res.status(400).json({ success: false, message: 'Answer key not provided' });

        const filePath = req.file.path;
        const answerKey = JSON.parse(req.body.answers); // {1: 'A', 2: 'C', ...}
        const quizName = req.body.quizName;

        // Call Python API for predictions
        const prediction = await sendToPythonAPI(filePath, answerKey); // { answers: {1:'A', 2:'B', ...} }

        // Delete temp file
        fs.unlinkSync(filePath);

        // Compare predicted answers with key
        const predicted = prediction.answers;
        let totalQuestions = Object.keys(answerKey).length;
        let correctCount = 0;
        let detailedResult = {};

        for (let q in answerKey) {
            const correct = answerKey[q];
            const normalizedKey = q.startsWith("Q") ? q : `Q${q}`; // ensure key matches predicted format
            const predictedAnswer = predicted[normalizedKey] || null;
            detailedResult[normalizedKey] = {
                correctAnswer: correct,
                predictedAnswer,
                isCorrect: correct === predictedAnswer
            };
            if (correct === predictedAnswer) correctCount++;
        }
        


        res.json({
            success: true,
            quizName,
            totalQuestions,
            correctCount,
            detailedResult,
            scorePercentage: ((correctCount / totalQuestions) * 100).toFixed(2)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to process OMR' });
    }
};
