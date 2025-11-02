import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { ShoppingCart, Menu, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function NavigationBar() {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLButtonElement>(null);
  
  const { totalItems } = useCart();
  
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(26, 24, 22, 0)', 'rgba(26, 24, 22, 0.95)']
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );

  useEffect(() => {
    // Animate nav items on mount
    if (logoRef.current) {
      anime({
        targets: logoRef.current,
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        easing: 'easeOutExpo',
      });
    }

    if (linksRef.current) {
      const links = linksRef.current.querySelectorAll('a');
      anime({
        targets: links,
        opacity: [0, 1],
        translateY: [-20, 0],
        delay: anime.stagger(100, { start: 300 }),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }

    if (cartRef.current) {
      anime({
        targets: cartRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: 800,
        duration: 600,
        easing: 'easeOutElastic(1, .6)',
      });
    }

    // Scroll-based animations
    const unsubscribe = scrollY.on('change', (latest) => {
      if (navRef.current) {
        if (latest > 50) {
          anime({
            targets: navRef.current,
            paddingTop: ['1rem', '0.75rem'],
            paddingBottom: ['1rem', '0.75rem'],
            duration: 300,
          });
        } else {
          anime({
            targets: navRef.current,
            paddingTop: ['0.75rem', '1rem'],
            paddingBottom: ['0.75rem', '1rem'],
            duration: 300,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      ref={navRef}
      style={{ backgroundColor, backdropFilter: backdropBlur }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 py-4"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          ref={logoRef}
          className="flex items-center space-x-3 opacity-0"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] flex items-center justify-center"
          >
            <span className="text-[var(--warm-white)]">B</span>
          </motion.div>
          <span className="text-[1.25rem] text-[var(--warm-white)] tracking-wide">
            Balaji Ghee
          </span>
        </div>

        {/* Nav Links */}
        <div
          ref={linksRef}
          className="hidden md:flex items-center space-x-8"
        >
          {['Products', 'Heritage', 'Recipes', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onMouseEnter={(e) => {
                anime({
                  targets: e.currentTarget,
                  translateY: -2,
                  duration: 200,
                });
                const underline = e.currentTarget.querySelector('.underline-effect');
                if (underline) {
                  anime({
                    targets: underline,
                    scaleX: [0, 1],
                    duration: 300,
                  });
                }
              }}
              onMouseLeave={(e) => {
                anime({
                  targets: e.currentTarget,
                  translateY: 0,
                  duration: 200,
                });
              }}
              className="text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors duration-300 relative group opacity-0"
            >
              {item}
              <span className="underline-effect absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--gold)] origin-left scale-x-0" />
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => {
              anime({
                targets: e.currentTarget,
                scale: 1.1,
                duration: 200,
              });
            }}
            onMouseLeave={(e) => {
              anime({
                targets: e.currentTarget,
                scale: 1,
                duration: 200,
              });
            }}
            className="relative p-2 text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors"
            title="Master Panel Login"
          >
            <LogIn className="w-6 h-6" />
          </button>

          <button
            ref={cartRef}
            onClick={() => navigate('/cart')}
            onMouseEnter={(e) => {
              anime({
                targets: e.currentTarget,
                scale: 1.1,
                rotate: [0, -10, 10, 0],
                duration: 400,
              });
            }}
            onMouseLeave={(e) => {
              anime({
                targets: e.currentTarget,
                scale: 1,
                duration: 200,
              });
            }}
            className="relative p-2 text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--gold)] text-[var(--warm-black)] rounded-full flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </button>

          <button className="md:hidden text-[var(--gold-light)]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
