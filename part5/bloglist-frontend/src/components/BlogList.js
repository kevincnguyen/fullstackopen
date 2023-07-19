import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = ({ blogs, setBlogs, user }) => {
  const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)

  const handleLike = async (title, author, url, likes, userId, blogId) => {
    try {
      await blogService.update({
        title: title,
        author: author,
        url: url,
        likes: likes + 1,
        user: userId
      }, blogId)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (exception) {
      console.log('unable to like blog')
      console.error('error: ', exception)
    }
  }

  return (
    <>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          setBlogs={setBlogs}
          user={user}
          handleLike={handleLike}
        />
      )}
    </>
  )
}

export default BlogList