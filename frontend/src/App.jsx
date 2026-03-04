import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'

function App() {
    const [darkMode, setDarkMode] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        if (!darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const handleLogin = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <Router>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
                <Navbar
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    user={user}
                    onLogout={handleLogout}
                />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/assessment" element={<Assessment />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route
                        path="/admin"
                        element={user ? <AdminDashboard /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App

