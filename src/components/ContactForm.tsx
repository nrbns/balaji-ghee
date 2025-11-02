import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { leadsAPI } from '../lib/api';

export function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Capture UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      const utm = {
        source: urlParams.get('utm_source') || undefined,
        medium: urlParams.get('utm_medium') || undefined,
        campaign: urlParams.get('utm_campaign') || undefined,
        term: urlParams.get('utm_term') || undefined,
        content: urlParams.get('utm_content') || undefined,
      };

      await leadsAPI.create({
        ...formData,
        source: 'contact_form',
        utm: Object.keys(utm).length > 0 ? utm : undefined,
      });

      setStatus('success');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: '',
      });

      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-[var(--warm-black)] mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-[var(--gold)]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[var(--gold)] transition-colors"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--warm-black)] mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-[var(--gold)]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[var(--gold)] transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[var(--warm-black)] mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[var(--gold)]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[var(--gold)] transition-colors"
          placeholder="+91 9876543210"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--warm-black)] mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-[var(--gold)]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
          placeholder="Tell us how we can help you..."
        />
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Thank you! We'll contact you soon.</span>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={status === 'loading'}
        whileHover={{ scale: status !== 'loading' ? 1.02 : 1 }}
        whileTap={{ scale: status !== 'loading' ? 0.98 : 1 }}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-medium)] text-[var(--warm-black)] font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <div className="w-5 h-5 border-2 border-[var(--warm-black)] border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}

