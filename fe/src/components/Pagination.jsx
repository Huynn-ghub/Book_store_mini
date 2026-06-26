import React from 'react';

export default function Pagination({ page, totalPages, pageSize, count, onPageChange, onPageSizeChange }) {
  // Tạo danh sách trang hiển thị: luôn show trang đầu, cuối, và xung quanh trang hiện tại
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // số trang hiển thị xung quanh trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
        <span className="pagination-count">({count} sách)</span>
      </div>

      <div className="pagination-controls">
        {/* Nút Prev */}
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ‹ Trước
        </button>

        {/* Các nút số trang */}
        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#999', lineHeight: '30px' }}>…</span>
          ) : (
            <button
              key={p}
              className={`btn ${p === page ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onPageChange(p)}
              style={{ minWidth: '34px', fontWeight: p === page ? 'bold' : 'normal' }}
            >
              {p}
            </button>
          )
        )}

        {/* Nút Next */}
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Sau ›
        </button>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          <option value={5}>5 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
          <option value={100}>100 / trang</option>
        </select>
      </div>
    </div>
  );
}
