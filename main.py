"""
AI-Driven Clinical Decision Support System (CDSS) for Depression Detection
Main FastAPI Application
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from typing import Optional, List
import numpy as np
import pickle
import os
import json

from schemas.patient_schema import (
    PatientCreate, 
    PatientResponse, 
    UserLogin, 
    User, 
    Token, 
    HealthCheck
)
from services.preprocessing import Preprocessor
from services.prediction import DepressionPredictor
from services.risk_analysis import (
    determine_risk_level, 
    calculate_risk_score,
    get_cluster_description
)
from utils.recommendations import generate_ai_recommendation

# ==================== Configuration ====================
app = FastAPI(
    title="AI-CDSS Depression Detection API",
    description="AI-Driven Clinical Decision Support System for Depression Detection",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 Configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = "ai-cdss-depression-detection-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ==================== In-Memory Storage ====================
# In production, use a database
prediction_history: List[dict] = []
users_db = {
    "admin": {
        "username": "admin",
        "email": "admin@aidss.com",
        "full_name": "Admin User",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLhJ3K7m",  # "admin123"
        "disabled": False
    }
}

# ==================== Model Loading ====================
preprocessor = Preprocessor()
predictor = DepressionPredictor()

# Load models on startup
@app.on_event("startup")
async def load_models():
    """Load models on startup"""
    global predictor, preprocessor
    try:
        predictor.load_models("model/model.pkl")
        preprocessor.load_scaler("model/scaler.pkl")
        print("Models loaded successfully!")
    except Exception as e:
        print(f"Warning: Could not load models - {e}")
        print("Using fallback mode with auto-generated models")


# ==================== Authentication ====================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password - simplified for demo"""
    # In production, use passlib
    return plain_password == "admin123" if hashed_password else False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # In production, use jose
    return "fake-jwt-token-" + json.dumps(to_encode)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from token"""
    # Simplified for demo
    return User(username="admin", email="admin@aidss.com", full_name="Admin User")


# ==================== Routes ====================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AI-CDSS Depression Detection API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/api/health", response_model=HealthCheck)
async def health_check():
    """API health check endpoint"""
    return HealthCheck(
        status="healthy",
        version="1.0.0",
        model_loaded=predictor.is_loaded,
        timestamp=datetime.now()
    )


@app.post("/api/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint to get JWT token"""
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/predict", response_model=PatientResponse)
async def predict_depression(patient: PatientCreate):
    """
    Predict depression based on patient data
    
    This endpoint:
    1. Accepts patient input as JSON
    2. Preprocesses the data
    3. Makes predictions using ML models
    4. Returns diagnosis, probability, risk level, and recommendations
    """
    try:
        # Convert patient data to dict
        patient_data = patient.dict()
        
        # Remove non-feature fields
        patient_id = patient_data.pop('patient_id', None)
        name = patient_data.pop('name', None)
        
        # Preprocess input
        features = preprocessor.preprocess(patient_data)
        
        # Make prediction
        prediction = predictor.predict(features)
        
        # Get risk level
        risk_level = determine_risk_level(prediction['probability'])
        
        # Calculate risk score
        risk_analysis = calculate_risk_score(patient_data, prediction['probability'])
        
        # Generate recommendations
        result = {
            "probability": prediction['probability'],
            "diagnosis": prediction['diagnosis'],
            "risk_level": risk_level,
            "cluster": prediction['cluster'],
            "is_outlier": prediction['is_outlier'],
            "outlier_message": prediction['outlier_message'],
            "confidence": prediction['confidence']
        }
        
        ai_recommendation = generate_ai_recommendation(result, patient_data)
        
        # Create response
        response = PatientResponse(
            depression_probability=round(prediction['probability'], 4),
            final_diagnosis=prediction['diagnosis'],
            risk_level=risk_level,
            cluster_category=prediction['cluster'],
            is_outlier=prediction['is_outlier'],
            outlier_message=prediction['outlier_message'],
            recommendations=ai_recommendation['recommendations'],
            priority_action=ai_recommendation['priority_action'],
            timestamp=datetime.now(),
            model_confidence=round(prediction['confidence'], 4)
        )
        
        # Save to history (in production, use database)
        history_record = {
            "id": len(prediction_history) + 1,
            "patient_id": patient_id,
            "name": name,
            "patient_data": patient_data,
            "result": response.dict(),
            "timestamp": datetime.now().isoformat()
        }
        prediction_history.append(history_record)
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )


@app.get("/api/history", response_model=List[dict])
async def get_prediction_history(current_user: User = Depends(get_current_user)):
    """Get prediction history (requires authentication)"""
    return prediction_history


@app.get("/api/history/{record_id}", response_model=dict)
async def get_prediction_record(record_id: int, current_user: User = Depends(get_current_user)):
    """Get a specific prediction record"""
    for record in prediction_history:
        if record["id"] == record_id:
            return record
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Record not found"
    )


@app.delete("/api/history/{record_id}")
async def delete_prediction_record(record_id: int, current_user: User = Depends(get_current_user)):
    """Delete a prediction record"""
    global prediction_history
    prediction_history = [r for r in prediction_history if r["id"] != record_id]
    return {"message": "Record deleted successfully"}


@app.get("/api/analytics")
async def get_analytics(current_user: User = Depends(get_current_user)):
    """Get analytics from prediction history"""
    if not prediction_history:
        return {
            "total_predictions": 0,
            "risk_distribution": {"Low": 0, "Moderate": 0, "High": 0},
            "average_probability": 0,
            "outlier_count": 0
        }
    
    risk_counts = {"Low": 0, "Moderate": 0, "High": 0}
    total_probability = 0
    outlier_count = 0
    
    for record in prediction_history:
        result = record.get("result", {})
        risk = result.get("risk_level", "Low")
        risk_counts[risk] = risk_counts.get(risk, 0) + 1
        total_probability += result.get("depression_probability", 0)
        if result.get("is_outlier", False):
            outlier_count += 1
    
    return {
        "total_predictions": len(prediction_history),
        "risk_distribution": risk_counts,
        "average_probability": round(total_probability / len(prediction_history), 4),
        "outlier_count": outlier_count,
        "recent_predictions": prediction_history[-10:] if len(prediction_history) > 10 else prediction_history
    }


# ==================== Run Application ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

