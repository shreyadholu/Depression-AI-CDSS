import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    BookmarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    ShareIcon,
    HomeIcon
} from '@heroicons/react/24/outline'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const Results = () => {
    const navigate = useNavigate()
    const [result, setResult] = useState(null)
    const [patientData, setPatientData] = useState(null)
    const [saved, setSaved] = useState(false)
    const [animatedProgress, setAnimatedProgress] = useState(0)

    useEffect(() => {
        const savedResult = localStorage.getItem('predictionResult')
        if (savedResult) {
            const parsed = JSON.parse(savedResult)
            setResult(parsed.result || parsed)
            setPatientData(parsed.patientData)

            // Animate progress
            const targetProgress = (parsed.result?.depression_probability || parsed.depression_probability) * 100
            const duration = 1500
            const steps = 60
            const increment = targetProgress / steps
            let current = 0

            const timer = setInterval(() => {
                current += increment
                if (current >= targetProgress) {
                    setAnimatedProgress(targetProgress)
                    clearInterval(timer)
                } else {
                    setAnimatedProgress(current)
                }
            }, duration / steps)

            return () => clearInterval(timer)
        } else {
            navigate('/assessment')
        }
    }, [navigate])

    const getRiskColor = (risk) => {
        const colors = {
            Low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600', border: 'border-green-300' },
            Moderate: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600', border: 'border-yellow-300' },
            High: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', border: 'border-red-300' }
        }
        return colors[risk] || colors.Low
    }

    const getDiagnosisIcon = (diagnosis) => {
        return diagnosis === 'Yes' ? XCircleIcon : CheckCircleIcon
    }

    const downloadPDF = () => {
        const doc = new jsPDF()
        const resultData = result || {}
        const patient = patientData || {}

        // Header
        doc.setFillColor(14, 165, 233)
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.text('AI-CDSS Depression Detection Report', 105, 20, { align: 'center' })
        doc.setFontSize(10)
        doc.text('Clinical Decision Support System', 105, 30, { align: 'center' })

        // Patient Info
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(12)
        doc.text('Patient Information', 14, 55)
        doc.setFontSize(10)
        doc.text(`Age: ${patient.age || 'N/A'}`, 14, 65)
        doc.text(`Gender: ${patient.gender || 'N/A'}`, 14, 72)
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 79)

        // Results
        doc.setFontSize(12)
        doc.text('Assessment Results', 14, 95)

        const tableData = [
            ['Depression Probability', `${((resultData.depression_probability || 0) * 100).toFixed(1)}%`],
            ['Diagnosis', resultData.final_diagnosis || 'N/A'],
            ['Risk Level', resultData.risk_level || 'N/A'],
            ['Model Confidence', `${((resultData.model_confidence || 0) * 100).toFixed(1)}%`],
            ['Cluster Category', resultData.cluster_category || 'N/A'],
            ['Outlier Detected', resultData.is_outlier ? 'Yes' : 'No']
        ]

        doc.autoTable({
            startY: 100,
            head: [['Metric', 'Value']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [14, 165, 233] }
        })

        // Recommendations
        const finalY = doc.lastAutoTable.finalY + 15
        doc.setFontSize(12)
        doc.text('Recommendations', 14, finalY)

        const recommendations = resultData.recommendations || []
        let yPos = finalY + 10
        recommendations.forEach((rec, index) => {
            doc.setFontSize(10)
            doc.text(`${index + 1}. ${rec}`, 14, yPos)
            yPos += 8
        })

        // Priority Action
        yPos += 10
        doc.setFontSize(12)
        doc.text('Priority Action:', 14, yPos)
        doc.setFontSize(10)
        doc.setTextColor(220, 38, 38)
        doc.text(resultData.priority_action || '', 14, yPos + 8)

        // Footer
        doc.setTextColor(128, 128, 128)
        doc.setFontSize(8)
        doc.text('This report is for screening purposes only and not a medical diagnosis.', 105, 285, { align: 'center' })
        doc.text('Please consult a healthcare professional for proper evaluation.', 105, 290, { align: 'center' })

        doc.save('depression-assessment-report.pdf')
    }

    const saveRecord = () => {
        const records = JSON.parse(localStorage.getItem('patientRecords') || '[]')
        const newRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            patientData,
            result
        }
        records.push(newRecord)
        localStorage.setItem('patientRecords', JSON.stringify(records))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    if (!result) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const riskColors = getRiskColor(result.risk_level)
    const DiagnosisIcon = getDiagnosisIcon(result.final_diagnosis)

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <Link
                        to="/assessment"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Assessment
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                        <HomeIcon className="w-5 h-5" />
                        Home
                    </Link>
                </motion.div>

                {/* Main Result Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass card mb-6"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Assessment Results
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Based on your responses, here is the AI analysis
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Circular Progress */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full circular-progress" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-gray-200 dark:text-gray-700"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - animatedProgress / 100)}`}
                                        className="text-primary-500 transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {animatedProgress.toFixed(1)}%
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Probability
                                    </span>
                                </div>
                            </div>

                            {/* Confidence */}
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Model Confidence: {((result.model_confidence || 0.85) * 100).toFixed(1)}%
                            </div>
                        </div>

                        {/* Results Info */}
                        <div className="space-y-6">
                            {/* Risk Level */}
                            <div className={`flex items-center gap-4 p-4 rounded-xl ${riskColors.bg} border ${riskColors.border}`}>
                                <ExclamationTriangleIcon className={`w-8 h-8 ${riskColors.text}`} />
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
                                    <div className={`text-2xl font-bold ${riskColors.text}`}>
                                        {result.risk_level}
                                    </div>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div className={`flex items-center gap-4 p-4 rounded-xl ${result.final_diagnosis === 'Yes'
                                    ? 'bg-red-100 dark:bg-red-900/30 border border-red-300'
                                    : 'bg-green-100 dark:bg-green-900/30 border border-green-300'
                                }`}>
                                <DiagnosisIcon className={`w-8 h-8 ${result.final_diagnosis === 'Yes' ? 'text-red-600' : 'text-green-600'
                                    }`} />
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Depression Detected</div>
                                    <div className={`text-2xl font-bold ${result.final_diagnosis === 'Yes' ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                        {result.final_diagnosis === 'Yes' ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>

                            {/* Outlier Warning */}
                            {result.is_outlier && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-300"
                                >
                                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                        <SparklesIcon className="w-5 h-5" />
                                        <span className="font-medium">Unusual Pattern Detected</span>
                                    </div>
                                    <p className="text-sm text-purple-600 dark:text-purple-500 mt-1">
                                        {result.outlier_message || 'Your responses show patterns significantly different from typical cases.'}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Recommendations Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass card mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-purple rounded-xl flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                AI Recommendations
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Personalized suggestions based on your assessment
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {(result.recommendations || []).map((rec, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                                <CheckCircleIcon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Priority Action */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className={`mt-6 p-4 rounded-xl ${result.risk_level === 'High'
                                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                : result.risk_level === 'Moderate'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                                    : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            }`}
                    >
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">Priority Action</div>
                        <div className={`text-sm ${result.risk_level === 'High' ? 'text-red-700 dark:text-red-400' :
                                result.risk_level === 'Moderate' ? 'text-yellow-700 dark:text-yellow-400' :
                                    'text-green-700 dark:text-green-400'
                            }`}>
                            {result.priority_action}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={downloadPDF}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download PDF Report
                    </button>

                    <button
                        onClick={saveRecord}
                        className={`flex-1 flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'btn-secondary'
                            }`}
                        disabled={saved}
                    >
                        <BookmarkIcon className="w-5 h-5" />
                        {saved ? 'Saved!' : 'Save Record'}
                    </button>

                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Depression Assessment Results',
                                    text: `My depression risk level: ${result.risk_level} (${(result.depression_probability * 100).toFixed(1)}% probability)`
                                })
                            }
                        }}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                        <ShareIcon className="w-5 h-5" />
                        Share Results
                    </button>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        <strong>Disclaimer:</strong> This assessment is for screening purposes only and is not a medical diagnosis.
                        Please consult a healthcare professional for proper evaluation and treatment.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Results

