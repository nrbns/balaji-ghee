import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface FloatingElement {
  id: string;
  size: number;
  left: number;
  top: number;
  delay: number;
}

interface FloatingElementsProps {
  count?: number;
  elementType?: 'circle' | 'star' | 'gold';
}

export function FloatingElements({ count = 20, elementType = 'circle' }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements] = useState<FloatingElement[]>(() => 
    Array.from({ length: count }, (_, i) => ({
      id: `floating-${i}`,
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2000,
    }))
  );

  useEffect(() => {
    // Animate elements
    if (containerRef.current) {
      const domElements = containerRef.current.querySelectorAll('.floating-element');
      
      anime({
        targets: Array.from(domElements),
        translateY: function() {
          return anime.random(-100, 100);
        },
        translateX: function() {
          return anime.random(-50, 50);
        },
        rotate: function() {
          return anime.random(0, 360);
        },
        opacity: [
          { value: 0, duration: 0 },
          { value: [0.3, 0.6], duration: 1000 },
          { value: 0.3, duration: 1000 },
        ],
        scale: [
          { value: [0.8, 1.2], duration: 2000 },
          { value: 0.8, duration: 2000 },
        ],
        duration: function() {
          return anime.random(3000, 6000);
        },
        delay: function(el, i) {
          return elements[i]?.delay || 0;
        },
        easing: 'easeInOutQuad',
        loop: true,
      });
    }
  }, [elements]);

  const renderElement = (element: FloatingElement) => {
    const baseClasses = 'floating-element absolute pointer-events-none';
    
    if (elementType === 'star') {
      return (
        <div
          key={element.id}
          className={`${baseClasses} text-[var(--gold)] opacity-30`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            fontSize: `${element.size}px`,
          }}
        >
          ★
        </div>
      );
    }
    
    if (elementType === 'gold') {
      return (
        <div
          key={element.id}
          className={`${baseClasses} bg-[var(--gold)] rounded-full opacity-20 blur-sm`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
          }}
        />
      );
    }
    
    // Default circle
    return (
      <div
        key={element.id}
        className={`${baseClasses} border-2 border-[var(--gold)]/30 rounded-full`}
        style={{
          left: `${element.left}%`,
          top: `${element.top}%`,
          width: `${element.size}px`,
          height: `${element.size}px`,
        }}
      />
    );
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {elements.map(renderElement)}
    </div>
  );
}

