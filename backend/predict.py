# Links model.pkl
import joblib
model = joblib.load('ai/model.pkl')
def predict_risk(data):
    return model.predict([data['Hb']])  # Returns "Anemia" or "Normal"