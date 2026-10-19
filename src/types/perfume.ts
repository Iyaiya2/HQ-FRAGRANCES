export type OlfactoryFamily = 'Boisé' | 'Ambré' | 'Gourmand' | 'Fruité' | 'Frais' | 'Cuiré' | 'Floral';
export type Category = 'Homme' | 'Femme' | 'Unisexe';

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  inspiration?: string;
  category: Category;
  family: OlfactoryFamily;
  price: number; // 50ml
  price100ml: number; // 100ml
  originalPrice?: number; // Compare-at 50ml
  originalPrice100ml?: number; // Compare-at 100ml
  concentration: string;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  image: string;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  longevity?: string;
  sillage?: string;
  badge?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  featured?: boolean;
}

export interface CartItem {
  perfume: Perfume;
  size: '50ml' | '100ml';
  quantity: number;
  price: number;
}

export type ShippingMethod = 'mondial_relay' | 'colissimo' | 'remise_mains_propres';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  notes?: string;
}

export type OrderStatus = 'a_preparer' | 'expedie' | 'livre';

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  shippingMethod: ShippingMethod;
  shippingFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  paymentStatus: 'paye' | 'en_attente';
  paymentMethod: 'stripe_card' | 'apple_pay' | 'google_pay';
}
