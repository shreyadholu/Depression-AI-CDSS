from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PatientBase(BaseModel):
    """Base patient data schema"""
    age: int = Field(..., ge=13, le=100, description="Patient age")
    gender: str = Field(..., description="Patient gender")
    bmi: float = Field(..., ge=10, le=60, description="Body Mass Index")
    blood_pressure_systolic: int = Field(..., ge=70, le=200, description="Systolic blood pressure")
    blood_pressure_diastolic: int = Field(..., ge=40, le=120, description="Diastolic blood pressure")
    heart_rate: int = Field(..., ge=40, le=200, description="Heart rate in BPM")
    
    # Lifestyle factors
    sleep_duration: float = Field(..., ge=0, le=24, description="Average sleep duration in hours")
    physical_activity: int = Field(..., ge=0, le=7, description="Days of physical activity per week")
    diet_quality: int = Field(..., ge=1, le=10, description="Diet quality rating 1-10")
    substance_use: str = Field(..., description="Substance use level")
    social_support: int = Field(..., ge=1, le=10, description="Social support rating 1-10")
    
    # Stress factors
    academic_work_stress: int = Field(..., ge=1, le=10, description="Academic/work stress level 1-10")
    financial_stress: int = Field(..., ge=1, le=10, description="Financial stress level 1-10")
    relationship_stress: int = Field(..., ge=1, le=10, description="Relationship stress level 1-10")
    
    # Mental health indicators
    mood_score: int = Field(..., ge=1, le=10, description="Mood score 1-10")
    anxiety_level: int = Field(..., ge=1, le=10, description="Anxiety level 1-10")
    energy_level: int = Field(..., ge=1, le=10, description="Energy level 1-10")
    concentration_score: int = Field(..., ge=1, le=10, description="Concentration ability 1-10")
    appetite_changes: int = Field(..., ge=1, le=10, description="Appetite changes 1-10")
    sleep_quality: int = Field(..., ge=1, le=10, description="Sleep quality 1-10")
    interest_loss: int = Field(..., ge=1, le=10, description="Loss of interest 1-10")
    hopelessness_score: int = Field(..., ge=1, le=10, description="Hopelessness score 1-10")
    irritability_score: int = Field(..., ge=1, le=10, description="Irritability score 1-10")


class PatientCreate(PatientBase):
    """Schema for creating a new patient assessment"""
    patient_id: Optional[str] = Field(None, description="Optional patient ID")
    name: Optional[str] = Field(None, description="Patient name")


class PatientResponse(BaseModel):
    """Response schema for patient prediction"""
    # Prediction results
    depression_probability: float = Field(..., description="Probability of depression (0-1)")
    final_diagnosis: str = Field(..., description="Diagnosis result (Yes/No)")
    risk_level: str = Field(..., description="Risk level (Low/Moderate/High)")
    cluster_category: int = Field(..., description="Cluster category (0 or 1)")
    is_outlier: bool = Field(..., description="Whether patient is an outlier")
    outlier_message: Optional[str] = Field(None, description="Outlier warning message")
    
    # Recommendations
    recommendations: List[str] = Field(..., description="AI-generated recommendations")
    priority_action: str = Field(..., description="Priority action based on risk level")
    
    # Metadata
    timestamp: datetime = Field(default_factory=datetime.now, description="Prediction timestamp")
    model_confidence: float = Field(..., description="Model confidence score")
    
    class Config:
        json_schema_extra = {
            "example": {
                "depression_probability": 0.75,
                "final_diagnosis": "Yes",
                "risk_level": "High",
                "cluster_category": 1,
                "is_outlier": False,
                "outlier_message": None,
                "recommendations": [
                    "Consider scheduling an appointment with a mental health professional",
                    "Engage in regular physical activity",
                    "Maintain a consistent sleep schedule"
                ],
                "priority_action": "Urgent: Please consult a psychiatrist immediately",
                "timestamp": "2024-01-15T10:30:00",
                "model_confidence": 0.89
            }
        }


class PatientHistory(BaseModel):
    """Schema for patient history record"""
    id: int
    patient_data: PatientBase
    result: PatientResponse
    timestamp: datetime = Field(default_factory=datetime.now)


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class User(BaseModel):
    """Schema for user"""
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class Token(BaseModel):
    """Schema for JWT token"""
    access_token: str
    token_type: str


class HealthCheck(BaseModel):
    """Schema for API health check"""
    status: str
    version: str
    model_loaded: bool
    timestamp: datetime

