"""
Script to create trained model and scaler pickle files
"""
import numpy as np
import pickle
import os
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest

# Set random seed for reproducibility
np.random.seed(42)

# Create model directory
os.makedirs("model", exist_ok=True)

# Generate dummy training data (23 features as per our schema)
# Features: age, gender_encoded, bmi, blood_pressure_systolic, blood_pressure_diastolic,
# heart_rate, sleep_duration, physical_activity, diet_quality, substance_use_encoded,
# social_support, academic_work_stress, financial_stress, relationship_stress,
# mood_score, anxiety_level, energy_level, concentration_score, appetite_changes,
# sleep_quality, interest_loss, hopelessness_score, irritability_score

n_samples = 2000
X = np.random.randn(n_samples, 23)

# Create somewhat realistic target variable
# Depression is correlated with: low mood, low energy, high anxiety, high stress, poor sleep
y = (
    (X[:, 14] * 0.3) +  # mood_score (negative correlation)
    (X[:, 16] * 0.2) +  # energy_level (negative correlation)
    (X[:, 15] * 0.25) + # anxiety_level (positive correlation)
    (X[:, 11] * 0.15) + # academic_work_stress (positive correlation)
    (X[:, 6] * -0.1) +  # sleep_duration (negative correlation)
    (X[:, 20] * 0.2) +   # interest_loss (positive correlation)
    (X[:, 21] * 0.15) +  # hopelessness_score (positive correlation)
    np.random.randn(n_samples) * 0.3
) > 0

y = y.astype(int)

print(f"Training data shape: {X.shape}")
print(f"Target distribution: {np.bincount(y)}")

# Create and fit scaler
print("\nCreating scaler...")
scaler = StandardScaler()
scaler.fit(X)

# Save scaler
with open("model/scaler.pkl", 'wb') as f:
    pickle.dump(scaler, f)
print("Scaler saved to model/scaler.pkl")

# Scale data for model training
X_scaled = scaler.transform(X)

# Train Logistic Regression model
print("\nTraining Logistic Regression model...")
model = LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced')
model.fit(X_scaled, y)

# Save model
with open("model/model.pkl", 'wb') as f:
    pickle.dump(model, f)
print("Model saved to model/model.pkl")

# Train KMeans for clustering
print("\nTraining KMeans model...")
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
kmeans.fit(X_scaled)

with open("model/kmeans.pkl", 'wb') as f:
    pickle.dump(kmeans, f)
print("KMeans saved to model/kmeans.pkl")

# Train Isolation Forest for outlier detection
print("\nTraining Isolation Forest model...")
iso_forest = IsolationForest(contamination=0.1, random_state=42, n_estimators=100)
iso_forest.fit(X_scaled)

with open("model/iso_forest.pkl", 'wb') as f:
    pickle.dump(iso_forest, f)
print("Isolation Forest saved to model/iso_forest.pkl")

print("\n" + "="*50)
print("All models created successfully!")
print("="*50)
print(f"\nModel classes: {model.classes_}")
print(f"Model intercept: {model.intercept_}")
print(f"Feature importance (top 5 coefficients):")
feature_names = [
    'age', 'gender', 'bmi', 'blood_pressure_systolic', 'blood_pressure_diastolic',
    'heart_rate', 'sleep_duration', 'physical_activity', 'diet_quality', 'substance_use',
    'social_support', 'academic_work_stress', 'financial_stress', 'relationship_stress',
    'mood_score', 'anxiety_level', 'energy_level', 'concentration_score', 'appetite_changes',
    'sleep_quality', 'interest_loss', 'hopelessness_score', 'irritability_score'
]
coef_importance = list(zip(feature_names, model.coef_[0]))
coef_importance.sort(key=lambda x: abs(x[1]), reverse=True)
for name, coef in coef_importance[:5]:
    print(f"  {name}: {coef:.4f}")

