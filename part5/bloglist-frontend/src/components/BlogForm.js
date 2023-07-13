import { useState } from 'react'
import Blog from './Blog'
import Message from './Message'
import blogService from '../services/blogs'

const BlogForm = ({ message, setMessage, success, setSuccess, user, setUser, blogs, setBlogs }) => {
    const [title, setTitle] = useState('') 
    const [author, setAuthor] = useState('') 
    const [url, setUrl] = useState('') 
    
    const handleTitle = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthor = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrl = (event) => {
        setUrl(event.target.value)
    }

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
          console.log('creating new blog: ', title, author, url)
          const blog = await blogService.create({
            title, author, url
          })
          setBlogs(blogs.concat(blog))
          setMessage(`a new blog ${title} by ${author} added`);
          setSuccess(true);
        } catch (exception) {
          console.log('unable to create new blog')
          console.error('error: ', exception)
          setMessage(`invalid inputs for title, author, or url`);
          setSuccess(false);
        }
    
        setTimeout(() => {
          setMessage(null);
          setSuccess(true);
        }, 5000);
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
    }

    return (
      <div>
        <h2>blogs</h2>
        <Message message={message} success={success} />
        <span>{user.name} logged in</span>
        <button onClick={handleLogout}>logout</button>
        <div>
          <h2>create new</h2>
          <form onSubmit={handleCreate}>
            <div>
              title:
                <input
                  type="text"
                  value={title}
                  name="Title"
                  onChange={handleTitle}
                />
            </div>
            <div>
              author:
                <input
                  type="text"
                  value={author}
                  name="Author"
                  onChange={handleAuthor}
                />
            </div>
            <div>
              url:
                <input
                  type="text"
                  value={url}
                  name="Url"
                  onChange={handleUrl}
                />
            </div>
            <button type='submit'>create</button>
          </form>
        </div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}

export default BlogForm