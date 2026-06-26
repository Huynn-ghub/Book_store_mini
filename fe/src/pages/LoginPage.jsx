import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onGoRegister }) {
  const { login } = useAuth();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Vui lòng nhập username và password.');
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      setError('Sai username hoặc password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <h1 className="login-title">Book Management</h1>
        <p className="login-subtitle">Đăng nhập để tiếp tục</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && <p className="login-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username" name="username" type="text"
              autoComplete="username" placeholder="Nhập username..."
              value={form.username} onChange={handleChange} disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              autoComplete="current-password" placeholder="Nhập password..."
              value={form.password} onChange={handleChange} disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#555' }}>
            Chưa có tài khoản?{' '}
            <button type="button" onClick={onGoRegister}
              style={{ background: 'none', border: 'none', color: '#111', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              Đăng ký
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
