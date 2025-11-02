import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

// This component only shows the login button
// Clicking redirects to the /login page
export function MasterPanel() {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-[var(--warm-black)] px-5 py-3 text-[var(--warm-white)] shadow-2xl"
      onClick={() => navigate('/login')}
    >
      <LogIn className="h-4 w-4" />
      Login to Master Panel
    </motion.button>
  );
}
