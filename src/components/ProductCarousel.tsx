import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselProductCard } from './CarouselProductCard';
import { ScrollReveal } from './ScrollReveal';
import { useCart } from '../context/CartContext';

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

// Product data - Replace with your actual products
const PRODUCTS_DATA: Product[] = [
  {
    id: "a2-cow-ghee-1l",
    name: "A2 Cow Ghee",
    subtitle: "Grass-fed • Bilona • Small-batch",
    priceINR: 1799,
    mrpINR: 1999,
    weights: ["200 ml", "500 ml", "1 L"],
    rating: 4.9,
    reviews: 812,
    image: "https://images.unsplash.com/photo-1603596310730-360fede58035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGVlJTIwYnV0dGVyJTIwZ29sZHxlbnwxfHx8fDE3NjE5ODczNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Bestseller",
    delivery: "4–6 hrs in Hyderabad",
    tags: ["a2", "cow", "bilona", "premium"]
  },
  {
    id: "golden-heritage-500ml",
    name: "Golden Heritage",
    subtitle: "Traditional herbs • Ayurvedic blend",
    priceINR: 1799,
    mrpINR: 2199,
    weights: ["250 ml", "500 ml", "1 L"],
    rating: 4.8,
    reviews: 643,
    image: "https://images.unsplash.com/photo-1717438647017-15f7736d1cb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1aWQlMjBnb2xkJTIwaG9uZXl8ZW58MXx8fHwxNzYxOTg3MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "New",
    delivery: "Same day in metro cities",
    tags: ["heritage", "ayurvedic", "herbs"]
  },
  {
    id: "royal-collection-1l",
    name: "Royal Collection",
    subtitle: "Artisanal • Hand-churned • Limited edition",
    priceINR: 2199,
    mrpINR: 2599,
    weights: ["500 ml", "1 L"],
    rating: 5.0,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1752134594016-f4969838b68d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbHV4dXJ5JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjE5ODczNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Premium",
    delivery: "Express delivery available",
    tags: ["royal", "artisanal", "limited"]
  },
  {
    id: "desi-ghee-classic-1l",
    name: "Classic Desi Ghee",
    subtitle: "Traditional method • Pure & natural",
    priceINR: 1499,
    mrpINR: 1799,
    weights: ["200 ml", "500 ml", "1 L", "2 L"],
    rating: 4.7,
    reviews: 1523,
    image: "https://images.unsplash.com/photo-1603596310730-360fede58035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGVlJTIwYnV0dGVyJTIwZ29sZHxlbnwxfHx8fDE3NjE5ODczNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: null,
    delivery: "Next day delivery",
    tags: ["classic", "traditional", "natural"]
  },
  {
    id: "organic-ghee-500ml",
    name: "Organic Ghee",
    subtitle: "Certified organic • Farm-fresh",
    priceINR: 1899,
    mrpINR: 2299,
    weights: ["250 ml", "500 ml", "1 L"],
    rating: 4.9,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1717438647017-15f7736d1cb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1aWQlMjBnb2xkJTIwaG9uZXl8ZW58MXx8fHwxNzYxOTg3MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "Certified",
    delivery: "2–3 days delivery",
    tags: ["organic", "certified", "farm-fresh"]
  },
  {
    id: "buffalo-ghee-1l",
    name: "Buffalo Ghee",
    subtitle: "Rich & aromatic • High fat content",
    priceINR: 1399,
    mrpINR: 1699,
    weights: ["500 ml", "1 L", "2 L"],
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1752134594016-f4969838b68d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbHV4dXJ5JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjE5ODczNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: null,
    delivery: "Standard delivery",
    tags: ["buffalo", "aromatic", "rich"]
  }
];

export function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addItem } = useCart();
  
  const products = PRODUCTS_DATA;

  // Handle add to cart
  const handleAddToCart = (product: Product, weight: string) => {
    const weightPrices: { [key: string]: number } = {
      "200 ml": product.priceINR * 0.2,
      "250 ml": product.priceINR * 0.25,
      "500 ml": product.priceINR * 0.5,
      "1 L": product.priceINR,
    };
    
    addItem({
      id: `${product.id}-${weight}`,
      name: product.name,
      imageUrl: product.image,
      price: weightPrices[weight] || product.priceINR,
      weight: weight,
    });
  };

  // Scroll by one card width
  const scrollByCard = (direction: number) => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    const cardWidth = 320; // card width + gap
    const scrollAmount = cardWidth * direction;
    
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    // Update button states after scroll
    setTimeout(() => updateScrollButtons(), 300);
  };

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    setCanScrollLeft(track.scrollLeft > 10);
    setCanScrollRight(
      track.scrollLeft < track.scrollWidth - track.clientWidth - 10
    );
  };

  return (
    <section 
      id="products-carousel" 
      className="relative py-20 bg-gradient-to-b from-[var(--cream-dark)] to-[var(--cream)]"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 right-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="flex items-end justify-between mb-8">
          <ScrollReveal>
            <div className="space-y-2">
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] text-[var(--warm-black)]">
                Featured Collection
              </h2>
              <p className="text-[var(--warm-gray)] max-w-2xl">
                Handpicked selections from our heritage range. Each jar crafted with tradition and care.
              </p>
            </div>
          </ScrollReveal>

          {/* Desktop navigation buttons */}
          <div className="hidden md:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollLeft}
              className="rounded-xl border border-[#E8E2D6] p-2.5 text-[var(--warm-black)] hover:bg-white hover:border-[var(--gold)]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollByCard(1)}
              disabled={!canScrollRight}
              className="rounded-xl border border-[#E8E2D6] p-2.5 text-[var(--warm-black)] hover:bg-white hover:border-[var(--gold)]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          onScroll={updateScrollButtons}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pt-2 pb-6 pr-1"
          style={{ 
            scrollBehavior: 'smooth', 
            WebkitOverflowScrolling: 'touch' 
          }}
          aria-label="Product carousel"
          role="region"
        >
          {products.map((product) => (
            <CarouselProductCard 
              key={product.id} 
              p={product} 
              onAdd={handleAddToCart} 
            />
          ))}
        </div>

        {/* Mobile navigation buttons */}
        <div className="mt-4 flex justify-center gap-3 md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            className="rounded-xl border border-[#E8E2D6] px-6 py-2.5 text-sm text-[var(--warm-black)] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            ← Previous
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            className="rounded-xl border border-[#E8E2D6] px-6 py-2.5 text-sm text-[var(--warm-black)] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            Next →
          </motion.button>
        </div>

        {/* View all link */}
        <ScrollReveal delay={0.3}>
          <div className="mt-8 text-center">
            <motion.a
              href="#all-products"
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-2 text-[var(--gold-medium)] hover:text-[var(--gold-dark)] transition-colors group"
            >
              <span>View all products</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
