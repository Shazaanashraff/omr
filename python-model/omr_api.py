from flask import Flask, request, jsonify
import os
import cv2
from detector import OMRDetector  # save your OMRDetector code as detector.py
from werkzeug.utils import secure_filename
import json

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

detector = OMRDetector()
detector.marking_threshold = 0.3  # adjust as needed

@app.route('/predict', methods=['POST'])
def predict():
    print("Received a request to /predict")

    if 'file' not in request.files:
        print("No file uploaded in the request")
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    print(f"File saved to {file_path}")

    # Try to read answerKey from form
    answer_key_json = request.form.get('answerKey', '{}')
    try:
        answer_key = json.loads(answer_key_json)  # { "1": "A", "2": "C", ... }
        print(f"Answer key received: {answer_key}")
    except json.JSONDecodeError:
        answer_key = {}
        print("Failed to parse answer key, using empty key")

    try:
        # Run OMR detection pipeline
        print("Running OMR detection pipeline...")
        bounding_boxes, results, vis_img = detector.process_omr_sheet(file_path)
        print(f"Bounding boxes: {bounding_boxes}")
        print(f"Detection results: {results}")

        answer_summary = detector.get_answer_summary(results)
        print(f"Answer summary: {answer_summary}")

        # Sort answers
        sorted_answer_summary = {k: answer_summary[k] for k in sorted(answer_summary, key=lambda x: int(x[1:]))}
        print(f"Sorted answer summary: {sorted_answer_summary}")

        # Compare with provided answer key if available
        detailed_result = {}
        correct_count = 0
        total_questions = len(answer_key)

        if answer_key:
            print("Comparing predictions with the provided answer key...")
            for q, correct_ans in answer_key.items():
                # Normalize key: remove any "Q" prefix
                key_number = str(q).replace("Q", "")
                normalized_key = f"Q{key_number}"
                predicted_ans = sorted_answer_summary.get(normalized_key, None)
                is_correct = predicted_ans == correct_ans
                detailed_result[normalized_key] = {
                    'correctAnswer': correct_ans,
                    'predictedAnswer': predicted_ans,
                    'isCorrect': is_correct
                }
                if is_correct:
                    correct_count += 1

            score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
            print(f"Correct answers: {correct_count}/{total_questions}")
            print(f"Score percentage: {score_percentage}%")
            response_data = {
                'answers': sorted_answer_summary,
                'detailedResult': detailed_result,
                'totalQuestions': total_questions,
                'correctCount': correct_count,
                'scorePercentage': round(score_percentage, 2)
            }
        else:
            print("No answer key provided, returning only predictions")
            response_data = {
                'answers': sorted_answer_summary
            }

        # Optional: save visualization
        vis_path = os.path.join(app.config['UPLOAD_FOLDER'], f'vis_{filename}')
        cv2.imwrite(vis_path, vis_img)
        print(f"Visualization saved to {vis_path}")

        return jsonify(response_data)

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Temporary file {file_path} deleted")

if __name__ == '__main__':
    print("Starting Flask server on port 5001...")
    app.run(port=5001, debug=True)