import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function redirectByRole(role) {
    if (role === 'consumer' || role === 'client') {
      navigate('/')
      return
    }
    if (role === 'merchant') {
      navigate('/parceiro')
      return
    }
    if (role === 'delivery') {
      navigate('/entregador')
      return
    }
    if (role === 'admin') {
      navigate('/admin')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const result = await login(email, password)

    setSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    redirectByRole(result.user.role)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">NORTEFE</div>
        <h1>Entrar</h1>
        <p className="auth-subtitle">Acesse sua conta para continuar.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}

export default Login