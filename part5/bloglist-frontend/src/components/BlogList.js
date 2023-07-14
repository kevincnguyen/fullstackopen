import Blog from './Blog'

const BlogList = ({ blogs, setBlogs, user }) => {
    const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)

    return (
        <>
            {sortedBlogs.map(blog =>
                <Blog 
                    key={blog.id} 
                    blog={blog} 
                    setBlogs={setBlogs}
                    user={user}
                />
            )}
        </>
    )
}

export default BlogList