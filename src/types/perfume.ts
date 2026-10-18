export type OlfactoryFamily = 'Boisé' | 'Ambré' | 'Gourmand' | 'Floral' | 'Frais' | 'Cuiré';
export type Category = 'Homme' | 'Femme' | 'Unisexe';

export interface Perfume {
  id: string;
  name: string;
  brand: string; // ex: "Collection Privée" ou "Inspiration Grand Cru"
  inspiration?: string; // ex: "Ombre Nomade"
  category: Category;
  family: OlfactoryFamily;
  price: number; // 50ml
  price100ml: number; // 100ml
  concentration: string; // ex: "Extrait de Parfum (30%)"
  description: string;
  notes: {
    top: string[]; // Notes de tête
    heart: string[]; // Notes de cœur
    base: string[]; // Notes de fond
  };
  image: string;
  stock: number;
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
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  paymentStatus: 'paye' | 'en_attente';
  paymentMethod: 'stripe_card' | 'apple_pay' | 'google_pay';
}
