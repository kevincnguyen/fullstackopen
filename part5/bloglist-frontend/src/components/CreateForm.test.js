import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

test('creating new form calls event handler with right details', async () => {
  const setMessage = jest.fn()
  const setSuccess = jest.fn()
  const blogs = []
  const setBlogs = jest.fn()
  const createBlog = jest.fn()
  const toggleVisibility = jest.fn()
  const blogFormRef = {
    current: {
      toggleVisibility
    }
  }
  const user = userEvent.setup()

  const { container } = render(<CreateForm
    setMessage={setMessage}
    setSuccess={setSuccess}
    blogs={blogs}
    setBlogs={setBlogs}
    blogFormRef={blogFormRef}
    createBlog={createBlog}
  />)

  const titleInput = container.querySelector('input[name=Title]')
  const authorInput = container.querySelector('input[name=Author]')
  const urlInput = container.querySelector('input[name=Url]')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Simpsons')
  await user.type(authorInput, 'Homer S')
  await user.type(urlInput, 'www.adultswim.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Simpsons')
  expect(createBlog.mock.calls[0][0].author).toBe('Homer S')
  expect(createBlog.mock.calls[0][0].url).toBe('www.adultswim.com')
})