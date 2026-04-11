from flask import Flask, render_template, request
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', results=None)

@app.route('/predict', methods=['POST'])
def predict():
    # Extracting Survey Data
    text_answer = request.form.get('behavioral_text')
    test_score = float(request.form.get('test_score'))
    collaboration = float(request.form.get('collaboration'))
    adaptability = float(request.form.get('adaptability'))

    # MOCK ML LOGIC (In production, load your trained .pkl model here)
    # X = Adaptability, Y = Collaboration, Z = Leadership (derived from NLP)
    score_x = adaptability * 10 
    score_y = collaboration * 10
    
    # Simple NLP logic for Leadership Z-axis
    leadership_keywords = ['lead', 'managed', 'decided', 'initiative', 'organized']
    score_z = 50 + (sum(1 for word in leadership_keywords if word in text_answer.lower()) * 10)
    score_z = min(100, score_z)

    # Final Overall Compatibility %
    final_avg = round((score_x + score_y + score_z) / 3, 1)

    # Mock Data for Comparison (The "2000 records" visualization)
    past_x = [random.randint(30, 95) for _ in range(15)]
    past_y = [random.randint(30, 95) for _ in range(15)]
    past_z = [random.randint(30, 95) for _ in range(15)]

    results = {
        'final_score': final_avg,
        'cand_x': score_x, 'cand_y': score_y, 'cand_z': score_z,
        'past_x': past_x, 'past_y': past_y, 'past_z': past_z
    }

    return render_template('index.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)