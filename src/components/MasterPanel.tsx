import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { MasterLogin } from './MasterLogin';
import { MasterLeadsManager } from './MasterLeadsManager';
import { Trash2, X, Plus, Settings2, Users, Home, LogOut, LogIn } from 'lucide-react';
import { authAPI } from '../lib/api';
import { getToken } from '../lib/api';

export function MasterPanel() {
  const { config, updateHero, updateProduct, addProduct, removeProduct } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'homepage' | 'leads'>('homepage');

  useEffect(() => {
    // Check if user is already logged in
    const token = getToken();
    if (token) {
      setAuthenticated(true);
    }

    // Listen for navigation bar login button click
    const handleOpenPanel = () => {
      setIsOpen(true);
    };
    
    window.addEventListener('openMasterPanel', handleOpenPanel);
    return () => window.removeEventListener('openMasterPanel', handleOpenPanel);
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setAuthenticated(false);
    setIsOpen(false);
  };

  const handleProductChange = (id: string, field: 'title' | 'description' | 'price' | 'imageUrl', value: string) => {
    updateProduct(id, { [field]: value });
  };

  const handleRemoveProduct = (id: string) => {
    if (config.products.length <= 1) return;
    removeProduct(id);
  };

  if (!authenticated) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-[var(--warm-black)] px-5 py-3 text-[var(--warm-white)] shadow-2xl"
          onClick={() => setIsOpen(true)}
        >
          <LogIn className="h-4 w-4" />
          Login to Master Panel
        </motion.button>

        <AnimatePresence>
          {isOpen && <MasterLogin onLoginSuccess={handleLoginSuccess} />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-[var(--warm-black)] px-5 py-3 text-[var(--warm-white)] shadow-2xl"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Settings2 className="h-4 w-4" />
        {isOpen ? 'Close Admin' : 'Master Panel'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            className="fixed right-0 top-0 z-[55] h-full w-full max-w-4xl overflow-y-auto border-l border-[var(--gold)]/20 bg-[var(--cream)]/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--gold)]/30 bg-[var(--cream)]/95 px-6 py-4 z-10">
              <div>
                <p className="text-sm uppercase tracking-wide text-[var(--gold-medium)]">Master Admin</p>
                <h2 className="text-2xl font-semibold text-[var(--warm-black)]">Control Panel</h2>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-[var(--gold)]/30 p-2 text-[var(--warm-black)] hover:bg-[var(--gold)]/10"
                  aria-label="Close admin panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--gold)]/20 bg-white/50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('homepage')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'homepage'
                      ? 'text-[var(--gold-medium)] border-b-2 border-[var(--gold)]'
                      : 'text-[var(--warm-gray)] hover:text-[var(--warm-black)]'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Homepage Editor
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'leads'
                      ? 'text-[var(--gold-medium)] border-b-2 border-[var(--gold)]'
                      : 'text-[var(--warm-gray)] hover:text-[var(--warm-black)]'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Leads Manager
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'homepage' ? (
                <div className="space-y-8">
                  {/* Hero Section */}
                  <section className="rounded-2xl border border-[var(--gold)]/20 bg-white/80 p-6 shadow-md">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-[var(--warm-black)]">Hero Section</h3>
                      <p className="text-sm text-[var(--warm-gray)]">Update the hero headline, subtext, and background image in real-time.</p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-[var(--warm-black)]">
                        Title
                        <input
                          type="text"
                          value={config.hero.title}
                          onChange={(event) => updateHero({ title: event.target.value })}
                          className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[var(--warm-black)]">
                        Subtitle
                        <textarea
                          value={config.hero.subtitle}
                          onChange={(event) => updateHero({ subtitle: event.target.value })}
                          rows={3}
                          className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[var(--warm-black)]">
                        Background Image URL
                        <input
                          type="url"
                          value={config.hero.imageUrl}
                          onChange={(event) => updateHero({ imageUrl: event.target.value })}
                          className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                        />
                      </label>

                      <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--cream)]/70 p-4 text-sm text-[var(--warm-gray)]">
                        <p className="mb-2 font-medium text-[var(--warm-black)]">Live Preview</p>
                        <div className="aspect-video overflow-hidden rounded-lg border border-[var(--gold)]/10">
                          <img
                            src={config.hero.imageUrl}
                            alt="Hero preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Products Section */}
                  <section className="rounded-2xl border border-[var(--gold)]/20 bg-white/80 p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--warm-black)]">Product Showcase</h3>
                        <p className="text-sm text-[var(--warm-gray)]">Curate the premium jars showcased on the homepage grid.</p>
                      </div>
                      <button
                        onClick={addProduct}
                        className="flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-4 py-2 text-sm text-[var(--warm-black)] hover:bg-[var(--gold)]/10"
                      >
                        <Plus className="h-4 w-4" />
                        Add Product
                      </button>
                    </div>

                    <div className="space-y-6">
                      {config.products.map((product, index) => (
                        <div key={product.id} className="rounded-xl border border-[var(--gold)]/20 bg-white/70 p-4 shadow-sm">
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm uppercase tracking-wide text-[var(--gold-medium)]">Product {index + 1}</p>
                              <h4 className="text-lg font-semibold text-[var(--warm-black)]">{product.title || 'Untitled Product'}</h4>
                            </div>
                            <button
                              onClick={() => handleRemoveProduct(product.id)}
                              disabled={config.products.length <= 1}
                              className="flex items-center gap-2 rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block text-sm font-medium text-[var(--warm-black)]">
                              Title
                              <input
                                type="text"
                                value={product.title}
                                onChange={(event) => handleProductChange(product.id, 'title', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                              />
                            </label>

                            <label className="block text-sm font-medium text-[var(--warm-black)]">
                              Price
                              <input
                                type="text"
                                value={product.price}
                                onChange={(event) => handleProductChange(product.id, 'price', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                              />
                            </label>

                            <label className="block text-sm font-medium text-[var(--warm-black)] md:col-span-2">
                              Description
                              <textarea
                                value={product.description}
                                onChange={(event) => handleProductChange(product.id, 'description', event.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                              />
                            </label>

                            <label className="block text-sm font-medium text-[var(--warm-black)] md:col-span-2">
                              Image URL
                              <input
                                type="url"
                                value={product.imageUrl}
                                onChange={(event) => handleProductChange(product.id, 'imageUrl', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-[var(--gold)]/30 bg-white/60 px-3 py-2 text-sm shadow-sm focus:border-[var(--gold)] focus:outline-none"
                              />
                            </label>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
                            <div className="overflow-hidden rounded-lg border border-[var(--gold)]/20 bg-[var(--cream)]/80">
                              <img src={product.imageUrl} alt={product.title} className="aspect-square h-full w-full object-cover" />
                            </div>
                            <p className="text-sm text-[var(--warm-gray)]">
                              Update product photography or copy here to see instant changes across the premium grid.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                <MasterLeadsManager />
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

