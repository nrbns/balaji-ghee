import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect } from 'react';
import anime from 'animejs';

interface ParallaxHeroProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export function ParallaxHero({ imageUrl, title, subtitle }: ParallaxHeroProps) {
  const ref = useRef(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    // Animate title letters with anime.js
    if (titleRef.current && heroRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const text = titleRef.current!.textContent || '';
              titleRef.current!.textContent = '';
              const words = text.split(' ');
              
              words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.marginRight = '0.5em';
                
                word.split('').forEach((char) => {
                  const charSpan = document.createElement('span');
                  charSpan.textContent = char === ' ' ? '\u00A0' : char;
                  charSpan.style.display = 'inline-block';
                  charSpan.style.opacity = '0';
                  charSpan.style.transform = 'translateY(50px) rotateX(-90deg)';
                  wordSpan.appendChild(charSpan);
                });
                
                titleRef.current!.appendChild(wordSpan);
                if (wordIndex < words.length - 1) {
                  titleRef.current!.appendChild(document.createTextNode(' '));
                }
              });

              const allChars = titleRef.current!.querySelectorAll('span span');
              anime({
                targets: allChars,
                opacity: [0, 1],
                translateY: [50, 0],
                rotateX: [-90, 0],
                delay: anime.stagger(80, { start: 300 }),
                duration: 1200,
                easing: 'easeOutElastic(1, .8)',
              });

              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(heroRef.current);
    }

    // Animate subtitle
    if (subtitleRef.current) {
      anime({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: 800,
        duration: 1000,
        easing: 'easeOutExpo',
      });
    }

    // Animate button
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: 1200,
        duration: 800,
        easing: 'easeOutElastic(1, .6)',
      });
    }

    // Floating particles animation
    const particles = document.querySelectorAll('.hero-particle');
    if (particles.length > 0) {
      anime({
        targets: Array.from(particles),
        translateY: function() {
          return anime.random(-30, 30);
        },
        translateX: function() {
          return anime.random(-30, 30);
        },
        opacity: [0.3, 0.7, 0.3],
        duration: function() {
          return anime.random(3000, 6000);
        },
        easing: 'easeInOutQuad',
        loop: true,
        delay: anime.stagger(200),
      });
    }
  }, []);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden bg-[var(--warm-black)]">
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="hero-particle absolute w-2 h-2 bg-[var(--gold)] rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      {/* Parallax Background */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="h-full w-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[var(--warm-black)]" />
        </div>
        
        {/* Caustic Light Effect */}
        <div className="caustic-light">
          <svg className="w-full h-full opacity-30">
            <filter id="caustic">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.02" 
                numOctaves="3" 
                result="turbulence"
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="turbulence" 
                scale="20" 
                xChannelSelector="R" 
                yChannelSelector="G"
              />
            </filter>
            <rect 
              width="100%" 
              height="100%" 
              fill="url(#goldGradient)" 
              filter="url(#caustic)"
            />
            <defs>
              <radialGradient id="goldGradient">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        ref={heroRef}
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div className="space-y-6 max-w-4xl">
          <div className="shimmer-effect inline-block">
            <h1 
              ref={titleRef}
              className="text-[clamp(2.5rem,8vw,6rem)] leading-[1.1] tracking-tight text-[var(--warm-white)]"
            >
              {title}
            </h1>
          </div>
          
          <p 
            ref={subtitleRef}
            className="text-[clamp(1rem,2vw,1.25rem)] text-[var(--gold-light)] opacity-0 max-w-2xl mx-auto"
          >
            {subtitle}
          </p>

          <button
            ref={buttonRef}
            className="glow-gradient mt-8 px-12 py-4 bg-[var(--gold)] text-[var(--warm-black)] rounded-full relative overflow-hidden group transition-all duration-300 opacity-0"
            onMouseEnter={(e) => {
              anime({
                targets: e.currentTarget,
                scale: 1.05,
                duration: 300,
              });
            }}
            onMouseLeave={(e) => {
              anime({
                targets: e.currentTarget,
                scale: 1,
                duration: 300,
              });
            }}
          >
            <span className="relative z-10">Explore Collection</span>
            <motion.div
              className="absolute inset-0 bg-[var(--gold-medium)]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12"
        >
          <div className="w-6 h-10 border-2 border-[var(--gold)] rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-[var(--gold)] rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
