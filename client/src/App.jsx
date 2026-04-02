import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import EnrollmentsPage from './pages/EnrollmentsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyEnrollmentsPage from './pages/MyEnrollmentsPage'
import MyProfilePage from './pages/MyProfilePage'
import StudentsPage from './pages/StudentsPage'
import { getCurrentUser, login, logout, setAuthToken } from './services/api'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [role, setRole] = useState(localStorage.getItem('role') || '')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(Boolean(token))

  const isAuthenticated = useMemo(() => Boolean(token), [token])

  const handleLogin = async ({ username: userValue, password }) => {
    setAuthError('')
    setLoading(true)

    try {
      const response = await login(userValue, password)
      setBootstrapping(true)
      setToken(response.token)
      setUsername('')
      setRole('')
      setAuthToken(response.token)
      localStorage.setItem('token', response.token)
      localStorage.removeItem('username')
      localStorage.removeItem('role')
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
    setRole('')
    setAuthToken('')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
  }

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  useEffect(() => {
    const bootstrapRole = async () => {
      if (!token) {
        setBootstrapping(false)
        return
      }

      try {
        const me = await getCurrentUser()
        setUsername(me.username)
        setRole(me.role)
        localStorage.setItem('username', me.username)
        localStorage.setItem('role', me.role)
      } catch {
        setToken('')
        setUsername('')
        setRole('')
        setAuthToken('')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('role')
      } finally {
        setBootstrapping(false)
      }
    }

    bootstrapRole()
  }, [token])

  if (bootstrapping) {
    return <p style={{ padding: '24px' }}>Loading session...</p>
  }

  if (isAuthenticated && !role) {
    return <p style={{ padding: '24px' }}>Loading session...</p>
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={role === 'admin' ? '/home' : '/my-profile'} replace />
          ) : (
            <LoginPage onLogin={handleLogin} error={authError} loading={loading} />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout} username={username} role={role} />
          </ProtectedRoute>
        }
      >
        <Route
          path="/home"
          element={role === 'admin' ? <HomePage /> : <Navigate to="/my-profile" replace />}
        />
        <Route
          path="/students"
          element={role === 'admin' ? <StudentsPage /> : <Navigate to="/my-profile" replace />}
        />
        <Route
          path="/enrollments"
          element={role === 'admin' ? <EnrollmentsPage /> : <Navigate to="/my-profile" replace />}
        />
        <Route
          path="/my-profile"
          element={role === 'student' ? <MyProfilePage /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/my-enrollments"
          element={role === 'student' ? <MyEnrollmentsPage /> : <Navigate to="/home" replace />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? (role === 'admin' ? '/home' : '/my-profile') : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
