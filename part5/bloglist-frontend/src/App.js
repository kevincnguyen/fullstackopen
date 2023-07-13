import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  if (user === null) {
    return <LoginForm 
              message={message}
              setMessage={setMessage}
              success={success}
              setSuccess={setSuccess}
              setUser={setUser}
           />
  }

  return <BlogForm 
            message={message}
            setMessage={setMessage}
            success={success}
            setSuccess={setSuccess}
            user={user}
            setUser={setUser}
            blogs={blogs}
            setBlogs={setBlogs}
          />
}

export default App