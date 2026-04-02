import { useEffect, useState } from 'react'

import { getMyProfile } from '../services/api'

function MyEnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError('')
            try {
                const data = await getMyProfile()
                if (!data.is_student_account) {
                    setError('This page is available only for student accounts.')
                } else {
                    setEnrollments(data.enrollments || [])
                }
            } catch {
                setError('Unable to load your enrollments.')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    if (loading) {
        return <p>Loading enrollments...</p>
    }

    if (error) {
        return <p className="error-text">{error}</p>
    }

    return (
        <section className="page-grid single-column">
            <div className="card">
                <h2>My Enrollments</h2>
                {enrollments.length ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Semester</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td>{enrollment.course_name}</td>
                                        <td>{enrollment.semester}</td>
                                        <td>{enrollment.grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No enrollments found.</p>
                )}
            </div>
        </section>
    )
}

export default MyEnrollmentsPage
