import React, { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from '../api/categoryApi';

const EMPTY_FORM = { name: '' };

export default function CategoryModal({ type, category, onClose, onSaved }) {
  const [form, setForm]     = useState(
    type === 'edit' && category
      ? { name: category.name }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { setErrors({ name: 'Tên danh mục là bắt buộc.' }); return; }

    setLoading(true);
    try {
      if (type === 'add')  await createCategory(form);
      if (type === 'edit') await updateCategory(category.id, form);
      onSaved();
    } catch (err) {
      if (err && typeof err === 'object') setErrors(err);
      else setErrors({ general: 'Đã xảy ra lỗi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(category.id);
      onSaved();
    } catch {
      setErrors({ general: 'Không thể xóa danh mục.' });
    } finally {
      setLoading(false);
    }
  };

  const titles = { add: 'Thêm Danh mục', edit: 'Sửa Danh mục', confirm: 'Xóa Danh mục' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titles[type]}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* CONFIRM DELETE */}
          {type === 'confirm' && (
            <div className="confirm-content">
              <p>Xóa danh mục <strong>"{category?.name}"</strong>? Sách trong danh mục này sẽ không có danh mục.</p>
              {errors.general && <p className="error-msg">{errors.general}</p>}
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {(type === 'add' || type === 'edit') && (
            <form onSubmit={handleSubmit} className="book-form" noValidate>
              {errors.general && <p className="error-msg">{errors.general}</p>}

              <div className="form-group">
                <label>Tên danh mục *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="VD: Khoa học, Văn học..." />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>


              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : type === 'add' ? 'Thêm' : 'Lưu'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
