import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

# Features: [java, react, node, docker, aws, mongodb, python, scikit-learn, pandas, sql, tensorflow, kubernetes]
X = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], # AI/Cloud Expert (98)
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0], # Data Scientist (90)
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0], # Backend Dev (75)
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], # Frontend Dev (40)
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1], # DevOps Engineer (80)
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0], # Junior Data Analyst (55)
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], # Junior Fullstack (35)
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1], # Infrastructure Lead (88)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], # No Skills (5)
    [0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0], # Web/Data Mix (60)
]

y = [98, 90, 75, 40, 80, 55, 35, 88, 5, 60]

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model, "model.pkl")
print("Model trained with 12-feature vectors.")