import React from 'react';

export default function FilterBar({ filters, onChange, onSearch, onClear, categories = [] }) {
  return (
    <div className="filter-bar">
      {/* Tìm theo tên sách - auto search khi gõ */}
      <input
        type="text"
        placeholder="Tìm theo tên sách..."
        value={filters.title}
        onChange={e => onChange({ ...filters, title: e.target.value })}
      />

      {/* Tìm theo tác giả - auto search khi gõ */}
      <input
        type="text"
        placeholder="Tìm theo tác giả..."
        value={filters.author}
        onChange={e => onChange({ ...filters, author: e.target.value })}
      />

      {/* Lọc theo danh mục */}
      <select
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">Tất cả danh mục</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Khoảng giá */}
      <input
        type="number"
        placeholder="Giá từ..."
        min="0"
        value={filters.min_price}
        onChange={e => onChange({ ...filters, min_price: e.target.value })}
        style={{ width: '100px' }}
      />
      <input
        type="number"
        placeholder="Giá đến..."
        min="0"
        value={filters.max_price}
        onChange={e => onChange({ ...filters, max_price: e.target.value })}
        style={{ width: '100px' }}
      />

      <button className="btn btn-primary" onClick={onSearch}>Lọc</button>
      <button className="btn btn-secondary" onClick={onClear}>Xóa lọc</button>
    </div>
  );
}
