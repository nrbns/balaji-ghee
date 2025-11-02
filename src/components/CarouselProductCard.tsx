import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import anime from 'animejs';
import { Star, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PremiumBadge } from './PremiumBadge';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  subtitle: string;
  priceINR: number;
  mrpINR: number;
  weights: string[];
  rating: number;
  reviews: number;
  image: string;
  badge: string | null;
  delivery: string;
  tags: string[];
}

interface CarouselProductCardProps {
  p: Product;
  onAdd: (product: Product, weight: string) => void;
}

export function CarouselProductCard({ p, onAdd }: CarouselProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState(p.weights[0]);
  const discount = Math.round(((p.mrpINR - p.priceINR) / p.mrpINR) * 100);
  const cardRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize Vanilla Tilt
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 12,
        speed: 800,
        glare: true,
        'max-glare': 0.25,
        scale: 1.02,
      });
    }

    // Animate price on mount
    if (priceRef.current && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime({
                targets: priceRef.current,
                innerHTML: [0, p.priceINR],
                easing: 'easeOutElastic(1, .6)',
                duration: 1500,
                round: 1,
                update: function(anim) {
                  if (priceRef.current) {
                    priceRef.current.innerHTML = `₹${Math.floor(anim.progress * p.priceINR / 100).toLocaleString('en-IN')}`;
                  }
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

    return () => {
      if (tiltRef.current && (tiltRef.current as any).vanillaTilt) {
        (tiltRef.current as any).vanillaTilt.destroy();
      }
    };
  }, [p.priceINR]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative min-w-[280px] max-w-[320px] snap-start rounded-2xl border border-[#E8E2D6] bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Badge */}
      {p.badge && (
        <div className="absolute top-6 left-6 z-10">
          <PremiumBadge text={p.badge} variant="gold" />
        </div>
      )}

      <div ref={tiltRef} className="relative">

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--cream-dark)] mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full"
        >
          <ImageWithFallback
            src={p.image}
            alt={p.name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Caustic glow on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <svg className="w-full h-full">
            <defs>
              <radialGradient id={`glow-${p.id}`}>
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <motion.circle
              cx="50%"
              cy="50%"
              r="40%"
              fill={`url(#glow-${p.id})`}
              animate={{ r: ['35%', '45%', '35%'], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
        </div>

        {/* Shimmer effect */}
        <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-lg text-[var(--warm-black)] mb-1 line-clamp-1">
            {p.name}
          </h3>
          <p className="text-sm text-[var(--warm-gray)] line-clamp-1">
            {p.subtitle}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
            <span className="text-sm text-[var(--warm-black)]">
              {p.rating}
            </span>
          </div>
          <span className="text-xs text-[var(--warm-gray)]">
            ({p.reviews.toLocaleString()} reviews)
          </span>
        </div>

        {/* Weight Selection */}
        <div className="flex flex-wrap gap-2">
          {p.weights.map((weight) => (
            <button
              key={weight}
              onClick={() => setSelectedWeight(weight)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 ${
                selectedWeight === weight
                  ? 'border-[var(--gold)] bg-[var(--gold-light)]/30 text-[var(--warm-black)]'
                  : 'border-[#E8E2D6] bg-white text-[var(--warm-gray)] hover:border-[var(--gold)]/50'
              }`}
            >
              {weight}
            </button>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span ref={priceRef} className="text-xl text-[var(--gold-medium)]">
                ₹0
              </span>
              {discount > 0 && (
                <span className="text-sm text-[var(--warm-gray)] line-through">
                  ₹{p.mrpINR.toLocaleString()}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-xs text-green-600">
                Save {discount}%
              </span>
            )}
          </div>

          <motion.button
            onClick={() => onAdd(p, selectedWeight)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-gradient rounded-full bg-[var(--warm-black)] p-2.5 text-[var(--warm-white)] shadow-md hover:bg-[var(--gold-dark)] transition-colors duration-300"
            aria-label={`Add ${p.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Delivery Info */}
        <p className="text-xs text-[var(--warm-gray)] pt-2 border-t border-[#E8E2D6]">
          🚚 {p.delivery}
        </p>
      </div>

      {/* Hover glow effect */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[var(--gold)]/20 via-transparent to-[var(--gold-light)]/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 pointer-events-none -z-10" />
    </motion.article>
  );
}
