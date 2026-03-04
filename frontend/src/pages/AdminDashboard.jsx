import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ChartBarIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
)

const AdminDashboard = () => {
    const [records, setRecords] = useState([])
    const [analytics, setAnalytics] = useState(null)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        setIsLoading(true)

        // Load from localStorage
        const savedRecords = JSON.parse(localStorage.getItem('patientRecords') || '[]')
        setRecords(savedRecords)

        // Calculate analytics
        if (savedRecords.length > 0) {
            const riskCounts = { Low: 0, Moderate: 0, High: 0 }
            let totalProbability = 0
            let outlierCount = 0

            savedRecords.forEach(record => {
                const result = record.result || {}
                if (result.risk_level) {
                    riskCounts[result.risk_level]++
                }
                if (result.depression_probability) {
                    totalProbability += result.depression_probability
                }
                if (result.is_outlier) {
                    outlierCount++
                }
            })

            setAnalytics({
                totalPredictions: savedRecords.length,
                riskDistribution: riskCounts,
                averageProbability: totalProbability / savedRecords.length,
                outlierCount
            })
        } else {
            // Demo data for visualization
            setAnalytics({
                totalPredictions: 156,
                riskDistribution: { Low: 78, Moderate: 52, High: 26 },
                averageProbability: 0.42,
                outlierCount: 12
            })
        }

        setTimeout(() => setIsLoading(false), 500)
    }

    const deleteRecord = (id) => {
        const updated = records.filter(r => r.id !== id)
        setRecords(updated)
        localStorage.setItem('patientRecords', JSON.stringify(updated))
        loadData()
    }

    const clearAllRecords = () => {
        if (confirm('Are you sure you want to clear all records?')) {
            setRecords([])
            localStorage.removeItem('patientRecords')
            loadData()
        }
    }

    const riskChartData = {
        labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
        datasets: [{
            data: analytics ? [
                analytics.riskDistribution.Low,
                analytics.riskDistribution.Moderate,
                analytics.riskDistribution.High
            ] : [0, 0, 0],
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 0
        }]
    }

    const trendChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Predictions',
            data: [20, 35, 28, 45, 32, analytics?.totalPredictions || 50],
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }

    const riskBarData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Low Risk',
                data: [15, 20, 18, 25, 20, 30],
                backgroundColor: '#22c55e'
            },
            {
                label: 'Moderate Risk',
                data: [10, 15, 12, 18, 14, 22],
                backgroundColor: '#f59e0b'
            },
            {
                label: 'High Risk',
                data: [5, 8, 6, 10, 8, 12],
                backgroundColor: '#ef4444'
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Monitor predictions and analyze trends
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={loadData}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                            Refresh
                        </button>
                        <button
                            onClick={clearAllRecords}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                        >
                            <TrashIcon className="w-5 h-5" />
                            Clear All
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass card"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Predictions</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics?.totalPredictions || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass card"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <UserGroupIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Low Risk Cases</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics?.riskDistribution.Low || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass card"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Probability</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics ? `${(analytics.averageProbability * 100).toFixed(1)}%` : '0%'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass card"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Outliers Detected</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics?.outlierCount || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Risk Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass card"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Risk Distribution
                        </h2>
                        <div className="h-64">
                            <Doughnut data={riskChartData} options={chartOptions} />
                        </div>
                    </motion.div>

                    {/* Trend Over Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass card"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Prediction Trends
                        </h2>
                        <div className="h-64">
                            <Line data={trendChartData} options={chartOptions} />
                        </div>
                    </motion.div>
                </div>

                {/* Risk Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass card mb-8"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Monthly Risk Breakdown
                    </h2>
                    <div className="h-64">
                        <Bar data={riskBarData} options={chartOptions} />
                    </div>
                </motion.div>

                {/* Records Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass card"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Predictions
                        </h2>
                        <span className="text-sm text-gray-500">
                            {records.length} records
                        </span>
                    </div>

                    {records.length === 0 ? (
                        <div className="text-center py-12">
                            <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No prediction records yet. Complete assessments to see data here.
                            </p>
                            <Link to="/assessment" className="btn-primary mt-4 inline-block">
                                Start Assessment
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Age</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Probability</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Diagnosis</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.slice(-10).reverse().map((record, index) => (
                                        <motion.tr
                                            key={record.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-300">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-300">
                                                {record.patientData?.age || 'N/A'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-300">
                                                {((record.result?.depression_probability || 0) * 100).toFixed(1)}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${record.result?.risk_level === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        record.result?.risk_level === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {record.result?.risk_level || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${record.result?.final_diagnosis === 'Yes'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {record.result?.final_diagnosis || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedRecord(record)}
                                                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRecord(record.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Record Detail Modal */}
                {selectedRecord && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Prediction Details
                                </h2>
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(selectedRecord.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Patient Age</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {selectedRecord.patientData?.age}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Results</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Probability</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {((selectedRecord.result?.depression_probability || 0) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Diagnosis</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {selectedRecord.result?.final_diagnosis}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Risk Level</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {selectedRecord.result?.risk_level}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Confidence</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {((selectedRecord.result?.model_confidence || 0) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Recommendations</h3>
                                    <ul className="space-y-2">
                                        {(selectedRecord.result?.recommendations || []).map((rec, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="text-primary-500">•</span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard

