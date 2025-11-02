import { useEffect, useRef } from 'react';
import anime from 'animejs';
import VanillaTilt from 'vanilla-tilt';

interface PremiumBadgeProps {
  text: string;
  variant?: 'gold' | 'premium' | 'new' | 'bestseller';
  className?: string;
}

export function PremiumBadge({ text, variant = 'gold', className = '' }: PremiumBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize Vanilla Tilt for 3D effect
    if (badgeRef.current) {
      VanillaTilt.init(badgeRef.current, {
        max: 10,
        speed: 500,
        glare: true,
        'max-glare': 0.4,
        scale: 1.05,
      });
    }

    // Animate text on mount
    if (textRef.current) {
      anime({
        targets: textRef.current,
        scale: [0, 1],
        rotate: [-180, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)',
      });
    }
  }, []);

  const variantStyles = {
    gold: 'bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] text-[var(--warm-black)]',
    premium: 'bg-gradient-to-br from-purple-600 to-purple-800 text-white',
    new: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white',
    bestseller: 'bg-gradient-to-br from-[var(--gold-medium)] to-[var(--gold)] text-[var(--warm-black)]',
  };

  return (
    <div
      ref={badgeRef}
      className={`relative inline-block px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${variantStyles[variant]} ${className}`}
    >
      <span ref={textRef} className="inline-block relative z-10">
        {text}
      </span>
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer-effect rounded-full opacity-50" />
    </div>
  );
}

