import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    setEmailError('')
    setPasswordError('')
    setServerError('')

    if (!email.trim()) {
      setEmailError('Введите email')
      return
    }

    if (!email.includes('@')) {
      setEmailError('Введите корректный email')
      return
    }

    if (!password) {
      setPasswordError('Введите пароль')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      )

      const data = await response.json()

      console.log('LOGIN RESPONSE:', data)

      if (!response.ok) {
        setServerError(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Неверный email или пароль',
        )
        return
      }

      if (!data.accessToken) {
        setServerError(
          'Сервер не вернул токен авторизации',
        )
        return
      }

      localStorage.setItem('token', data.accessToken)

      navigate('/tasks')
    } catch (error) {
      console.error('LOGIN ERROR:', error)

      setServerError(
        'Не удалось подключиться к серверу. Проверьте, запущен ли backend.',
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          🔐
        </div>

        <h1>С возвращением!</h1>

        <p>Войдите в свой аккаунт</p>

        <div className="input-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
              setServerError('')
            }}
          />

          {emailError && (
            <div className="input-error">
              {emailError}
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Пароль</label>

          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
              setServerError('')
            }}
          />

          {passwordError && (
            <div className="input-error">
              {passwordError}
            </div>
          )}
        </div>

        {serverError && (
          <div className="server-error">
            {serverError}
          </div>
        )}

        <button
          className="auth-button"
          onClick={handleLogin}
        >
          Войти
        </button>

        <p className="auth-footer">
          Нет аккаунта?{' '}
          <Link to="/register">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login