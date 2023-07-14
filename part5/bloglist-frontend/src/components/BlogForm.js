import { useRef } from 'react'
import Message from './Message'
import BlogList from './BlogList'
import Togglable from './Togglable'
import CreateForm from './CreateForm'
import LogoutButton from './LogoutButton'

const BlogForm = ({ message, setMessage, success, setSuccess, name, user, setUser, blogs, setBlogs }) => {
  const blogFormRef = useRef()

  return (
    <div>
      <h2>blogs</h2>
      <Message message={message} success={success} />
      <LogoutButton name={name} setUser={setUser} />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <CreateForm 
          setMessage={setMessage} 
          setSuccess={setSuccess} 
          blogs={blogs} 
          setBlogs={setBlogs} 
          blogFormRef={blogFormRef}
        />
      </Togglable>
      <BlogList blogs={blogs} setBlogs={setBlogs} user={user}/>
    </div>
  )
}

export default BlogForm