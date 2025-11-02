import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { AnimatedCounter } from './AnimatedCounter';
import { FloatingElements } from './FloatingElements';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-32 bg-[var(--warm-black)] overflow-hidden">
      {/* Floating Elements */}
      <FloatingElements count={15} elementType="gold" />
      
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--gold)] rounded-full blur-[150px]"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center space-y-12">
        <ScrollReveal>
          <motion.div
            animate={{
              textShadow: [
                '0 0 20px rgba(212, 175, 55, 0.3)',
                '0 0 40px rgba(212, 175, 55, 0.6)',
                '0 0 20px rgba(212, 175, 55, 0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] text-[var(--warm-white)] mb-6">
              Experience the Golden Tradition
            </h2>
          </motion.div>

          <p className="text-[1.25rem] text-[var(--gold-light)] max-w-2xl mx-auto leading-relaxed opacity-90">
            Join thousands who trust Balaji Ghee for their daily wellness. 
            Pure, authentic, and crafted with devotion.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Primary CTA with Warm Glow */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glow-gradient relative group px-10 py-5 bg-[var(--gold)] text-[var(--warm-black)] rounded-full overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Shop Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>

              {/* Hover Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />

              {/* Warm Glow */}
              <motion.div
                className="absolute -inset-4 bg-[var(--gold)] rounded-full blur-2xl opacity-0 group-hover:opacity-60"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-transparent text-[var(--warm-white)] border-2 border-[var(--gold)]/50 hover:border-[var(--gold)] rounded-full transition-colors duration-300"
            >
              Learn More
            </motion.button>
          </div>
        </ScrollReveal>

        {/* Trust Indicators */}
        <ScrollReveal delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-12 pt-12 border-t border-[var(--gold)]/20">
            {[
              { value: 25000, suffix: '+', label: 'Happy Customers' },
              { value: 100, suffix: '%', label: 'Pure & Natural' },
              { value: 50, suffix: '+', label: 'Years of Heritage' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-[2.5rem] text-[var(--gold)] mb-2 font-semibold">
                  <AnimatedCounter 
                    endValue={stat.value} 
                    suffix={stat.suffix}
                    className="block"
                  />
                </div>
                <div className="text-[var(--gold-light)] opacity-80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Decorative Light Rays */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-[2px] h-[300px] bg-gradient-to-b from-[var(--gold)] to-transparent origin-top"
            style={{
              transform: `rotate(${i * 60}deg) translateY(-150px)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
}
