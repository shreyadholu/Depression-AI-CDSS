import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CpuChipIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'

const Login = ({ onLogin }) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // For demo purposes, accept admin/admin123
            if (username === 'admin' && password === 'admin123') {
                const user = { username: 'admin', email: 'admin@aidds.com', fullName: 'Admin User' }
                onLogin(user)
                navigate('/admin')
            } else {
                setError('Invalid username or password. Try: admin / admin123')
            }
        } catch (err) {
            setError('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="absolute inset-0 animated-bg opacity-5" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="glass card p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-medical-purple rounded-2xl flex items-center justify-center">
                            <CpuChipIcon className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl"
                        >
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-field pl-11"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-11 pr-11"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            <strong>Demo Credentials:</strong><br />
                            Username: admin<br />
                            Password: admin123
                        </p>
                    </div>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Login

