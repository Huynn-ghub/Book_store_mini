import React, { useState } from 'react';
import { registerApi } from '../api/authApi';

export default function RegisterPage({ onGoLogin }) {
  const [form, setForm]       = useState({ username: '', email: '', password: '', password2: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: null, general: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = {};
    if (!form.username.trim())  errs.username  = 'Vui lòng nhập username.';
    if (!form.password)         errs.password  = 'Vui lòng nhập mật khẩu.';
    if (form.password !== form.password2) errs.password2 = 'Mật khẩu không khớp.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await registerApi(form);
      setSuccess(true);
    } catch (err) {
      if (err && typeof err === 'object') setErrors(err);
      else setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">✅</div>
          <h1 className="login-title">Đăng ký thành công!</h1>
          <p className="login-subtitle">Tài khoản đã được tạo.</p>
          <button className="btn btn-primary login-btn" onClick={onGoLogin}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <h1 className="login-title">Đăng ký</h1>
        <p className="login-subtitle">Tạo tài khoản mới</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {errors.general && <p className="login-error">{errors.general}</p>}

          <div className="form-group">
            <label htmlFor="reg-username">Username *</label>
            <input
              id="reg-username" name="username" type="text"
              placeholder="Nhập username..." value={form.username}
              onChange={handleChange} disabled={loading}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email" name="email" type="email"
              placeholder="Nhập email..." value={form.email}
              onChange={handleChange} disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Mật khẩu *</label>
            <input
              id="reg-password" name="password" type="password"
              placeholder="Ít nhất 6 ký tự..." value={form.password}
              onChange={handleChange} disabled={loading}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password2">Xác nhận mật khẩu *</label>
            <input
              id="reg-password2" name="password2" type="password"
              placeholder="Nhập lại mật khẩu..." value={form.password2}
              onChange={handleChange} disabled={loading}
            />
            {errors.password2 && <span className="field-error">{errors.password2}</span>}
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#555' }}>
            Đã có tài khoản?{' '}
            <button type="button" onClick={onGoLogin}
              style={{ background: 'none', border: 'none', color: '#111', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
