import { Perfume, Order } from '@/types/perfume';

export const INITIAL_PERFUMES: Perfume[] = [
  {
    id: 'perfume-1',
    name: 'Oud Mystique',
    brand: 'Édition Prestige',
    inspiration: 'Inspiration Ombre Nomade',
    category: 'Unisexe',
    family: 'Boisé',
    price: 45,
    price100ml: 75,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Une création envoûtante et ténébreuse où se rencontrent l’oud le plus pur, la framboise charnelle et la rose de mai fumée.',
    notes: {
      top: ['Framboise sauvage', 'Safran d’Iran'],
      heart: ['Rose de Damas', 'Encens sacré'],
      base: ['Bois de Oud d’Assam', 'Ambre gris', 'Cuir vieilli']
    },
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    stock: 14,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'perfume-2',
    name: 'Rouge Sublime',
    brand: 'Édition Prestige',
    inspiration: 'Inspiration Baccarat Rouge 540',
    category: 'Unisexe',
    family: 'Ambré',
    price: 49,
    price100ml: 79,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Le sillage signature par excellence. Un accord minéral et sucré d’une élégance rare qui laisse une traînée inoubliable sur votre passage.',
    notes: {
      top: ['Jasmin Grandiflorum', 'Safran doux'],
      heart: ['Amande amère', 'Bois de cèdre'],
      base: ['Ambre gris minéral', 'Accord boisé musqué']
    },
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    stock: 22,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'perfume-3',
    name: 'Bois Sacré',
    brand: 'Collection Privée',
    inspiration: 'Inspiration Bois d’Argent',
    category: 'Unisexe',
    family: 'Boisé',
    price: 45,
    price100ml: 75,
    concentration: 'Extrait de Parfum (30%)',
    description: 'L’union intemporelle de l’iris noble et de l’encens poudré. Une caresse vaporeuse et raffinée qui s’associe à votre peau avec distinction.',
    notes: {
      top: ['Cyprès d’Italie', 'Iris de Florence'],
      heart: ['Myrrhe d’Orient', 'Patchouli'],
      base: ['Miel chaud', 'Cuir velours', 'Vanille Bourbon']
    },
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    stock: 8,
    isBestSeller: false,
    featured: true
  },
  {
    id: 'perfume-4',
    name: 'Vanille Noire',
    brand: 'Édition Prestige',
    inspiration: 'Inspiration Vanille Fatale',
    category: 'Femme',
    family: 'Gourmand',
    price: 45,
    price100ml: 75,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Une vanille sombre, mature et séductrice sublimée par des volutes de café grillé, de rhum ambré et de tabac doux.',
    notes: {
      top: ['Coriandre', 'Myrrhe', 'Rhum vieilli'],
      heart: ['Café torréfié', 'Narcisse', 'Frangipanier'],
      base: ['Vanille de Madagascar', 'Fève Tonka', 'Suède']
    },
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    stock: 19,
    isBestSeller: true,
    isNew: true
  },
  {
    id: 'perfume-5',
    name: 'Gris Majestueux',
    brand: 'Collection Privée',
    inspiration: 'Inspiration Gris Montaigne',
    category: 'Unisexe',
    family: 'Floral',
    price: 45,
    price100ml: 75,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Un chypré moderne éclatant alliant la fraîcheur zestée de la bergamote et l’opulence de la rose turque sur un lit de mousse boisée.',
    notes: {
      top: ['Bergamote de Calabre', 'Pamplemousse'],
      heart: ['Rose de Grasse', 'Jasmin Sambac'],
      base: ['Patchouli', 'Mousse de chêne', 'Ambrette']
    },
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    stock: 12,
    isBestSeller: false
  },
  {
    id: 'perfume-6',
    name: 'Santal Impérial',
    brand: 'Édition Prestige',
    inspiration: 'Inspiration Santal 33',
    category: 'Homme',
    family: 'Cuiré',
    price: 45,
    price100ml: 75,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Un parfum d’esprit libre, boisé, fumé et cuiré. Il évoque l’air chaud des grands espaces et le réconfort du feu de camp.',
    notes: {
      top: ['Cardamome', 'Iris de Toscane'],
      heart: ['Papyrus d’Égypte', 'Violette douce'],
      base: ['Santal d’Australie', 'Bois de cèdre', 'Cuir chaud']
    },
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    stock: 5,
    isBestSeller: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CMD-9841',
    createdAt: '2026-10-18T10:15:00.000Z',
    customer: {
      fullName: 'Yassine Belkacem',
      email: 'yassine.b@gmail.com',
      phone: '06 42 18 90 23',
      address: '28 Rue des Alouettes',
      postalCode: '69008',
      city: 'Lyon',
      country: 'France',
      notes: 'Locker Mondial Relay Station Total'
    },
    items: [
      {
        perfume: INITIAL_PERFUMES[0],
        size: '50ml',
        quantity: 1,
        price: 45
      }
    ],
    subtotal: 45,
    shippingMethod: 'mondial_relay',
    shippingFee: 3.90,
    discount: 0,
    total: 48.90,
    status: 'a_preparer',
    paymentStatus: 'paye',
    paymentMethod: 'apple_pay'
  },
  {
    id: 'CMD-9840',
    createdAt: '2026-10-18T08:00:00.000Z',
    customer: {
      fullName: 'Sophie Morel',
      email: 'sophie.morel@hotmail.fr',
      phone: '07 88 12 34 56',
      address: '15 Avenue Foch, Bâtiment B',
      postalCode: '75116',
      city: 'Paris',
      country: 'France'
    },
    items: [
      {
        perfume: INITIAL_PERFUMES[1],
        size: '100ml',
        quantity: 1,
        price: 79
      },
      {
        perfume: INITIAL_PERFUMES[3],
        size: '50ml',
        quantity: 1,
        price: 45
      }
    ],
    subtotal: 124,
    shippingMethod: 'colissimo',
    shippingFee: 0, // Gratuit dès 60€
    discount: 10, // Code promo SNAP10
    total: 114,
    status: 'expedie',
    trackingNumber: '8R2948104829FR',
    paymentStatus: 'paye',
    paymentMethod: 'stripe_card'
  }
];
