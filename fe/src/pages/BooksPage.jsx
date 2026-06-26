import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBooks } from '../api/bookApi';
import { getCategories } from '../api/categoryApi';
import { addToCart } from '../api/cartApi';
import BookTable    from '../components/BookTable';
import Pagination   from '../components/Pagination';
import FilterBar    from '../components/FilterBar';
import BookModal    from '../components/BookModal';
import CategoryModal from '../components/CategoryModal';

export default function BooksPage() {
  const { isAdmin } = useAuth();

  // Books state
  const [books, setBooks]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount]           = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({ title: '', author: '', category: '', min_price: '', max_price: '' });
  const [draftFilters, setDraftFilters]     = useState({ title: '', author: '', category: '', min_price: '', max_price: '' });

  // Categories (for filter dropdown & book form)
  const [categories, setCategories] = useState([]);

  // Modals
  const [modal, setModal]         = useState(null); // book modal
  const [catModal, setCatModal]   = useState(null); // category modal
  const [cartMsg, setCartMsg]     = useState('');   // thông báo thêm vào giỏ

  // ── Fetch books ──────────────────────────────────────────────────────────────
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks({ page, page_size: pageSize, ...appliedFilters });
      setBooks(data.results);
      setTotalPages(data.total_pages);
      setCount(data.count);
    } catch {
      setError('Không thể tải danh sách sách.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, appliedFilters]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // ── Auto-search khi gõ title/author (debounce 500ms) ────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setAppliedFilters(prev => ({
        ...prev,
        title:  draftFilters.title,
        author: draftFilters.author,
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [draftFilters.title, draftFilters.author]);

  // ── Fetch categories ─────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = () => { setPage(1); setAppliedFilters({ ...draftFilters }); };
  const handleClear  = () => {
    const empty = { title: '', author: '', category: '', min_price: '', max_price: '' };
    setDraftFilters(empty);
    setAppliedFilters(empty);
    setPage(1);
  };
  const handlePageSizeChange = size => { setPageSize(size); setPage(1); };

  // Book modal
  const openAdd    = ()   => setModal({ type: 'add',     book: null });
  const openEdit   = book => setModal({ type: 'edit',    book });
  const openDetail = id   => setModal({ type: 'detail',  book: { id } });
  const openDelete = book => setModal({ type: 'confirm', book });
  const closeModal = ()   => setModal(null);
  const handleSaved = () => { closeModal(); fetchBooks(); };

  // Category modal
  const openCatAdd    = ()   => setCatModal({ type: 'add',     category: null });
  const closeCatModal = ()   => setCatModal(null);
  const handleCatSaved = ()  => { closeCatModal(); fetchCategories(); };

  // Add to cart (User)
  const handleAddToCart = async (book) => {
    setCartMsg('');
    try {
      await addToCart(book.id);
      setCartMsg(`✅ Đã thêm "${book.title}" vào giỏ hàng.`);
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
      setCartMsg(`❌ ${err?.error || 'Không thể thêm vào giỏ hàng.'}`);
      setTimeout(() => setCartMsg(''), 3000);
    }
  };

  return (
    <div>
      {cartMsg && (
        <p style={{ marginBottom: '12px', fontSize: '13px', color: cartMsg.startsWith('✅') ? '#137333' : '#b00' }}>
          {cartMsg}
        </p>
      )}
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <FilterBar
          filters={draftFilters}
          onChange={setDraftFilters}
          onSearch={handleSearch}
          onClear={handleClear}
          categories={categories}
        />
        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn" style={{ background: '#444', color: '#fff' }} onClick={openCatAdd}>+ Thêm danh mục</button>
            <button className="btn btn-primary" onClick={openAdd}>+ Thêm sách</button>
          </div>
        )}
      </div>

      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="loading-msg">Đang tải...</p>
      ) : (
        <BookTable
          books={books}
          isAdmin={isAdmin}
          onDetail={openDetail}
          onEdit={openEdit}
          onDelete={openDelete}
          onAddToCart={handleAddToCart}
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        count={count}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* ── Book Modal ────────────────────────────────────────────────── */}
      {modal && (
        <BookModal
          type={modal.type}
          book={modal.book}
          categories={categories}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}

      {/* ── Category Modal ────────────────────────────────────────────── */}
      {catModal && (
        <CategoryModal
          type={catModal.type}
          category={catModal.category}
          onClose={closeCatModal}
          onSaved={handleCatSaved}
        />
      )}
    </div>
  );
}
