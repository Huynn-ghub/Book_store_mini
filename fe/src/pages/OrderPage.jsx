import React, { useState, useEffect, useCallback } from 'react';
import { getOrders, confirmOrder } from '../api/orderApi';

const STATUS_LABEL = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận' };
const STATUS_COLOR = {
  pending:   { background: '#fff3cd', color: '#856404' },
  confirmed: { background: '#e6f4ea', color: '#137333' },
};

export default function OrderPage({ isAdmin }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      setError('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleConfirm = async (orderId) => {
    try {
      await confirmOrder(orderId);
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: 'confirmed' } : o));
    } catch {
      setError('Không thể xác nhận đơn hàng.');
    }
  };

  if (loading) return <p className="loading-msg">Đang tải đơn hàng...</p>;

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
        📦 {isAdmin ? 'Quản lý đơn hàng' : 'Đơn hàng của tôi'}
      </h2>

      {error && <p className="error-msg">{error}</p>}

      {orders.length === 0 ? (
        <p className="empty-msg">Chưa có đơn hàng nào.</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>#</th>
              {isAdmin && <th>Người đặt</th>}
              <th>Ngày đặt</th>
              <th>Số sách</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
              {isAdmin && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>{idx + 1}</td>
                  {isAdmin && <td>{order.username}</td>}
                  <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>{order.item_count} sách</td>
                  <td>
                    <span style={{
                      fontSize: '12px', padding: '2px 8px', borderRadius: '10px',
                      ...(STATUS_COLOR[order.status] || {}),
                    }}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      {expandedId === order.id ? 'Ẩn' : 'Xem'}
                    </button>
                  </td>
                  {isAdmin && (
                    <td>
                      {order.status === 'pending' && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleConfirm(order.id)}>
                          Xác nhận
                        </button>
                      )}
                    </td>
                  )}
                </tr>

                {/* Dòng chi tiết sách trong đơn */}
                {expandedId === order.id && (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} style={{ padding: '0 12px 12px', background: '#fafafa' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                        <thead>
                          <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '12px' }}>Tên sách</th>
                            <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '12px' }}>Giá lúc đặt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map(item => (
                            <tr key={item.id}>
                              <td style={{ padding: '5px 10px', fontSize: '13px', borderBottom: '1px solid #eee' }}>{item.book_title}</td>
                              <td style={{ padding: '5px 10px', fontSize: '13px', borderBottom: '1px solid #eee' }}>
                                {Number(item.price).toLocaleString('vi-VN')}đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
