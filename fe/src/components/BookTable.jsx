import React from 'react';

const STATUS_LABEL = { available: 'Còn hàng', out_of_stock: 'Hết hàng' };

export default function BookTable({ books, isAdmin, onDetail, onEdit, onDelete, onAddToCart }) {
  if (books.length === 0) {
    return <p className="empty-msg">Không có sách nào.</p>;
  }

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Danh mục</th>
          <th>Giá</th>
          <th>SL tồn</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, idx) => (
          <tr key={book.id}>
            <td>{idx + 1}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.category_name || '—'}</td>
            <td>{Number(book.price).toLocaleString('vi-VN')}đ</td>
            <td>{book.quantity}</td>
            <td>
              <span style={{
                fontSize: '12px', padding: '2px 8px', borderRadius: '10px',
                background: book.status === 'available' ? '#e6f4ea' : '#fce8e6',
                color:      book.status === 'available' ? '#137333' : '#c5221f',
              }}>
                {STATUS_LABEL[book.status] || book.status}
              </span>
            </td>
            <td className="actions">
              <button className="btn btn-sm btn-secondary" onClick={() => onDetail(book.id)}>Chi tiết</button>
              {isAdmin ? (
                <>
                  <button className="btn btn-sm btn-primary" onClick={() => onEdit(book)}>Sửa</button>
                  <button className="btn btn-sm btn-danger"  onClick={() => onDelete(book)}>Xóa</button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onAddToCart(book)}
                  disabled={book.status !== 'available'}
                >
                  + Giỏ hàng
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
