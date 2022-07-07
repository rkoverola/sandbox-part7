import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  let blogContainer
  let addLike
  let removeBlog

  beforeEach(() => {
    addLike = jest.fn()
    removeBlog = jest.fn()
    const currentUser = {
      name: 'Juho Test',
      id: 'user_id',
      username: 'jtest'
    }
    const blog = {
      title: 'This is a unit test',
      author: 'Test writer',
      user: 'user_id',
      url: 'www.test.com',
      likes: 9,
      id: 'blog_id'
    }

    blogContainer = render(
      <Blog blog={blog} addLike={addLike} removeBlog={removeBlog} currentUser={currentUser} />
    ).container
  })

  test('Renders title and author when minimized', () => {
    const div = blogContainer.querySelector('.blogInfo')
    expect(div).toHaveTextContent('This is a unit test', { exact: false })
    expect(div).toHaveTextContent('Test writer', { exact: false })
  })

  test('Does not render url or number of likes when minimized', () => {
    const div = blogContainer.querySelector('.additionalBlogInfo')
    expect(div).toHaveTextContent('www.test.com', { exact: false })
    expect(div).toHaveTextContent('9', { exact: false })
    expect(div).toHaveStyle('display: none')
  })

  test('Does render url and number of likes when maximized', async () => {
    const div = blogContainer.querySelector('.additionalBlogInfo')
    const button = blogContainer.querySelector('.toggleMinimizedButton')
    const user = userEvent.setup()
    await user.click(button)
    expect(div).toHaveTextContent('www.test.com', { exact: false })
    expect(div).toHaveTextContent('9', { exact: false })
    expect(div).not.toHaveStyle('display: none')
  })

  test('Event handler receives appropriate amount of likes when like button clicked', async () => {
    const button = blogContainer.querySelector('.likeButton')
    const user = userEvent.setup()
    await user.click(button)
    await user.click(button)
    expect(addLike.mock.calls).toHaveLength(2)
  })
})