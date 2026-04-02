import { useEffect, useState } from 'react'

import { getDashboardSummary } from '../services/api'

function HomePage() {
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadSummary = async () => {
            setLoading(true)
            setError('')
            try {
                const data = await getDashboardSummary()
                setSummary(data)
            } catch {
                setError('Unable to load dashboard summary.')
            } finally {
                setLoading(false)
            }
        }

        loadSummary()
    }, [])

    if (loading) {
        return <p>Loading dashboard...</p>
    }

    if (error) {
        return <p className="error-text">{error}</p>
    }

    return (
        <section className="home-grid">
            <div className="card stat-card">
                <h2>Total Students</h2>
                <p className="stat-value">{summary?.student_count ?? 0}</p>
            </div>

            <div className="card stat-card">
                <h2>Total Enrollments</h2>
                <p className="stat-value">{summary?.enrollment_count ?? 0}</p>
            </div>

            <div className="card">
                <h2>Recently Added Students</h2>
                {summary?.recent_students?.length ? (
                    <ul className="simple-list">
                        {summary.recent_students.map((student) => (
                            <li key={student.id}>
                                <strong>{student.name}</strong>
                                <span>{student.department} - Year {student.year}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent students.</p>
                )}
            </div>

            <div className="card">
                <h2>Recent Enrollments</h2>
                {summary?.recent_enrollments?.length ? (
                    <ul className="simple-list">
                        {summary.recent_enrollments.map((enrollment) => (
                            <li key={enrollment.id}>
                                <strong>{enrollment.course_name}</strong>
                                <span>{enrollment.student_name} - {enrollment.semester} ({enrollment.grade})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent enrollments.</p>
                )}
            </div>
        </section>
    )
}

export default HomePage
