from flask import Flask, request, jsonify
import os
import cv2
from detector import OMRDetector  # save your code as detector.py
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

detector = OMRDetector()
detector.marking_threshold = 0.3  # adjust as needed

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        # Run your existing OMR pipeline
        bounding_boxes, results, vis_img = detector.process_omr_sheet(file_path)

        # Optional: save visualization image
        vis_path = os.path.join(app.config['UPLOAD_FOLDER'], f'vis_{filename}')
        cv2.imwrite(vis_path, vis_img)

        # Generate clean answer summary
        answer_summary = detector.get_answer_summary(results)

        # Sort the answers by question number
        sorted_answer_summary = {key: answer_summary[key] for key in sorted(answer_summary, key=lambda x: int(x[1:]))}

        return jsonify({'answers': sorted_answer_summary})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)  # remove uploaded file

if __name__ == '__main__':
    app.run(port=5001, debug=True)
