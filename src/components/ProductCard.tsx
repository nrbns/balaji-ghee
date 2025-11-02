import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import anime from 'animejs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  delay?: number;
}

export function ProductCard({ imageUrl, title, description, price, delay = 0 }: ProductCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Initialize Vanilla Tilt for 3D effect
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 1000,
        glare: true,
        'max-glare': 0.3,
        gyroscope: false,
        scale: 1.02,
        transition: true,
      });
    }

    // Anime.js price animation on mount
    if (priceRef.current && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime({
                targets: priceRef.current,
                innerHTML: [0, parseFloat(price.replace(/[₹,]/g, ''))],
                easing: 'easeOutElastic(1, .6)',
                duration: 2000,
                delay: delay * 1000 + 500,
                round: 1,
                update: function (anim) {
                  priceRef.current!.innerHTML = `₹${Math.floor(anim.progress * parseFloat(price.replace(/[₹,]/g, '')) / 100).toLocaleString('en-IN')}`;
                },
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(cardRef.current);
    }

    // Title letter animation
    if (titleRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const text = titleRef.current!.textContent || '';
              titleRef.current!.textContent = '';
              const spans = text.split('').map((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                titleRef.current!.appendChild(span);
                return span;
              });

              anime({
                targets: spans,
                opacity: [0, 1],
                translateY: [20, 0],
                rotateX: [-90, 0],
                delay: anime.stagger(50, { start: delay * 1000 }),
                duration: 800,
                easing: 'easeOutElastic(1, .8)',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(cardRef.current!);
    }

    return () => {
      if (tiltRef.current && (tiltRef.current as any).vanillaTilt) {
        (tiltRef.current as any).vanillaTilt.destroy();
      }
    };
  }, [price, delay]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div ref={tiltRef} className="relative">
        {/* Image Container with Caustic Effect */}
        <div className="relative aspect-square overflow-hidden bg-[var(--cream-dark)]">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Caustic Light Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <svg className="w-full h-full">
            <defs>
              <radialGradient id={`caustic-${title}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.4" />
                <stop offset="50%" stopColor="var(--gold-light)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <motion.circle
              cx="50%"
              cy="50%"
              r="40%"
              fill={`url(#caustic-${title})`}
              animate={{
                r: ['35%', '45%', '35%'],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* Shimmer on Hover */}
        <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Golden Accent Corner */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
          className="absolute top-4 right-4 w-12 h-12 bg-[var(--gold)] rounded-full shimmer-effect"
        />
      </div>

      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="space-y-2">
          <h3 
            ref={titleRef}
            className="text-[1.5rem] text-[var(--warm-black)]"
          >
            {title}
          </h3>
          <p className="text-[0.95rem] text-[var(--warm-gray)] leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <span 
            ref={priceRef}
            className="text-[1.75rem] text-[var(--gold-medium)]"
          >
            ₹0
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-gradient px-6 py-3 bg-[var(--warm-black)] text-[var(--warm-white)] rounded-full relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Add to Cart</span>
            <motion.div
              className="absolute inset-0 bg-[var(--gold-dark)]"
              initial={{ scale: 0, borderRadius: '100%' }}
              whileHover={{ scale: 2, borderRadius: '0%' }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Glow Pulse Effect */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-[var(--gold)] via-transparent to-[var(--gold-light)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 pointer-events-none -z-10"
        animate={{
          opacity: [0, 0.2, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
