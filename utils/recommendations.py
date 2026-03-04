from typing import Dict, Any, List


def get_recommendations_by_risk(risk_level: str, patient_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Get personalized recommendations based on risk level
    
    Args:
        risk_level: 'Low', 'Moderate', or 'High'
        patient_data: Optional patient data for personalized recommendations
    
    Returns:
        Dictionary with recommendations and priority action
    """
    recommendations = {
        "Low": [
            "Continue maintaining your regular sleep schedule (7-9 hours)",
            "Keep engaging in regular physical activity",
            "Practice stress management techniques like meditation or deep breathing",
            "Maintain social connections and support networks",
            "Monitor your mental health with regular self-check-ins"
        ],
        "Moderate": [
            "Consider scheduling an appointment with a counselor or therapist",
            "Start a daily journal to track your mood and triggers",
            "Implement a consistent sleep routine",
            "Reduce screen time before bed",
            "Engage in moderate physical exercise daily",
            "Reach out to trusted friends or family members for support",
            "Consider joining a support group"
        ],
        "High": [
            "Please consult a psychiatrist or mental health professional immediately",
            "Consider calling a crisis helpline if you're having thoughts of self-harm",
            "Reach out to a trusted person immediately",
            "Prioritize self-care and rest",
            "Avoid alcohol and drugs",
            "Create a safety plan",
            "Consider intensive outpatient treatment"
        ]
    }
    
    priority_actions = {
        "Low": "Keep up the great work! Continue your healthy habits and monitor your wellbeing.",
        "Moderate": "Important: Consider reaching out to a mental health professional within the next week.",
        "High": "Urgent: Please consult a psychiatrist or mental health professional immediately. If you're in crisis, please call emergency services or a crisis helpline."
    }
    
    return {
        "recommendations": recommendations.get(risk_level, []),
        "priority_action": priority_actions.get(risk_level, "")
    }


def get_personalized_recommendations(patient_data: Dict[str, Any], risk_level: str) -> List[str]:
    """
    Generate personalized recommendations based on specific symptoms
    
    Args:
        patient_data: Patient input data
        risk_level: Risk level
    
    Returns:
        List of personalized recommendations
    """
    personalized = []
    
    # Sleep-related recommendations
    sleep_duration = patient_data.get('sleep_duration', 8)
    sleep_quality = patient_data.get('sleep_quality', 10)
    
    if sleep_duration < 6:
        personalized.append("Your sleep duration is concerning. Aim for 7-9 hours of sleep daily.")
    if sleep_quality <= 5:
        personalized.append("Your sleep quality needs improvement. Try: consistent sleep schedule, dark room, no screens before bed.")
        
    # Physical activity
    physical_activity = patient_data.get('physical_activity', 0)
    if physical_activity < 3:
        personalized.append("Low physical activity can affect mood. Try to incorporate at least 30 minutes of exercise daily.")
        
    # Diet
    diet_quality = patient_data.get('diet_quality', 5)
    if diet_quality <= 4:
        personalized.append("Improving your diet can positively impact your mood. Consider adding more fruits, vegetables, and whole grains.")
        
    # Social support
    social_support = patient_data.get('social_support', 5)
    if social_support <= 4:
        personalized.append("Your social support seems limited. Consider joining community groups or reaching out to old friends.")
        
    # Stress factors
    stress_fields = ['academic_work_stress', 'financial_stress', 'relationship_stress']
    high_stress = [s for s in stress_fields if patient_data.get(s, 1) >= 7]
    
    if high_stress:
        personalized.append(f"You're experiencing high stress in: {', '.join([s.replace('_', ' ').title() for s in high_stress])}. Consider professional stress management.")
        
    # Mental health indicators
    if patient_data.get('anxiety_level', 1) >= 7:
        personalized.append("Your anxiety level is high. Consider anxiety management techniques like deep breathing, meditation, or CBT.")
        
    if patient_data.get('interest_loss', 1) >= 7:
        personalized.append("Loss of interest is a common depression symptom. Try engaging in activities you previously enjoyed, even in small steps.")
        
    if patient_data.get('hopelessness_score', 1) >= 7:
        personalized.append("Feelings of hopelessness should be discussed with a professional. Please reach out to a mental health provider.")
        
    # Get base recommendations
    base_recommendations = get_recommendations_by_risk(risk_level, patient_data)
    
    # Combine recommendations (avoiding duplicates)
    all_recommendations = base_recommendations["recommendations"]
    for rec in personalized:
        if rec not in all_recommendations:
            all_recommendations.append(rec)
            
    return all_recommendations


def generate_ai_recommendation(result: Dict[str, Any], patient_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate comprehensive AI recommendation
    
    Args:
        result: Prediction result
        patient_data: Patient input data
    
    Returns:
        Complete recommendation package
    """
    risk_level = result.get("risk_level", "Low")
    
    # Get personalized recommendations
    recommendations = get_personalized_recommendations(patient_data, risk_level)
    
    # Get priority action
    priority_action = get_recommendations_by_risk(risk_level)["priority_action"]
    
    # Add outlier-specific recommendation if applicable
    if result.get("is_outlier", False):
        recommendations.append(
            "Note: Your responses show unusual patterns. Please validate these results with a healthcare professional."
        )
        
    return {
        "recommendations": recommendations,
        "priority_action": priority_action,
        "risk_level": risk_level
    }

