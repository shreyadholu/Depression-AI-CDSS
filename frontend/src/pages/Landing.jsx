import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    HeartIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    ArrowRightIcon,
    SparklesIcon,
    UserGroupIcon,
    DocumentCheckIcon,
    CpuChipIcon,
    BeakerIcon
} from '@heroicons/react/24/outline'

const Landing = () => {
    const features = [
        {
            icon: CpuChipIcon,
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning algorithms analyze multiple health indicators for accurate depression detection.'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Privacy First',
            description: 'Your data is encrypted and secure. We prioritize your privacy and confidentiality.'
        },
        {
            icon: SparklesIcon,
            title: 'Instant Results',
            description: 'Get comprehensive results and personalized recommendations within seconds.'
        },
        {
            icon: UserGroupIcon,
            title: 'Expert Recommendations',
            description: 'Receive AI-generated recommendations tailored to your specific profile.'
        }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 animated-bg opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-gray-900" />

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-40 right-10 w-96 h-96 bg-medical-purple/20 rounded-full blur-3xl"
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
                                🧠 AI-Driven Clinical Decision Support
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Depression Detection{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-medical-purple">
                                Powered by AI
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
                        >
                            A comprehensive clinical decision support system that helps identify depression risk factors
                            and provides personalized recommendations for mental health wellness.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link to="/assessment" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                                Start Assessment
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                                Admin Login
                            </Link>
                        </motion.div>
                    </div>

                    {/* Hero Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-16 relative"
                    >
                        <div className="glass card max-w-4xl mx-auto p-8">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                        <HeartIcon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Non-Invasive</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Simple questionnaire-based assessment</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                        <ChartBarIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data-Driven</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">ML models trained on clinical data</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                                        <DocumentCheckIcon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Evidence-Based</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Scientifically validated methodology</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our AI-powered system uses advanced machine learning to analyze your responses
                            and provide accurate depression risk assessment.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card hover:shadow-xl transition-shadow"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-medical-purple rounded-2xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass card max-w-4xl mx-auto text-center py-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Take our comprehensive assessment to understand your mental health better
                            and receive personalized recommendations.
                        </p>
                        <Link to="/assessment" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                            Begin Your Assessment
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-medical-purple rounded-lg flex items-center justify-center">
                                <CpuChipIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">AI-CDSS</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2024 AI-CDSS Depression Detection System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing

