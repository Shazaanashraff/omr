import requests

# Replace with the path to your OMR sheet image
files = {'file': open('testOMR2.jpg', 'rb')}

response = requests.post('http://localhost:5001/predict', files=files)

# Sort the answers by question number
answers = response.json().get('answers', {})
sorted_answers = {key: answers[key] for key in sorted(answers, key=lambda x: int(x[1:]))}

print(sorted_answers)
