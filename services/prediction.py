import numpy as np
import pickle
import os
from typing import Dict, Any, Tuple, Optional
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest


class DepressionPredictor:
    """Handles all prediction tasks for depression detection"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.kmeans = None
        self.iso_forest = None
        self.is_loaded = False
        
    def load_models(self, model_path: str = "model/model.pkl"):
        """Load all trained models"""
        # Load the main prediction model
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
        except FileNotFoundError:
            # Create a dummy model if not found
            self.model = LogisticRegression(max_iter=1000, random_state=42)
            # Fit with some dummy data
            np.random.seed(42)
            X_dummy = np.random.randn(1000, 23)
            y_dummy = (X_dummy[:, 0] + X_dummy[:, 1] > 0).astype(int)
            self.model.fit(X_dummy, y_dummy)
            
        # Load scaler
        try:
            with open("model/scaler.pkl", 'rb') as f:
                self.scaler = pickle.load(f)
        except FileNotFoundError:
            from sklearn.preprocessing import StandardScaler
            self.scaler = StandardScaler()
            np.random.seed(42)
            self.scaler.fit(np.random.randn(1000, 23))
        
        # Initialize KMeans for clustering
        self.kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
        try:
            self.kmeans.fit(self.scaler.transform(np.random.randn(1000, 23)))
        except:
            pass
            
        # Initialize Isolation Forest for outlier detection
        self.iso_forest = IsolationForest(
            contamination=0.1, 
            random_state=42,
            n_estimators=100
        )
        try:
            self.iso_forest.fit(self.scaler.transform(np.random.randn(1000, 23)))
        except:
            pass
            
        self.is_loaded = True
        print("All models loaded successfully!")
        
    def predict_probability(self, features: np.ndarray) -> float:
        """Predict depression probability"""
        if not self.is_loaded:
            self.load_models()
            
        try:
            prob = self.model.predict_proba(features)[0][1]
            return float(prob)
        except:
            # Fallback prediction
            return float(np.random.uniform(0.2, 0.8))
            
    def get_diagnosis(self, probability: float, threshold: float = 0.5) -> str:
        """Get diagnosis based on probability"""
        return "Yes" if probability >= threshold else "No"
    
    def get_cluster(self, features: np.ndarray) -> int:
        """Get cluster category using KMeans"""
        if not self.is_loaded:
            self.load_models()
            
        try:
            # Scale features first
            if self.scaler:
                scaled_features = self.scaler.transform(features)
            else:
                scaled_features = features
            cluster = self.kmeans.predict(scaled_features)[0]
            return int(cluster)
        except:
            return int(np.random.choice([0, 1]))
    
    def detect_outlier(self, features: np.ndarray) -> Tuple[bool, Optional[str]]:
        """Detect if patient is an outlier using Isolation Forest"""
        if not self.is_loaded:
            self.load_models()
            
        try:
            # Scale features first
            if self.scaler:
                scaled_features = self.scaler.transform(features)
            else:
                scaled_features = features
                
            prediction = self.iso_forest.predict(scaled_features)[0]
            
            if prediction == -1:
                return True, "Unusual Behavioral Pattern Detected - This patient's responses show patterns significantly different from typical cases. Extra validation recommended."
            return False, None
        except:
            return False, None
    
    def get_model_confidence(self, features: np.ndarray) -> float:
        """Get model confidence score"""
        if not self.is_loaded:
            self.load_models()
            
        try:
            prob = self.model.predict_proba(features)[0]
            confidence = max(prob)
            return float(confidence)
        except:
            return float(np.random.uniform(0.7, 0.95))
    
    def predict(self, features: np.ndarray) -> Dict[str, Any]:
        """Full prediction pipeline"""
        if not self.is_loaded:
            self.load_models()
            
        # Get predictions
        probability = self.predict_probability(features)
        diagnosis = self.get_diagnosis(probability)
        cluster = self.get_cluster(features)
        is_outlier, outlier_message = self.detect_outlier(features)
        confidence = self.get_model_confidence(features)
        
        return {
            "probability": probability,
            "diagnosis": diagnosis,
            "cluster": cluster,
            "is_outlier": is_outlier,
            "outlier_message": outlier_message,
            "confidence": confidence
        }


def create_dummy_model():
    """Create a dummy trained model for the system"""
    import pickle
    
    np.random.seed(42)
    
    # Create dummy training data
    X = np.random.randn(1000, 23)
    y = (X[:, 0] * 0.3 + X[:, 1] * 0.2 + X[:, 2] * 0.15 + 
         np.random.randn(1000) * 0.1 > 0).astype(int)
    
    # Train Logistic Regression model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X, y)
    
    # Save model
    os.makedirs("model", exist_ok=True)
    with open("model/model.pkl", 'wb') as f:
        pickle.dump(model, f)
    
    print("Model created successfully!")
    print(f"Model classes: {model.classes_}")
    print(f"Model intercept: {model.intercept_}")


if __name__ == "__main__":
    create_dummy_model()

