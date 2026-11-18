import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'consumer'
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }))
  }

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

    if (form.password !== form.confirmPassword) {
      setError('As senhas não são iguais.')
      return
    }

    setSubmitting(true)

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    })

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
        <h1>Criar conta</h1>
        <p className="auth-subtitle">Cadastre-se para começar.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de conta</label>
            <select
              value={form.role}
              onChange={handleChange}
              name="role"
              required
            >
              <option value="consumer">Consumidor</option>
              <option value="merchant">Comerciante</option>
              <option value="delivery">Entregador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Crie uma senha (mín. 6 caracteres)"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirmar senha</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Digite novamente"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

export default Register