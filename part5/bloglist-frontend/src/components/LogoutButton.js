const LogoutButton = ({ name, setUser }) => {
    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
    }

    return (
        <>
            <span>{name} logged in</span>
            <button onClick={handleLogout}>logout</button>
        </>
    )
}

export default LogoutButton