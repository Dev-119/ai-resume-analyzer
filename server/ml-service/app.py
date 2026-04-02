from flask import Flask, request, jsonify
import joblib
import numpy as np
import pdfplumber
import spacy

app = Flask(__name__)
model = joblib.load("model.pkl")
nlp = spacy.load("en_core_web_sm")
print("Loaded successfully")


ALL_SKILLS = [
    "java", "react", "node", "docker", "aws", "mongodb", 
    "python", "scikit-learn", "pandas", "sql", "tensorflow", "kubernetes"
]

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.lower()

def extract_skills(text):
    return [skill for skill in ALL_SKILLS if skill in text]

def extract_features(skills):
    return np.array([1 if s in skills else 0 for s in ALL_SKILLS]).reshape(1, -1)

def match_jd(resume_skills, jd_skills):
    matched = [s for s in resume_skills if s in jd_skills]
    missing = [s for s in jd_skills if s not in resume_skills]
    score = len(matched) / len(jd_skills) if jd_skills else 0
    return matched, missing, score

# Remove the unused compute_score function entirely

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["resume"]
    jd_skills = request.form.get("jd_skills", "").split(",")

    text = extract_text_from_pdf(file)
    resume_skills = extract_skills(text)

    # ✅ FIX: Calculate features BEFORE using/printing them
    features = extract_features(resume_skills)
    
    # Optional: print(f"Features: {features}") 

    model_score = float(model.predict(features)[0])

    # Clamp and Normalize
    model_score = max(0, min(100, model_score)) / 100
    matched, missing, match_score = match_jd(resume_skills, jd_skills)

    final_score = int((0.6 * model_score + 0.4 * match_score) * 100)

    return jsonify({
        "score": final_score,
        "skills": resume_skills,
        "matched_skills": matched,
        "missing_skills": missing
    })

if __name__ == "__main__":
    app.run(port=8000)