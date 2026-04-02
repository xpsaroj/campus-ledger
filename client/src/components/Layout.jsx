import { NavLink, Outlet } from 'react-router-dom'

function Layout({ onLogout, username, role }) {
    return (
        <div className="app-shell">
            <header className="topbar">
                <div>
                    <h1>Campus Ledger</h1>
                    <p>Student and enrollment records</p>
                </div>
                <div className="topbar-actions">
                    <span className="username">Signed in as {username}</span>
                    <button type="button" className="button button-outline" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <nav className="tabs">
                {role === 'admin' ? (
                    <>
                        <NavLink to="/home" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/students" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
                            Students
                        </NavLink>
                        <NavLink
                            to="/enrollments"
                            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
                        >
                            Enrollments
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/my-profile"
                            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
                        >
                            My Profile
                        </NavLink>
                        <NavLink
                            to="/my-enrollments"
                            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
                        >
                            My Enrollments
                        </NavLink>
                    </>
                )}
            </nav>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
