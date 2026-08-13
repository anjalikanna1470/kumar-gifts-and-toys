import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Package, Users, Sparkles, AlertTriangle, Plus, Edit, Trash2, CheckCircle2, Upload, RefreshCw, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl, getImageUrl } from '../config/api';

export default function AdminDashboardPage({ onNavigate }) {
  const { token, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Lists
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    category_id: 1,
    stock: 15,
    is_customizable: false,
    customization_type: 'mug',
    images: [],
  });
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  useEffect(() => {
    if (token && isAdmin) {
      loadDashboardData();
    }
  }, [token, isAdmin]);

  const loadDashboardData = () => {
    setLoading(true);

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(getApiUrl('/api/admin/dashboard-stats'), { headers }).then(r => r.json()),
      fetch(getApiUrl('/api/products')).then(r => r.json()),
      fetch(getApiUrl('/api/orders/admin/all'), { headers }).then(r => r.json()),
      fetch(getApiUrl('/api/custom-orders/admin/list'), { headers }).then(r => r.json()),
      fetch(getApiUrl('/api/admin/customers'), { headers }).then(r => r.json()),
      fetch(getApiUrl('/api/categories')).then(r => r.json()),
    ])
      .then(([statsData, prodData, orderData, customData, custData, catData]) => {
        setStats(statsData);
        setProducts(Array.isArray(prodData) ? prodData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
        setCustomOrders(Array.isArray(customData) ? customData : []);
        setCustomers(Array.isArray(custData) ? custData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    fetch(getApiUrl(`/api/orders/admin/status/${orderId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ order_status: newStatus })
    })
      .then(res => res.json())
      .then(() => loadDashboardData());
  };

  const handleImageFileUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    const formData = new FormData();
    formData.append('image', files[0]);

    fetch(getApiUrl('/api/upload/single'), {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setUploadedImageUrls(prev => [...prev, data.url]);
        }
      });
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;

    fetch(getApiUrl('/api/products'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newProduct,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['/images/custom_mug.png']
      })
    })
      .then(res => res.json())
      .then(() => {
        setIsAddModalOpen(false);
        setUploadedImageUrls([]);
        setNewProduct({ title: '', description: '', short_description: '', price: '', discount_price: '', category_id: 1, stock: 15, is_customizable: false, customization_type: 'mug', images: [] });
        loadDashboardData();
      });
  };

  const handleDeleteProduct = (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    fetch(getApiUrl(`/api/products/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => loadDashboardData());
  };

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-bold text-lg">Administrative Privileges Required</h2>
        <button onClick={() => onNavigate('admin-login')} className="px-6 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl">
          Login as Store Owner
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 dark:border-slate-800 pb-6">
        <div>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
            STORE OWNER DASHBOARD
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
            Kumar Gifts & Toys Control Center
          </h1>
          <p className="text-xs text-slate-500">Lawyer Pet Extension, Ongole Store Management</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={loadDashboardData} className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview Analytics' },
          { id: 'custom-orders', label: `Custom Orders (${customOrders.length})` },
          { id: 'orders', label: `All Orders (${orders.length})` },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'inventory', label: 'Inventory & Stock' },
          { id: 'customers', label: `Customers (${customers.length})` },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === tb.id ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Store Revenue</span>
              <p className="font-extrabold text-2xl text-slate-900 dark:text-white">₹{stats?.totalRevenue || 0}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Orders</span>
              <p className="font-extrabold text-2xl text-slate-900 dark:text-white">{stats?.totalOrders || 0}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-xs font-bold text-amber-500">Pending Custom Queue</span>
              <p className="font-extrabold text-2xl text-amber-600">{stats?.customOrdersPending || 0}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-xs font-bold text-rose-500">Low Stock Products</span>
              <p className="font-extrabold text-2xl text-rose-600">{stats?.lowStockProducts?.length || 0}</p>
            </div>
          </div>

          {/* Low Stock Warning Box */}
          {stats?.lowStockProducts?.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock Inventory Alerts!
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {stats.lowStockProducts.map(p => (
                  <span key={p.id} className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border text-slate-700 dark:text-slate-200">
                    {p.title} (Stock: <strong className="text-rose-600">{p.stock}</strong>)
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: CUSTOM ORDERS QUEUE (DEDICATED SECTION) */}
      {activeTab === 'custom-orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Personalized Custom Gift Queue</h3>

          <div className="space-y-4">
            {customOrders.length > 0 ? (
              customOrders.map(co => (
                <div key={co.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between border-b border-slate-100 dark:border-slate-700 pb-2 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white">{co.product_title}</span>
                      <span className="text-[10px] text-slate-400 block">Order ID: #{co.order_number} • Customer: {co.customer_name} ({co.customer_phone})</span>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-full h-fit">
                      Status: {co.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl">
                      <span className="font-bold text-rose-600 block">Custom Message / Text:</span>
                      <p className="font-serif italic text-slate-800 dark:text-white text-sm">"{co.custom_text || 'No text'}"</p>
                      <p className="text-[10px] text-slate-400">Font: {co.font_style} | Color: {co.text_color}</p>
                      {co.special_instructions && (
                        <p className="text-[10px] text-amber-600 font-semibold pt-1">
                          Instruction: {co.special_instructions}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {co.uploaded_image_url ? (
                        <a href={getImageUrl(co.uploaded_image_url)} target="_blank" rel="noopener noreferrer" className="group relative">
                          <img src={getImageUrl(co.uploaded_image_url)} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-300" />
                          <span className="text-[9px] bg-slate-900 text-white px-1 rounded absolute bottom-1 right-1">Click High-Res</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">No photo uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200">
                No custom orders pending in queue.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ALL ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="p-3 font-extrabold text-rose-600">{o.order_number}</td>
                  <td className="p-3">
                    <span className="font-bold block">{o.customer_name || 'Guest'}</span>
                    <span className="text-[10px] text-slate-400">{o.customer_phone}</span>
                  </td>
                  <td className="p-3 font-black">₹{o.total_amount}</td>
                  <td className="p-3">{o.payment_method} ({o.payment_status})</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {o.order_status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={o.order_status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="text-[10px] font-bold p-1 rounded border dark:bg-slate-900"
                    >
                      {['Placed', 'Confirmed', 'Processing', 'Customized', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-3">
                <img src={getImageUrl(p.primary_image || '/images/custom_mug.png')} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-xs line-clamp-1">{p.title}</h4>
                  <p className="text-[10px] text-slate-400">Stock: {p.stock} | Price: ₹{p.discount_price || p.price}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-[10px] font-bold text-rose-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Product to Store</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Customized Magic Mug"
                  className="w-full p-2.5 rounded-xl border dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.discount_price}
                    onChange={(e) => setNewProduct({ ...newProduct, discount_price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold">Category</label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border dark:bg-slate-900"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold">Upload Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageFileUpload} className="block mt-1" />
                {uploadedImageUrls.length > 0 && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Image uploaded!</p>
                )}
              </div>

              <label className="flex items-center gap-2 font-semibold pt-1">
                <input
                  type="checkbox"
                  checked={newProduct.is_customizable}
                  onChange={(e) => setNewProduct({ ...newProduct, is_customizable: e.target.checked })}
                />
                Allow Customer Personalization (Photo/Text)
              </label>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-rose-600 text-white font-bold rounded-xl">Publish Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
