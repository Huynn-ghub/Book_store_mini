import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import BooksPage    from './pages/BooksPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage     from './pages/CartPage';
import OrderPage    from './pages/OrderPage';
import './App.css';

// ─── Main App ─────────────────────────────────────────────────────────────────

function BookApp() {
  const { isAdmin, username, logout } = useAuth();

  // Tab: 'books' | 'cart' | 'orders'
  const [tab, setTab] = useState('books');

  return (
    <div className="app">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="app-header">
        <h1>📚 Book Management</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#ccc' }}>
            {username} {isAdmin && <strong style={{ color: '#fff', background: '#555', padding: '1px 6px', borderRadius: '3px', fontSize: '11px' }}>ADMIN</strong>}
          </span>
          <button className="btn btn-logout" onClick={logout}>Đăng xuất</button>
        </div>
      </header>

      {/* ── Navigation Tab ────────────────────────────────────────────── */}
      <nav style={{ background: '#222', display: 'flex', gap: '0', borderBottom: '2px solid #333' }}>
        <button onClick={() => setTab('books')}
          style={{ padding: '10px 20px', background: tab === 'books' ? '#444' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
          📚 Sách
        </button>
        {!isAdmin && (
          <button onClick={() => setTab('cart')}
            style={{ padding: '10px 20px', background: tab === 'cart' ? '#444' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
            🛒 Giỏ hàng
          </button>
        )}
        <button onClick={() => setTab('orders')}
          style={{ padding: '10px 20px', background: tab === 'orders' ? '#444' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
          📦 Đơn hàng
        </button>
      </nav>

      <main className="app-main">
        {/* ── Tab: Sách ──────────────────────────────────────────────── */}
        {tab === 'books' && (
          <BooksPage />
        )}

        {/* ── Tab: Giỏ hàng (User only) ──────────────────────────────── */}
        {tab === 'cart' && !isAdmin && (
          <CartPage onOrderPlaced={() => setTab('orders')} />
        )}

        {/* ── Tab: Đơn hàng ──────────────────────────────────────────── */}
        {tab === 'orders' && (
          <OrderPage isAdmin={isAdmin} />
        )}
      </main>
    </div>
  );
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────

function AppGate() {
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return showRegister
      ? <RegisterPage onGoLogin={() => setShowRegister(false)} />
      : <LoginPage   onGoRegister={() => setShowRegister(true)} />;
  }
  return <BookApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}
