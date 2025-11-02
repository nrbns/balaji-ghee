import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { authAPI } from '../lib/api';

interface MasterLoginProps {
  onLoginSuccess: () => void;
}

export function MasterLogin({ onLoginSuccess }: MasterLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[var(--cream)] rounded-2xl shadow-2xl border border-[var(--gold)]/30 p-8 pointer-events-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] flex items-center justify-center">
            <Lock className="h-8 w-8 text-[var(--warm-black)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--warm-black)]">Master Panel Access</h2>
          <p className="text-sm text-[var(--warm-gray)] mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--warm-black)] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--warm-gray)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-[var(--gold)]/30 rounded-lg bg-white/60 focus:outline-none focus:border-[var(--gold)]"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--warm-black)] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--warm-gray)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-[var(--gold)]/30 rounded-lg bg-white/60 focus:outline-none focus:border-[var(--gold)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-[var(--warm-black)] font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

