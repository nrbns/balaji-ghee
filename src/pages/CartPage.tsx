import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
    // TODO: Implement checkout flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] via-[var(--cream-dark)] to-[var(--warm-black)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-white/80">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-12 text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--warm-black)] mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious ghee to get started!</p>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-white font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-[var(--warm-black)] mb-2">{item.name}</h3>
                    <p className="text-[var(--gold-medium)] font-medium mb-4">{item.weight}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <span className="text-2xl font-bold text-[var(--warm-black)]">
                        ₹{item.price.toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <motion.button
                onClick={clearCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                Clear Cart
              </motion.button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sticky top-6"
              >
                <h2 className="text-2xl font-bold text-[var(--warm-black)] mb-6">Order Summary</h2>
                
                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-[var(--warm-black)]">
                      <span>Total</span>
                      <span className="text-[var(--gold-medium)]">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-4"
                >
                  <CreditCard className="h-5 w-5" />
                  Proceed to Checkout
                </motion.button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 border-2 border-[var(--gold)] text-[var(--gold-medium)] rounded-xl hover:bg-[var(--gold)]/10 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

