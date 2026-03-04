from typing import Dict, Any, List


def determine_risk_level(probability: float) -> str:
    """
    Determine risk level based on depression probability
    
    Args:
        probability: Depression probability (0-1)
    
    Returns:
        Risk level: 'Low', 'Moderate', or 'High'
    """
    if probability < 0.3:
        return "Low"
    elif probability < 0.6:
        return "Moderate"
    else:
        return "High"


def get_risk_level_color(risk_level: str) -> str:
    """Get color code for risk level"""
    colors = {
        "Low": "#22c55e",      # Green
        "Moderate": "#f59e0b", # Amber
        "High": "#ef4444"      # Red
    }
    return colors.get(risk_level, "#6b7280")


def get_risk_level_description(risk_level: str) -> str:
    """Get description for risk level"""
    descriptions = {
        "Low": "Your results suggest a low risk of depression. Continue maintaining healthy lifestyle habits.",
        "Moderate": "Your results indicate moderate risk. Consider consulting a mental health professional for further evaluation.",
        "High": "Your results suggest high risk. It is strongly recommended to seek professional help immediately."
    }
    return descriptions.get(risk_level, "")


def analyze_symptom_severity(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze the severity of various symptoms
    
    Args:
        patient_data: Patient input data
    
    Returns:
        Dictionary with symptom analysis
    """
    symptoms = {
        "sleep_issues": [],
        "mood_issues": [],
        "physical_symptoms": [],
        "stress_factors": []
    }
    
    # Sleep issues (low sleep duration, poor sleep quality)
    if patient_data.get('sleep_duration', 8) < 6:
        symptoms["sleep_issues"].append("Insufficient sleep duration")
    if patient_data.get('sleep_quality', 10) <= 4:
        symptoms["sleep_issues"].append("Poor sleep quality")
        
    # Mood issues
    if patient_data.get('mood_score', 10) <= 4:
        symptoms["mood_issues"].append("Low mood")
    if patient_data.get('interest_loss', 1) >= 7:
        symptoms["mood_issues"].append("Significant loss of interest")
    if patient_data.get('hopelessness_score', 1) >= 7:
        symptoms["mood_issues"].append("Feelings of hopelessness")
    if patient_data.get('irritability_score', 1) >= 7:
        symptoms["mood_issues"].append("High irritability")
        
    # Physical symptoms
    if patient_data.get('energy_level', 10) <= 4:
        symptoms["physical_symptoms"].append("Low energy")
    if patient_data.get('appetite_changes', 1) >= 7:
        symptoms["physical_symptoms"].append("Significant appetite changes")
    if patient_data.get('concentration_score', 10) <= 4:
        symptoms["physical_symptoms"].append("Poor concentration")
        
    # Stress factors
    if patient_data.get('academic_work_stress', 1) >= 7:
        symptoms["stress_factors"].append("High work/academic stress")
    if patient_data.get('financial_stress', 1) >= 7:
        symptoms["stress_factors"].append("High financial stress")
    if patient_data.get('relationship_stress', 1) >= 7:
        symptoms["stress_factors"].append("High relationship stress")
        
    return symptoms


def calculate_risk_score(patient_data: Dict[str, Any], probability: float) -> Dict[str, Any]:
    """
    Calculate comprehensive risk score
    
    Args:
        patient_data: Patient input data
        probability: Depression probability
    
    Returns:
        Dictionary with risk analysis
    """
    risk_level = determine_risk_level(probability)
    
    # Analyze symptoms
    symptoms = analyze_symptom_severity(patient_data)
    
    # Count concerning symptoms
    total_concerns = (
        len(symptoms["sleep_issues"]) +
        len(symptoms["mood_issues"]) +
        len(symptoms["physical_symptoms"]) +
        len(symptoms["stress_factors"])
    )
    
    return {
        "risk_level": risk_level,
        "risk_color": get_risk_level_color(risk_level),
        "risk_description": get_risk_level_description(risk_level),
        "symptoms": symptoms,
        "total_concerns": total_concerns,
        "probability_percentage": round(probability * 100, 1)
    }


def get_cluster_description(cluster: int) -> str:
    """Get description for cluster category"""
    descriptions = {
        0: "Cluster 0: This group typically shows lower symptom severity with better coping mechanisms.",
        1: "Cluster 1: This group shows higher symptom severity requiring more intensive support."
    }
    return descriptions.get(cluster, "Unknown cluster")

