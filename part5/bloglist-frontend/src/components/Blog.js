import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, user }) => {
  const [view, setView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleView = () => {
    setView(!view)
  }
  
  // clicking like button too fast will not reigster all clicks
  const handleLike = async () => {
    try {
      await blogService.update({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id
      }, blog.id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (exception) {
      console.log('unable to like blog')
      console.error('error: ', exception)
    }
  }
  
  const hidden = (
    <>
      <button onClick={handleView}>view</button>
    </>
  )

  const handleRemove = async () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        const updatedBlogs = await blogService.getAll()
        setBlogs(updatedBlogs)
      } catch (exception) {
        console.log('unable to delete blog')
        console.error('error: ', exception)
      }
    }
  }
  
  const fullview = (
    <>
      <button onClick={handleView}>hide</button>
      <p>{blog.url}</p>
      <span>likes {blog.likes}</span>
      <button onClick={handleLike}>like</button>
      <p>{blog.user.name}</p>
      {blog.user.username === user.username ? <button onClick={handleRemove}>remove</button> : null}
    </>
  )

  return (
    <div style={blogStyle}>
      <span>
        {blog.title} {blog.author}
      </span>
      {view ? fullview : hidden}
    </div>  
  )
} 

export default Blog