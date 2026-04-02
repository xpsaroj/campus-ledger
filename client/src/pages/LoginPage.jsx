import { useState } from 'react'

function LoginPage({ onLogin, error, loading }) {
    const [formData, setFormData] = useState({ username: '', password: '' })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        onLogin(formData)
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Campus Ledger</h1>
                <p className="muted">Sign in to manage students and enrollments.</p>

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error ? <p className="error-text">{error}</p> : null}

                <button type="submit" className="button" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <p className="hint">Default account: admin / admin1234</p>
            </form>
        </div>
    )
}

export default LoginPage
