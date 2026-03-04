import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from typing import Dict, Any
import pickle
import os


class Preprocessor:
    """Handles all preprocessing tasks for patient data"""
    
    def __init__(self):
        self.scaler = None
        self.label_encoders = {}
        self.feature_columns = [
            'age', 'gender_encoded', 'bmi', 'blood_pressure_systolic', 
            'blood_pressure_diastolic', 'heart_rate', 'sleep_duration',
            'physical_activity', 'diet_quality', 'substance_use_encoded',
            'social_support', 'academic_work_stress', 'financial_stress',
            'relationship_stress', 'mood_score', 'anxiety_level', 
            'energy_level', 'concentration_score', 'appetite_changes',
            'sleep_quality', 'interest_loss', 'hopelessness_score',
            'irritability_score'
        ]
        
    def load_scaler(self, scaler_path: str = "model/scaler.pkl"):
        """Load the pre-trained scaler"""
        try:
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
        except FileNotFoundError:
            # Create a new scaler if not found (for development)
            self.scaler = StandardScaler()
            
    def encode_categorical(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Encode categorical variables"""
        encoded_data = data.copy()
        
        # Encode gender
        gender_mapping = {'male': 0, 'female': 1, 'other': 2}
        encoded_data['gender_encoded'] = gender_mapping.get(
            data.get('gender', '').lower(), 0
        )
        
        # Encode substance_use
        substance_mapping = {
            'none': 0, 'low': 1, 'moderate': 2, 'high': 3
        }
        encoded_data['substance_use_encoded'] = substance_mapping.get(
            data.get('substance_use', '').lower(), 0
        )
        
        return encoded_data
    
    def create_feature_vector(self, data: Dict[str, Any]) -> np.ndarray:
        """Create feature vector from patient data"""
        # Encode categorical variables
        encoded_data = self.encode_categorical(data)
        
        # Extract features in correct order
        features = []
        for col in self.feature_columns:
            value = encoded_data.get(col, 0)
            if value is None:
                value = 0
            features.append(float(value))
            
        return np.array(features).reshape(1, -1)
    
    def scale_features(self, features: np.ndarray) -> np.ndarray:
        """Scale features using the loaded scaler"""
        if self.scaler is None:
            self.load_scaler()
            
        if self.scaler is not None:
            return self.scaler.transform(features)
        return features
    
    def preprocess(self, patient_data: Dict[str, Any]) -> np.ndarray:
        """Full preprocessing pipeline"""
        # Create feature vector
        features = self.create_feature_vector(patient_data)
        
        # Scale features
        scaled_features = self.scale_features(features)
        
        return scaled_features


def create_dummy_model_and_scaler():
    """Create dummy model and scaler for the system to work"""
    import pickle
    
    # Create a StandardScaler and fit it with some dummy data
    np.random.seed(42)
    dummy_data = np.random.randn(1000, 23)
    scaler = StandardScaler()
    scaler.fit(dummy_data)
    
    # Save scaler
    os.makedirs("model", exist_ok=True)
    with open("model/scaler.pkl", 'wb') as f:
        pickle.dump(scaler, f)
    
    print("Scaler created successfully!")


if __name__ == "__main__":
    create_dummy_model_and_scaler()

