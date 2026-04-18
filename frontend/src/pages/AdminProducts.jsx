import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { name: '', price: '', category: '', image: '', description: '', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editing, setEditing]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ type: '', text: '' });
  const { user }   = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) return navigate('/');
    load();
  }, []);

  const load = () => {
    setLoading(true);
    API.get('/products').then(res => { setProducts(res.data); setLoading(false); });
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/products/${editing}`, form);
        showMsg('success', '✅ Product updated successfully');
        setEditing(null);
      } else {
        await API.post('/products', form);
        showMsg('success', '✅ Product added successfully');
      }
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      showMsg('error', err.response?.data?.message || '❌ Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, price: p.price, category: p.category, image: p.image, description: p.description, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      showMsg('success', '✅ Product deleted');
      load();
    } catch {
      showMsg('error', '❌ Failed to delete product');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin — Manage Products</h1>
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Admin Panel</span>
      </div>

      {msg.text && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {msg.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-gray-700 mb-4">{editing ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Product Name *</label>
            <input required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="e.g. Wireless Headphones"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹) *</label>
            <input required type="number" min="0" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="e.g. 999"
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <input className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="e.g. Electronics"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
            <input type="number" min="0" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="e.g. 50"
              value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
            <input className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="https://example.com/image.jpg"
              value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              placeholder="Brief product description..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving}
              className="flex-1 bg-purple-600 text-white rounded-xl py-3 font-semibold hover:bg-purple-700 transition disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
            </button>
            {editing && (
              <button type="button" onClick={handleCancel}
                className="px-6 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <h2 className="font-semibold text-gray-700 mb-4">All Products ({products.length})</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No products yet. Add one above!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
              <img
                src={p.image || `https://placehold.co/80x80?text=${encodeURIComponent(p.name)}`}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                onError={e => { e.target.src = 'https://placehold.co/80x80?text=No+Image'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-sm text-gray-400">{p.category} • Stock: {p.stock}</p>
                <p className="text-blue-600 font-bold mt-1">₹{p.price}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(p)}
                    className="text-xs border border-blue-200 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)}
                    className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
