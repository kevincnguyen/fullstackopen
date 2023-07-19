import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Example',
  author: 'Harry Potter',
  url: 'www.shouldbehidden.com',
  likes: 10,
  user: {
    name: 'Ron Weasley',
    username: 'rats'
  }
}

const person = {
  username: 'hermione'
}

test('renders title and author, does not render url or likes by default', () => {
  const { container } = render(<Blog blog={blog} user={person} />)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Example')
  expect(div).toHaveTextContent('Harry Potter')
  expect(div).not.toHaveTextContent('www.shouldbehidden.com')
  expect(div).not.toHaveTextContent(10)
})


test('clicking view button shows url and likes', async () => {
  const { container } = render(<Blog blog={blog} user={person} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Example')
  expect(div).toHaveTextContent('Harry Potter')
  expect(div).toHaveTextContent('www.shouldbehidden.com')
  expect(div).toHaveTextContent(10)
})

test('clicking like twice, calls the event handler twice', async () => {
  const handleLike = jest.fn()

  render(<Blog blog={blog} user={person} handleLike={handleLike} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLike.mock.calls).toHaveLength(2)
})