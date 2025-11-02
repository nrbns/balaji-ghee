import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface PremiumLoaderProps {
  size?: number;
  color?: string;
}

export function PremiumLoader({ size = 60, color = 'var(--gold)' }: PremiumLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaderRef.current) {
      const circles = loaderRef.current.querySelectorAll('.loader-circle');
      
      anime({
        targets: Array.from(circles),
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5],
        duration: 1500,
        delay: anime.stagger(150),
        easing: 'easeInOutQuad',
        loop: true,
      });

      // Rotate container
      anime({
        targets: loaderRef.current,
        rotate: 360,
        duration: 2000,
        easing: 'linear',
        loop: true,
      });
    }
  }, []);

  return (
    <div
      ref={loaderRef}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="loader-circle absolute rounded-full"
          style={{
            width: size / 4,
            height: size / 4,
            backgroundColor: color,
            left: '50%',
            top: '50%',
            marginLeft: -size / 8,
            marginTop: -size / 8,
            transform: `rotate(${i * 45}deg) translateY(-${size / 2}px)`,
            transformOrigin: `0 ${size / 2}px`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

