import { useState } from 'react'

const CreateForm = ({ setMessage, setSuccess, blogs, setBlogs, blogFormRef, createBlog }) => {
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
      blogFormRef.current.toggleVisibility()
      console.log('creating new blog: ', title, author, url)
      const blog = await createBlog({
        title, author, url
      })
      setBlogs(blogs.concat(blog))
      setMessage(`a new blog ${title} by ${author} added`)
      setSuccess(true)
    } catch (exception) {
      console.log('unable to create new blog')
      console.error('error: ', exception)
      setMessage('invalid inputs for title, author, or url')
      setSuccess(false)
    }

    setTimeout(() => {
      setMessage(null)
      setSuccess(true)
    }, 5000)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
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
  )
}

export default CreateForm