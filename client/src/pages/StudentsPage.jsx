import { useEffect, useMemo, useState } from 'react'

import {
    createStudent,
    deleteStudent,
    getStudents,
    updateStudent,
} from '../services/api'

const emptyForm = {
    name: '',
    email: '',
    department: '',
    year: 1,
}

function StudentsPage() {
    const [students, setStudents] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)

    const formTitle = useMemo(
        () => (editingId ? 'Update student' : 'Add student'),
        [editingId],
    )

    const loadStudents = async (value = '') => {
        setLoading(true)
        setError('')
        try {
            const data = await getStudents(value)
            setStudents(data)
            setError('')
        } catch {
            setError('Unable to load students.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStudents()
    }, [])

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        loadStudents(search)
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'year' ? Number(value) : value,
        }))
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
                await updateStudent(editingId, formData)
            } else {
                await createStudent(formData)
            }
            resetForm()
            await loadStudents(search)
        } catch {
            setError('Unable to save student. Please verify the form values.')
        }
    }

    const handleEdit = (student) => {
        setEditingId(student.id)
        setFormData({
            name: student.name,
            email: student.email,
            department: student.department,
            year: student.year,
        })
    }

    const handleDelete = async (studentId) => {
        const confirmed = window.confirm('Delete this student and related enrollments?')
        if (!confirmed) {
            return
        }

        setError('')
        try {
            await deleteStudent(studentId)
            await loadStudents(search)
        } catch {
            setError('Unable to delete student.')
        }
    }

    return (
        <section className="page-grid">
            <div className="card">
                <div className="card-header">
                    <h2>Students</h2>
                    <form onSubmit={handleSearchSubmit} className="inline-form">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name, email, department"
                        />
                        <button type="submit" className="button button-outline">
                            Search
                        </button>
                    </form>
                </div>

                {loading ? <p>Loading students...</p> : null}
                {!loading && students.length === 0 ? <p>No students found.</p> : null}

                {!loading && students.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.department}</td>
                                        <td>{student.year}</td>
                                        <td className="actions">
                                            <button
                                                type="button"
                                                className="button button-outline"
                                                onClick={() => handleEdit(student)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="button button-danger"
                                                onClick={() => handleDelete(student.id)}
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
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" value={formData.name} onChange={handleFormChange} required />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                    />

                    <label htmlFor="department">Department</label>
                    <input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleFormChange}
                        required
                    />

                    <label htmlFor="year">Year</label>
                    <input
                        id="year"
                        type="number"
                        min="1"
                        max="8"
                        name="year"
                        value={formData.year}
                        onChange={handleFormChange}
                        required
                    />

                    <div className="form-actions">
                        <button type="submit" className="button">
                            {editingId ? 'Update student' : 'Create student'}
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

export default StudentsPage
