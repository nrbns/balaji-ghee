import { NavigationBar } from './components/NavigationBar';
import { ParallaxHero } from './components/ParallaxHero';
import { HeritageSection } from './components/HeritageSection';
import { ProductCard } from './components/ProductCard';
import { ProductCarousel } from './components/ProductCarousel';
import { CTASection } from './components/CTASection';
import { ScrollReveal } from './components/ScrollReveal';
import { FloatingElements } from './components/FloatingElements';
import { MasterPanel } from './components/MasterPanel';
import { ContactForm } from './components/ContactForm';
import { useSiteConfig } from './context/SiteConfigContext';

export default function App() {
  const {
    config: { hero, products },
  } = useSiteConfig();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <NavigationBar />

      {/* Hero Section with Parallax */}
      <ParallaxHero
        imageUrl={hero.imageUrl}
        title={hero.title}
        subtitle={hero.subtitle}
      />

      {/* Heritage Section */}
      <HeritageSection />

      {/* Horizontal Product Carousel */}
      <ProductCarousel />

      {/* Products Section */}
      <section id="products" className="relative py-32 bg-gradient-to-b from-[var(--cream)] to-[var(--cream-dark)] overflow-hidden">
        {/* Floating Elements */}
        <FloatingElements count={12} elementType="circle" />
        
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-[150px] opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] text-[var(--warm-black)]">
                Our Collections
              </h2>
              <p className="text-[1.125rem] text-[var(--warm-gray)] leading-relaxed">
                Each jar tells a story of purity, craftsmanship, and timeless tradition. 
                Discover the perfect ghee for your wellness journey.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Contact Section */}
      <section id="contact" className="relative py-32 bg-gradient-to-b from-[var(--cream-dark)] to-[var(--cream)] overflow-hidden">
        <FloatingElements count={8} elementType="circle" />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-[150px] opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] text-[var(--warm-black)]">
                Get in Touch
              </h2>
              <p className="text-[1.125rem] text-[var(--warm-gray)] leading-relaxed">
                Have questions about our ghee? Want to place a custom order? We're here to help.
              </p>
            </div>
          </ScrollReveal>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-[var(--warm-black)] border-t border-[var(--gold)]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] flex items-center justify-center">
                  <span className="text-[var(--warm-white)]">B</span>
                </div>
                <span className="text-[1.25rem] text-[var(--warm-white)]">
                  Balaji Ghee
                </span>
              </div>
              <p className="text-[var(--gold-light)] opacity-80 leading-relaxed">
                Preserving tradition, delivering purity since 1975
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[var(--warm-white)] mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {['About Us', 'Products', 'Heritage', 'Contact'].map(link => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[var(--warm-white)] mb-4">Support</h4>
              <ul className="space-y-3">
                {['FAQs', 'Shipping', 'Returns', 'Track Order'].map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-[var(--warm-white)] mb-4">Stay Connected</h4>
              <p className="text-[var(--gold-light)] opacity-80 mb-4">
                Subscribe to our newsletter for exclusive offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-[var(--warm-gray)]/20 border border-[var(--gold)]/20 rounded-l-full text-[var(--warm-white)] placeholder:text-[var(--gold-light)]/50 focus:outline-none focus:border-[var(--gold)]"
                />
                <button className="px-6 py-2 bg-[var(--gold)] text-[var(--warm-black)] rounded-r-full hover:bg-[var(--gold-medium)] transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-[var(--gold)]/20 text-center text-[var(--gold-light)] opacity-60">
            <p>© 2025 Balaji Ghee. All rights reserved. Crafted with ❤️ and tradition.</p>
          </div>
        </div>
      </footer>

      <MasterPanel />
    </div>
  );
}
