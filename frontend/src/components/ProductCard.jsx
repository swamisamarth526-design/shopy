import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      <img
        src={product.image || `https://placehold.co/300x200?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={e => { e.target.src = `https://placehold.co/300x200?text=No+Image`; }}
      />
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit mb-2">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
          <span className="text-xs text-gray-400">Stock: {product.stock}</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
