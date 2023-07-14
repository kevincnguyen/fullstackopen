import { useState } from 'react'
import Message from './Message'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ message, setMessage, success, setSuccess, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log('logging in with', username, password)
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`${username} has successfully logged in`)
      setSuccess(true)
    } catch (exception) {
      console.log('unable to login with given credentials')
      console.error('error: ', exception)
      setMessage('wrong username or password')
      setSuccess(false)
    }
    setTimeout(() => {
      setMessage(null)
      setSuccess(true)
    }, 5000)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Message message={message} success={success} />
      <form onSubmit={handleLogin}>
        <div>
            username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={handleUsername}
          />
        </div>
        <div>
            password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={handlePassword}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm