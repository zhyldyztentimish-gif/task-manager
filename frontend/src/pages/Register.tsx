import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!email || !password) {
      alert('Заполните все поля')
      return
    }

    try {
      const registerResponse = await fetch(
        'http://localhost:3000/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      )

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        alert(registerData.message || 'Ошибка регистрации')
        return
      }

      const loginResponse = await fetch(
        'http://localhost:3000/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      )

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        alert('Регистрация успешна. Теперь войдите в аккаунт.')
        navigate('/login')
        return
      }

      localStorage.setItem('token', loginData.accessToken)

      navigate('/tasks')
    } catch (error) {
      console.error(error)
      alert('Не удалось подключиться к серверу')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Регистрация</h1>

        <p>Создайте новый аккаунт</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Зарегистрироваться
        </button>

        <p>
          Уже есть аккаунт?{' '}
          <Link to="/login">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register