import React, { useState, useEffect } from 'react';
import { getBook, createBook, updateBook, deleteBook } from '../api/bookApi';

const EMPTY_FORM = {
  title: '', author: '', published_date: '',
  price: '', quantity: '',
  category: '', status: 'available',
};

export default function BookModal({ type, book, onClose, onSaved, categories = [] }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [detail, setDetail]   = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === 'detail' && book?.id) {
      setLoading(true);
      getBook(book.id)
        .then(data => setDetail(data))
        .catch(() => setDetail(null))
        .finally(() => setLoading(false));
    }
    if (type === 'edit' && book) {
      setForm({
        title:          book.title          ?? '',
        author:         book.author         ?? '',
        published_date: book.published_date ?? '',
        price:          book.price          ?? '',
        quantity:       book.quantity       ?? '',
        category:       book.category       ?? '',
        status:         book.status         ?? 'available',
      });
    }
  }, [type, book]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())          errs.title = 'Title là bắt buộc';
    if (!form.author.trim())         errs.author = 'Author là bắt buộc';
    if (!form.published_date.trim()) errs.published_date = 'Ngày xuất bản là bắt buộc';
    if (form.price !== '' && isNaN(Number(form.price)))       errs.price = 'Price phải là số';
    if (form.quantity !== '' && isNaN(Number(form.quantity))) errs.quantity = 'Quantity phải là số';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      title:          form.title.trim(),
      author:         form.author.trim(),
      published_date: form.published_date,
      price:          form.price    !== '' ? Number(form.price)    : undefined,
      quantity:       form.quantity !== '' ? Number(form.quantity) : undefined,
      category:       form.category !== '' ? Number(form.category) : null,
      status:         form.status,
    };

    setLoading(true);
    try {
      if (type === 'add')  await createBook(payload);
      if (type === 'edit') await updateBook(book.id, payload);
      onSaved();
    } catch (err) {
      if (err && typeof err === 'object') setErrors(err);
      else setErrors({ general: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBook(book.id);
      onSaved();
    } catch {
      setErrors({ general: 'Failed to delete book.' });
    } finally {
      setLoading(false);
    }
  };

  const titles = { add: 'Thêm sách', edit: 'Sửa sách', detail: 'Chi tiết sách', confirm: 'Xóa sách' };
  const STATUS_LABEL = { available: 'Còn hàng', out_of_stock: 'Hết hàng' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titles[type]}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* ── DETAIL ─────────────────────────────────────────── */}
          {type === 'detail' && (
            loading ? <p>Đang tải...</p> : detail ? (
              <table className="detail-table">
                <tbody>
                  <tr><td><strong>ID</strong></td><td>{detail.id}</td></tr>
                  <tr><td><strong>Tên sách</strong></td><td>{detail.title}</td></tr>
                  <tr><td><strong>Tác giả</strong></td><td>{detail.author}</td></tr>
                  <tr><td><strong>Danh mục</strong></td><td>{detail.category_name || '—'}</td></tr>
                  <tr><td><strong>Ngày xuất bản</strong></td><td>{detail.published_date}</td></tr>
                  <tr><td><strong>Giá</strong></td><td>{Number(detail.price).toLocaleString('vi-VN')}đ</td></tr>
                  <tr><td><strong>SL tồn</strong></td><td>{detail.quantity}</td></tr>
                  <tr><td><strong>Trạng thái</strong></td><td>{STATUS_LABEL[detail.status] || detail.status}</td></tr>
                </tbody>
              </table>
            ) : <p>Không thể tải chi tiết sách.</p>
          )}

          {/* ── CONFIRM DELETE ──────────────────────────────────── */}
          {type === 'confirm' && (
            <div className="confirm-content">
              <p>Xóa sách <strong>"{book?.title}"</strong>?</p>
              {errors.general && <p className="error-msg">{errors.general}</p>}
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          )}

          {/* ── ADD / EDIT FORM ─────────────────────────────────── */}
          {(type === 'add' || type === 'edit') && (
            <form onSubmit={handleSubmit} className="book-form" noValidate>
              {errors.general && <p className="error-msg">{errors.general}</p>}

              <div className="form-group">
                <label>Tên sách *</label>
                <input name="title" value={form.title} onChange={handleChange} />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Tác giả *</label>
                <input name="author" value={form.author} onChange={handleChange} />
                {errors.author && <span className="field-error">{errors.author}</span>}
              </div>

              <div className="form-group">
                <label>Ngày xuất bản *</label>
                <input type="date" name="published_date" value={form.published_date} onChange={handleChange} />
                {errors.published_date && <span className="field-error">{errors.published_date}</span>}
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select name="category" value={form.category} onChange={handleChange}
                  style={{ padding: '7px 10px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '13px' }}>
                  <option value="">-- Không có --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Giá</label>
                <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label>Số lượng tồn</label>
                <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} />
                {errors.quantity && <span className="field-error">{errors.quantity}</span>}
              </div>




              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : type === 'add' ? 'Thêm sách' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
