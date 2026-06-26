import React, { useState, useEffect, useCallback } from 'react';
import { getCart, removeFromCart } from '../api/cartApi';
import { checkoutApi } from '../api/orderApi';

export default function CartPage({ onOrderPlaced }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [placing, setPlacing] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setItems(data);
    } catch {
      setError('Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
      setItems(items => items.filter(i => i.book_id !== bookId));
    } catch {
      setError('Không thể xóa sách khỏi giỏ hàng.');
    }
  };

  const handleCheckout = async () => {
    setPlacing(true);
    setError('');
    try {
      await checkoutApi();
      setItems([]);
      onOrderPlaced(); // chuyển sang tab Đơn hàng
    } catch (err) {
      setError(err?.error || 'Đặt hàng thất bại.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <p className="loading-msg">Đang tải giỏ hàng...</p>;

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>🛒 Giỏ hàng</h2>

      {error && <p className="error-msg">{error}</p>}

      {items.length === 0 ? (
        <p className="empty-msg">Giỏ hàng trống.</p>
      ) : (
        <>
          <table className="book-table" style={{ marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.book_title}</td>
                  <td>{item.book_author}</td>
                  <td>{Number(item.book_price).toLocaleString('vi-VN')}đ</td>
                  <td>
                    <span style={{
                      fontSize: '12px', padding: '2px 8px', borderRadius: '10px',
                      background: item.book_status === 'available' ? '#e6f4ea' : '#fce8e6',
                      color:      item.book_status === 'available' ? '#137333' : '#c5221f',
                    }}>
                      {item.book_status === 'available' ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.book_id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={handleCheckout}
              disabled={placing}
            >
              {placing ? 'Đang đặt hàng...' : `Đặt hàng (${items.length} sách)`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
