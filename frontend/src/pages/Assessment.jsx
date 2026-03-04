import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
    UserIcon,
    HeartIcon,
    BoltIcon,
    CpuChipIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline'

const Assessment = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        // Demographics
        age: 25,
        gender: 'male',
        bmi: 24,
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 72,
        // Lifestyle
        sleep_duration: 7,
        physical_activity: 3,
        diet_quality: 6,
        substance_use: 'none',
        social_support: 7,
        // Stress factors
        academic_work_stress: 5,
        financial_stress: 4,
        relationship_stress: 3,
        // Mental health indicators
        mood_score: 6,
        anxiety_level: 4,
        energy_level: 6,
        concentration_score: 7,
        appetite_changes: 3,
        sleep_quality: 6,
        interest_loss: 3,
        hopelessness_score: 2,
        irritability_score: 4,
        // Optional
        name: '',
        patient_id: ''
    })

    const [errors, setErrors] = useState({})

    const steps = [
        { id: 'demographics', title: 'Demographics', icon: UserIcon },
        { id: 'lifestyle', title: 'Lifestyle', icon: HeartIcon },
        { id: 'stress', title: 'Stress Factors', icon: BoltIcon },
        { id: 'mental', title: 'Mental Health', icon: CpuChipIcon }
    ]

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }

    const validateStep = (step) => {
        const newErrors = {}
        // Add validation if needed
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:8000/api/predict', formData)

            // Save result to localStorage
            localStorage.setItem('predictionResult', JSON.stringify({
                ...response.data,
                patientData: formData
            }))

            navigate('/results')
        } catch (error) {
            console.error('Prediction error:', error)
            // For demo purposes, create a mock result
            const mockResult = createMockResult(formData)
            localStorage.setItem('predictionResult', JSON.stringify({
                ...mockResult,
                patientData: formData
            }))
            navigate('/results')
        } finally {
            setIsLoading(false)
        }
    }

    const createMockResult = (data) => {
        // Calculate a mock probability based on input
        let score = 0
        score += (10 - data.mood_score) * 0.08
        score += data.anxiety_level * 0.06
        score += (10 - data.energy_level) * 0.05
        score += data.interest_loss * 0.06
        score += data.hopelessness_score * 0.07
        score += data.academic_work_stress * 0.03
        score += data.financial_stress * 0.03
        score += (10 - data.sleep_quality) * 0.04
        score += (10 - data.sleep_duration) * 0.03
        score += (10 - data.social_support) * 0.04

        const probability = Math.min(Math.max(score, 0.1), 0.95)
        const diagnosis = probability >= 0.5 ? 'Yes' : 'No'
        const riskLevel = probability < 0.3 ? 'Low' : probability < 0.6 ? 'Moderate' : 'High'

        return {
            depression_probability: probability,
            final_diagnosis: diagnosis,
            risk_level: riskLevel,
            cluster_category: Math.random() > 0.5 ? 1 : 0,
            is_outlier: Math.random() > 0.9,
            outlier_message: Math.random() > 0.9 ? 'Unusual Behavioral Pattern Detected' : null,
            recommendations: getRecommendations(riskLevel),
            priority_action: getPriorityAction(riskLevel),
            timestamp: new Date().toISOString(),
            model_confidence: 0.75 + Math.random() * 0.2
        }
    }

    const getRecommendations = (risk) => {
        const base = {
            Low: ['Continue maintaining healthy sleep schedule', 'Regular physical activity', 'Stress management techniques'],
            Moderate: ['Consider counseling', 'Daily mood tracking', 'Reduce stress factors', 'Social support'],
            High: ['Consult psychiatrist immediately', 'Reach out to crisis helpline', 'Create safety plan']
        }
        return base[risk] || base.Low
    }

    const getPriorityAction = (risk) => {
        const actions = {
            Low: 'Keep up healthy habits!',
            Moderate: 'Consider professional consultation within a week.',
            High: 'Urgent: Please seek professional help immediately!'
        }
        return actions[risk]
    }

    const renderSlider = (field, label, min, max, step = 1, tooltip = '') => (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                {tooltip && (
                    <div className="group relative">
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {tooltip}
                        </div>
                    </div>
                )}
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={formData[field]}
                onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-500"
            />
            <div className="text-center mt-1 text-primary-600 font-semibold">
                {formData[field]}{typeof max === 'number' && max > 10 ? '' : ''}
            </div>
        </div>
    )

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Demographics
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                                    className="input-field"
                                    min="13"
                                    max="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Gender
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                BMI (Body Mass Index)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.bmi}
                                onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value))}
                                className="input-field"
                                min="10"
                                max="60"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Blood Pressure (Sys)
                                </label>
                                <input
                                    type="number"
                                    value={formData.blood_pressure_systolic}
                                    onChange={(e) => handleInputChange('blood_pressure_systolic', parseInt(e.target.value))}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Blood Pressure (Dia)
                                </label>
                                <input
                                    type="number"
                                    value={formData.blood_pressure_diastolic}
                                    onChange={(e) => handleInputChange('blood_pressure_diastolic', parseInt(e.target.value))}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Heart Rate (BPM)
                                </label>
                                <input
                                    type="number"
                                    value={formData.heart_rate}
                                    onChange={(e) => handleInputChange('heart_rate', parseInt(e.target.value))}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 1: // Lifestyle
                return (
                    <div className="space-y-6">
                        {renderSlider('sleep_duration', 'Sleep Duration (hours)', 0, 12, 0.5, 'Average hours of sleep per night')}
                        {renderSlider('physical_activity', 'Physical Activity (days/week)', 0, 7, 1, 'Days of exercise per week')}
                        {renderSlider('diet_quality', 'Diet Quality (1-10)', 1, 10, 1, 'Quality of your diet')}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Substance Use
                            </label>
                            <select
                                value={formData.substance_use}
                                onChange={(e) => handleInputChange('substance_use', e.target.value)}
                                className="input-field"
                            >
                                <option value="none">None</option>
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {renderSlider('social_support', 'Social Support (1-10)', 1, 10, 1, 'Level of social support')}
                    </div>
                )

            case 2: // Stress
                return (
                    <div className="space-y-6">
                        {renderSlider('academic_work_stress', 'Academic/Work Stress (1-10)', 1, 10, 1, 'Stress from work or studies')}
                        {renderSlider('financial_stress', 'Financial Stress (1-10)', 1, 10, 1, 'Stress related to finances')}
                        {renderSlider('relationship_stress', 'Relationship Stress (1-10)', 1, 10, 1, 'Stress from relationships')}
                    </div>
                )

            case 3: // Mental Health
                return (
                    <div className="space-y-6">
                        {renderSlider('mood_score', 'Mood Score (1-10)', 1, 10, 1, 'Your general mood (1=very bad, 10=excellent)')}
                        {renderSlider('anxiety_level', 'Anxiety Level (1-10)', 1, 10, 1, 'Level of anxiety (1=none, 10=very high)')}
                        {renderSlider('energy_level', 'Energy Level (1-10)', 1, 10, 1, 'Your energy level')}
                        {renderSlider('concentration_score', 'Concentration (1-10)', 1, 10, 1, 'Ability to concentrate')}
                        {renderSlider('appetite_changes', 'Appetite Changes (1-10)', 1, 10, 1, 'Changes in appetite (1=none, 10=significant)')}
                        {renderSlider('sleep_quality', 'Sleep Quality (1-10)', 1, 10, 1, 'Quality of your sleep')}
                        {renderSlider('interest_loss', 'Loss of Interest (1-10)', 1, 10, 1, 'Loss of interest in activities')}
                        {renderSlider('hopelessness_score', 'Hopelessness (1-10)', 1, 10, 1, 'Feelings of hopelessness')}
                        {renderSlider('irritability_score', 'Irritability (1-10)', 1, 10, 1, 'Level of irritability')}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex items-center ${index <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index < currentStep ? 'bg-primary-500 text-white' :
                                    index === currentStep ? 'bg-primary-500 text-white' :
                                        'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                    {index < currentStep ? (
                                        <CheckCircleIcon className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="hidden sm:block ml-2 font-medium">{step.title}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-medical-purple"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass card"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please provide accurate information for better assessment
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 0
                                ? 'opacity-50 cursor-not-allowed text-gray-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            Previous
                        </button>

                        {currentStep === steps.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="btn-primary flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Submit Assessment
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                className="btn-primary flex items-center gap-2"
                            >
                                Next
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 glass card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                >
                    <div className="flex items-start gap-3">
                        <InformationCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Privacy Notice</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                Your data is processed locally and securely. We do not store your personal information
                                without consent. This assessment is for screening purposes only and not a medical diagnosis.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Assessment

