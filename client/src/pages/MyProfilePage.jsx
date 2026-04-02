import { useEffect, useState } from 'react'

import { getMyProfile } from '../services/api'

function MyProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true)
            setError('')
            try {
                const data = await getMyProfile()
                setProfile(data)
            } catch {
                setError('Unable to load your profile.')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    if (loading) {
        return <p>Loading profile...</p>
    }

    if (error) {
        return <p className="error-text">{error}</p>
    }

    if (!profile?.is_student_account) {
        return (
            <section className="page-grid single-column">
                <div className="card">
                    <h2>My Profile</h2>
                    <p>{profile?.message || 'No student profile linked.'}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="page-grid single-column">
            <div className="card">
                <h2>My Student Details</h2>
                <div className="profile-grid">
                    <p><strong>Name:</strong> {profile.student.name}</p>
                    <p><strong>Email:</strong> {profile.student.email}</p>
                    <p><strong>Department:</strong> {profile.student.department}</p>
                    <p><strong>Year:</strong> {profile.student.year}</p>
                </div>
            </div>

            <div className="card">
                <h2>My Enrollments</h2>
                {profile.enrollments?.length ? (
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
                                {profile.enrollments.map((enrollment) => (
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
                    <p>No enrollments found for your profile.</p>
                )}
            </div>
        </section>
    )
}

export default MyProfilePage
