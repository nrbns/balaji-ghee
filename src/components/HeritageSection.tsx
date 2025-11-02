import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Sparkles, Award, Heart } from 'lucide-react';

export function HeritageSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: Sparkles,
      title: 'Pure & Traditional',
      description: 'Made using age-old bilona method for authentic taste and nutrition'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Sourced from indigenous A2 cow milk, rich in natural goodness'
    },
    {
      icon: Heart,
      title: 'Crafted with Love',
      description: 'Each batch is carefully prepared to preserve purity and heritage'
    }
  ];

  return (
    <section ref={ref} className="relative py-32 bg-[var(--cream)] overflow-hidden">
      {/* Ambient Background Gradient */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[var(--gold)] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[var(--gold-medium)] rounded-full blur-[120px] opacity-10" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block px-6 py-2 bg-[var(--gold-light)]/30 backdrop-blur-sm rounded-full border border-[var(--gold)]/20"
            >
              <span className="text-[var(--gold-dark)]">Our Heritage</span>
            </motion.div>

            <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] text-[var(--warm-black)]">
              Tradition Meets Purity
            </h2>

            <p className="text-[1.125rem] text-[var(--warm-gray)] leading-relaxed">
              For generations, we've preserved the sacred art of ghee-making. 
              Every golden drop carries the essence of tradition, crafted with devotion 
              and the finest ingredients nature provides.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                className="relative group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-500"
              >
                {/* Icon with Glow */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-flex p-4 bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold)] rounded-2xl relative"
                >
                  <feature.icon className="w-8 h-8 text-[var(--warm-black)]" />
                  
                  {/* Ambient Glow */}
                  <motion.div
                    className="absolute inset-0 bg-[var(--gold)] rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <h3 className="text-[1.5rem] text-[var(--warm-black)] mb-3">
                  {feature.title}
                </h3>

                <p className="text-[var(--warm-gray)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-10 w-32 h-32 border-2 border-[var(--gold)]/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[var(--gold)]/20 rounded-full blur-sm"
        />
      </div>
    </section>
  );
}
