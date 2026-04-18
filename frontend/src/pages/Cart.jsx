import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [msg, setMsg]         = useState('');

  const placeOrder = async () => {
    if (!user) return navigate('/login');
    setPlacing(true);
    try {
      const items = cart.map(i => ({
        product:  i._id,
        name:     i.name,
        quantity: i.quantity,
        price:    i.price,
      }));
      await API.post('/orders', { items, total });
      clearCart();
      setMsg('✅ Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1500);
    } catch {
      setMsg('❌ Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 mb-6">Add some products to get started!</p>
      <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      {msg && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center">
              <img
                src={item.image || `https://placehold.co/80x80?text=${encodeURIComponent(item.name)}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                onError={e => { e.target.src = 'https://placehold.co/80x80?text=No+Image'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-blue-600 font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item._id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item._id)}
                  className="text-red-400 text-xs hover:text-red-600 mt-1">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {cart.map(i => (
              <div key={i._id} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>₹{(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
          {!user && (
            <p className="text-xs text-gray-400 text-center mt-3">You need to login to place an order</p>
          )}
        </div>
      </div>
    </div>
  );
}
