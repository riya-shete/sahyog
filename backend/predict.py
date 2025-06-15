import joblib

# Load the trained model
model = joblib.load("../ai/model.pkl")

# Prediction function
def predict_risk(test_data):
    hb_level = test_data["Hb"]
    prediction = model.predict([[hb_level]])[0]  # 0 or 1
    return "Anemia risk" if prediction == 1 else "Normal"