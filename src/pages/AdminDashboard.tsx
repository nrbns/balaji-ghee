import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';
import { MasterLeadsManager } from '../components/MasterLeadsManager';
import { Trash2, Plus, Settings2, Users, Home, LogOut, Shield, BarChart3 } from 'lucide-react';
import { authAPI, getToken } from '../lib/api';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { config, updateHero, updateProduct, addProduct, removeProduct } = useSiteConfig();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'homepage' | 'leads' | 'analytics'>('homepage');

  useEffect(() => {
    // Check authentication
    const token = getToken();
    if (token) {
      setAuthenticated(true);
    } else {
      // Redirect to home page if not authenticated
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const handleProductChange = (id: string, field: 'title' | 'description' | 'price' | 'imageUrl', value: string) => {
    updateProduct(id, { [field]: value });
  };

  const handleRemoveProduct = (id: string) => {
    if (config.products.length <= 1) return;
    removeProduct(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--warm-gray)]">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] via-[var(--cream-dark)] to-[var(--warm-black)]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[var(--warm-black)] to-[var(--warm-gray)] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Master Admin Panel</h1>
                <p className="text-sm text-white/80">Complete Control Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'homepage'
                ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-white shadow-lg'
                : 'text-[var(--warm-gray)] hover:bg-gray-100'
            }`}
          >
            <Settings2 className="w-5 h-5" />
            Homepage Editor
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-white shadow-lg'
                : 'text-[var(--warm-gray)] hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Leads Manager
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-white shadow-lg'
                : 'text-[var(--warm-gray)] hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'homepage' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {/* Hero Section Editor */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[var(--warm-black)] mb-6">Hero Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={config.hero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={config.hero.subtitle}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                  <input
                    type="text"
                    value={config.hero.imageUrl}
                    onChange={(e) => updateHero({ imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Products Editor */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--warm-black)]">Featured Products</h2>
                <button
                  onClick={() => addProduct({
                    id: `product-${Date.now()}`,
                    title: 'New Product',
                    description: 'Product description',
                    price: '₹0',
                    imageUrl: 'https://via.placeholder.com/400x300'
                  })}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={product.title}
                        onChange={(e) => handleProductChange(product.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent font-semibold"
                      />
                      <textarea
                        value={product.description}
                        onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none"
                        rows={3}
                      />
                      <input
                        type="text"
                        value={product.price}
                        onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={product.imageUrl}
                        onChange={(e) => handleProductChange(product.id, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent text-sm"
                        placeholder="Image URL"
                      />
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <MasterLeadsManager />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-[var(--warm-black)] mb-6">Analytics Dashboard</h2>
            <div className="text-center py-12">
              <BarChart3 className="w-24 h-24 text-[var(--gold)] mx-auto mb-4 opacity-50" />
              <p className="text-[var(--warm-gray)]">Analytics coming soon!</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

