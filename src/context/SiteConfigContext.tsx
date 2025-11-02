import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface ProductConfig {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

interface HeroConfig {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface SiteConfig {
  hero: HeroConfig;
  products: ProductConfig[];
}

interface SiteConfigContextValue {
  config: SiteConfig;
  updateHero: (updates: Partial<HeroConfig>) => void;
  updateProduct: (id: string, updates: Partial<ProductConfig>) => void;
  addProduct: () => void;
  removeProduct: (id: string) => void;
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const initialConfig: SiteConfig = {
  hero: {
    imageUrl:
      'https://images.unsplash.com/photo-1728910156510-77488f19b152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMGZvb2R8ZW58MXx8fHwxNzYxOTE2MDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Balaji Ghee',
    subtitle: 'Sacred tradition, liquid gold. Crafted with devotion, blessed by heritage.',
  },
  products: [
    {
      id: generateId(),
      imageUrl:
        'https://images.unsplash.com/photo-1603596310730-360fede58035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGVlJTIwYnV0dGVyJTIwZ29sZHxlbnwxfHx8fDE3NjE5ODczNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'A2 Desi Ghee',
      description: 'Pure A2 cow ghee made from indigenous breeds using traditional bilona method',
      price: '₹1,499',
    },
    {
      id: generateId(),
      imageUrl:
        'https://images.unsplash.com/photo-1717438647017-15f7736d1cb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1aWQlMjBnb2xkJTIwaG9uZXl8ZW58MXx8fHwxNzYxOTg3MzczfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Golden Heritage',
      description: 'Premium ghee infused with traditional herbs for enhanced wellness benefits',
      price: '₹1,799',
    },
    {
      id: generateId(),
      imageUrl:
        'https://images.unsplash.com/photo-1752134594016-f4969838b68d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbHV4dXJ5JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjE5ODczNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Royal Collection',
      description: 'Artisanal ghee prepared in small batches for exceptional quality and taste',
      price: '₹2,199',
    },
  ],
};

const SiteConfigContext = createContext<SiteConfigContextValue | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);

  const updateHero = (updates: Partial<HeroConfig>) => {
    setConfig((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...updates,
      },
    }));
  };

  const updateProduct = (id: string, updates: Partial<ProductConfig>) => {
    setConfig((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updates,
            }
          : product
      ),
    }));
  };

  const addProduct = () => {
    const newProduct: ProductConfig = {
      id: generateId(),
      title: 'New Product',
      description: 'Describe this premium product',
      price: '₹0',
      imageUrl:
        'https://images.unsplash.com/photo-1601000938259-9f2381217746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    };

    setConfig((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
  };

  const removeProduct = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }));
  };

  const value = useMemo<SiteConfigContextValue>(
    () => ({ config, updateHero, updateProduct, addProduct, removeProduct }),
    [config]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): SiteConfigContextValue {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }

  return context;
}
