import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    CpuChipIcon,
    SunIcon,
    MoonIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const Navbar = ({ darkMode, toggleDarkMode, user, onLogout }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        onLogout()
        navigate('/')
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900/90 backdrop-blur-lg border-b border-gray-700' : 'bg-white/90 backdrop-blur-lg border-b border-gray-100'
                } shadow-sm`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-purple rounded-xl flex items-center justify-center">
                            <CpuChipIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            AI-CDSS
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className={`font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/assessment"
                            className={`font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Assessment
                        </Link>
                        {user && (
                            <Link
                                to="/admin"
                                className={`font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {darkMode ? (
                                <SunIcon className="w-5 h-5" />
                            ) : (
                                <MoonIcon className="w-5 h-5" />
                            )}
                        </motion.button>

                        {/* User Menu */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/admin"
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <UserCircleIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{user.username}</span>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-gray-100 text-red-600'
                                        }`}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                </motion.button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="btn-primary text-sm py-2"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar

