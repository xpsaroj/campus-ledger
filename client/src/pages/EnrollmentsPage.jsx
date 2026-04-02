import { useEffect, useMemo, useState } from 'react'

import {
    createEnrollment,
    deleteEnrollment,
    getEnrollments,
    getStudents,
    updateEnrollment,
} from '../services/api'

const emptyForm = {
    student: '',
    course_name: '',
    semester: 'Fall',
    grade: 'A',
}

function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([])
    const [students, setStudents] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)

    const formTitle = useMemo(
        () => (editingId ? 'Update enrollment' : 'Add enrollment'),
        [editingId],
    )

    const loadStudents = async () => {
        try {
            const studentData = await getStudents()
            setStudents(studentData)
        } catch {
            setError('Unable to load students for enrollment selection.')
        }
    }

    const loadEnrollments = async (value = '') => {
        setLoading(true)
        setError('')
        try {
            const data = await getEnrollments(value)
            setEnrollments(data)
            setError('')
        } catch {
            setError('Unable to load enrollments.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStudents()
        loadEnrollments()
    }, [])

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        loadEnrollments(search)
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: name === 'student' ? Number(value) : value }))
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData(emptyForm)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        try {
            if (editingId) {
                await updateEnrollment(editingId, formData)
            } else {
                await createEnrollment(formData)
            }
            resetForm()
            await loadEnrollments(search)
        } catch {
            setError('Unable to save enrollment. Please verify the form values.')
        }
    }

    const handleEdit = (enrollment) => {
        setEditingId(enrollment.id)
        setFormData({
            student: enrollment.student,
            course_name: enrollment.course_name,
            semester: enrollment.semester,
            grade: enrollment.grade,
        })
    }

    const handleDelete = async (enrollmentId) => {
        const confirmed = window.confirm('Delete this enrollment?')
        if (!confirmed) {
            return
        }

        setError('')
        try {
            await deleteEnrollment(enrollmentId)
            await loadEnrollments(search)
        } catch {
            setError('Unable to delete enrollment.')
        }
    }

    return (
        <section className="page-grid">
            <div className="card">
                <div className="card-header">
                    <h2>Enrollments</h2>
                    <form onSubmit={handleSearchSubmit} className="inline-form">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by student, course, semester"
                        />
                        <button type="submit" className="button button-outline">
                            Search
                        </button>
                    </form>
                </div>

                {loading ? <p>Loading enrollments...</p> : null}
                {!loading && enrollments.length === 0 ? <p>No enrollments found.</p> : null}

                {!loading && enrollments.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Semester</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td>{enrollment.student_name}</td>
                                        <td>{enrollment.course_name}</td>
                                        <td>{enrollment.semester}</td>
                                        <td>{enrollment.grade}</td>
                                        <td className="actions">
                                            <button
                                                type="button"
                                                className="button button-outline"
                                                onClick={() => handleEdit(enrollment)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="button button-danger"
                                                onClick={() => handleDelete(enrollment.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>

            <div className="card">
                <h2>{formTitle}</h2>
                <form onSubmit={handleSubmit} className="stack-form">
                    <label htmlFor="student">Student</label>
                    <select
                        id="student"
                        name="student"
                        value={formData.student}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="course_name">Course name</label>
                    <input
                        id="course_name"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleFormChange}
                        required
                    />

                    <label htmlFor="semester">Semester</label>
                    <select
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                    </select>

                    <label htmlFor="grade">Grade</label>
                    <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>

                    <div className="form-actions">
                        <button type="submit" className="button">
                            {editingId ? 'Update enrollment' : 'Create enrollment'}
                        </button>
                        <button type="button" className="button button-outline" onClick={resetForm}>
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {error ? <p className="error-text page-error">{error}</p> : null}
        </section>
    )
}

export default EnrollmentsPage
