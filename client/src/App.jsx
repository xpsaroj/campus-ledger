import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import EnrollmentsPage from './pages/EnrollmentsPage'
import LoginPage from './pages/LoginPage'
import StudentsPage from './pages/StudentsPage'
import { login, logout, setAuthToken } from './services/api'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)

  const isAuthenticated = useMemo(() => Boolean(token), [token])

  const handleLogin = async ({ username: userValue, password }) => {
    setAuthError('')
    setLoading(true)

    try {
      const response = await login(userValue, password)
      setToken(response.token)
      setUsername(userValue)
      setAuthToken(response.token)
      localStorage.setItem('token', response.token)
      localStorage.setItem('username', userValue)
    } catch {
      setAuthError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Local logout should still complete even if API logout fails.
    }
    setToken('')
    setUsername('')
    setAuthToken('')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/students" replace />
          ) : (
            <LoginPage onLogin={handleLogin} error={authError} loading={loading} />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout} username={username} />
          </ProtectedRoute>
        }
      >
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/enrollments" element={<EnrollmentsPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/students' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
