import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { user }   = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    API.get('/orders/myorders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="text-center py-20 text-gray-400">Loading your orders...</div>
  );

  if (orders.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
      <p className="text-gray-400 mb-6">Your orders will appear here once you place one.</p>
      <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
        Start Shopping
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name || 'Product'} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <span className="font-bold text-blue-600 text-lg">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
