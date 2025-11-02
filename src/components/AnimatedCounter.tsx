import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface AnimatedCounterProps {
  endValue: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ 
  endValue, 
  suffix = '', 
  prefix = '', 
  duration = 2000,
  className = '' 
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (counterRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime({
                targets: { value: 0 },
                value: endValue,
                duration: duration,
                easing: 'easeOutElastic(1, .6)',
                round: 1,
                update: function(anim) {
                  if (counterRef.current) {
                    counterRef.current.textContent = 
                      `${prefix}${Math.floor(anim.animatables[0].target.value)}${suffix}`;
                  }
                },
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(counterRef.current);
    }
  }, [endValue, suffix, prefix, duration]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

