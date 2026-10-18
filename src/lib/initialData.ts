import { Perfume, Order } from '@/types/perfume';

export const INITIAL_PERFUMES: Perfume[] = [
  {
    id: 'hq-king-vanille',
    name: 'King Vanille',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Sillage Royal Vanille & Cuir',
    category: 'Homme',
    family: 'Ambré',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Le roi de la vanille masculine. Sombre, épicé et impérial, une fragrance de caractère au sillage captivant qui impose le respect.',
    notes: {
      top: ['Rhum ambré des Antilles', 'Cardamome noire'],
      heart: ['Gousse de Vanille Bourbon', 'Café torréfié', 'Fève Tonka'],
      base: ['Cuir chaud', 'Bois d’ébène', 'Ambre précieux']
    },
    image: '/images/perfumes/king-vanille.png',
    stock: 18,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'hq-ultra-men-intense',
    name: 'Ultra Men Intense',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Masculinité Brute & Puissance',
    category: 'Homme',
    family: 'Cuiré',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'L’essence même de la puissance masculine. Une alliance percutante de lavande sauvage, d’agrumes toniques et d’un cuir ténébreux d’une virilité absolue.',
    notes: {
      top: ['Citron d’Italie', 'Lavande sauvage de Grasse', 'Menthe glaciale'],
      heart: ['Cannelle de Ceylan', 'Cuir noir martelé'],
      base: ['Bois de Cèdre', 'Ambre gris', 'Vanille noire']
    },
    image: '/images/perfumes/ultra-men-intense.png',
    stock: 24,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'hq-mulla-rouge',
    name: 'Mulla Rouge',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Élixir Ambré & Safran Sombre',
    category: 'Homme',
    family: 'Ambré',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Un accord envoûtant et incendiaire. La morsure de la cerise noire liquoreuse sublimée par le safran noble et l’ambre rouge.',
    notes: {
      top: ['Cerise noire liquoreuse', 'Safran d’Orient'],
      heart: ['Amande amère', 'Rose sombre fumée'],
      base: ['Ambre rouge minéral', 'Cuir suédé', 'Fève Tonka grillée']
    },
    image: '/images/perfumes/mulla-rouge.png',
    stock: 15,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'hq-light-bleu-perfect',
    name: 'Light Bleu Perfect',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Fraîcheur Méditerranéenne Intense',
    category: 'Homme',
    family: 'Frais',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'L’élégance tranchante des côtes méditerranéennes. Une fraîcheur givrée de bergamote et de pomme verte ancrée dans des bois nobles ultra-persistants.',
    notes: {
      top: ['Bergamote de Sicile', 'Citron givré', 'Pomme croquante'],
      heart: ['Brise marine iodée', 'Romarin frais', 'Baies de genièvre'],
      base: ['Bois de chêne', 'Muscs blancs intenses', 'Ambre gris']
    },
    image: '/images/perfumes/light-bleu-perfect.png',
    stock: 20,
    isBestSeller: true
  },
  {
    id: 'hq-cookie-caramel',
    name: 'Cookie Caramel',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Gourmandise Masculine Addictive',
    category: 'Homme',
    family: 'Gourmand',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Un accord gourmand ravageur et charismatique. L’arôme chaud du caramel au beurre salé qui fond sur une pâte sablée croustillante.',
    notes: {
      top: ['Caramel au beurre salé', 'Sucre roux de canne'],
      heart: ['Biscuit doré au four', 'Pâte sablée vanillée'],
      base: ['Gousse de vanille crémeuse', 'Bois blonds', 'Fève Tonka']
    },
    image: '/images/perfumes/cookie-caramel.png',
    stock: 12,
    isBestSeller: true
  },
  {
    id: 'hq-creme-brulee',
    name: 'Crème Brûlée',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Sucre Caramélisé & Vanille Pure',
    category: 'Homme',
    family: 'Gourmand',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'La rondeur réconfortante et grillée de la crème brûlée d’exception. Une vanille crémeuse et virile qui captive l’entourage dès la première pulvérisation.',
    notes: {
      top: ['Sucre caramélisé chaud', 'Noisette torréfiée'],
      heart: ['Crème onctueuse', 'Gousse de vanille royale'],
      base: ['Bois de santal blanc', 'Musc velours']
    },
    image: '/images/perfumes/creme-brulee.png',
    stock: 9
  },
  {
    id: 'hq-krypto',
    name: 'Krypto',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Aromatique Métallique & Vétiver',
    category: 'Homme',
    family: 'Boisé',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Un shoot d’adrénaline moderne et mystérieux. Un contraste saisissant entre le pamplemousse givré, le poivre noir et la noblesse du vétiver boisé.',
    notes: {
      top: ['Pamplemousse rose', 'Poivre de Sichuan', 'Note métallique'],
      heart: ['Lavande aromatique', 'Feuille de violette', 'Vétiver d’Haïti'],
      base: ['Bois de Cèdre de l’Atlas', 'Mousse de chêne', 'Ambroxan']
    },
    image: '/images/perfumes/krypto.png',
    stock: 14
  },
  {
    id: 'hq-exotic-mango',
    name: 'Exotic Mango',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Mangue Tropicale & Bois Solaire',
    category: 'Homme',
    family: 'Frais',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Une explosion tropicale intense et solaire. Une mangue mûre juteuse magnifiée par la fraîcheur des baies roses et la force des bois précieux.',
    notes: {
      top: ['Mangue sauvage juteuse', 'Baies roses', 'Zeste de mandarine'],
      heart: ['Fruit de la passion', 'Jasmin nocturne masculin'],
      base: ['Bois de cèdre clair', 'Muscs solaires', 'Ambre chaud']
    },
    image: '/images/perfumes/exotic-mango.png',
    stock: 11
  },
  {
    id: 'hq-kaya-litchi',
    name: 'Kaya Litchi',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Litchi Givré & Ambre Oriental',
    category: 'Homme',
    family: 'Ambré',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'L’intensité fruitée du litchi d’Asie contrastée par un accord boisé-ambré ultra profond. Un sillage atypique qui intrigue et séduit.',
    notes: {
      top: ['Litchi givré', 'Cassis noir acidulé'],
      heart: ['Rose masculine épicée', 'Encens doux'],
      base: ['Ambre gris oriental', 'Patchouli noble', 'Muscs blancs']
    },
    image: '/images/perfumes/kaya-litchi.png',
    stock: 16
  },
  {
    id: 'hq-kaya-marshmallow',
    name: 'Kaya Marshmallow',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Guimauve Poudrée & Bois Doux',
    category: 'Homme',
    family: 'Gourmand',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Une douceur aérienne et poudrée de guimauve infusée de vanille pure, ancrée sur une base masculine boisée et charnelle.',
    notes: {
      top: ['Sucre glace', 'Fleur d’oranger délicate'],
      heart: ['Guimauve fondante', 'Lait d’amande amère'],
      base: ['Vanille bourbon', 'Bois blancs', 'Ambrette douce']
    },
    image: '/images/perfumes/kaya-marshmallow.png',
    stock: 10
  },
  {
    id: 'hq-memory',
    name: 'Memory',
    brand: 'HQ FRAGRANCE',
    inspiration: 'Santal Majestueux & Poire Velours',
    category: 'Homme',
    family: 'Boisé',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: 'Le parfum des souvenirs impérissables. Un départ velouté de poire et de pêche qui laisse place à la rondeur noble du santal d’Australie.',
    notes: {
      top: ['Poire William mûre', 'Pêche veloutée', 'Cardamome'],
      heart: ['Iris de Toscane', 'Bois de rose', 'Noix de muscade'],
      base: ['Bois de Santal crémeux', 'Patchouli sombre', 'Ambre chaud']
    },
    image: '/images/perfumes/memory.png',
    stock: 13
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CMD-8491',
    createdAt: '2026-10-18T10:15:00.000Z',
    customer: {
      fullName: 'Rayane Khelifi',
      email: 'rayane.k@gmail.com',
      phone: '06 58 41 90 22',
      address: '45 Rue de la Victoire',
      postalCode: '75009',
      city: 'Paris',
      country: 'France',
      notes: 'Locker Mondial Relay Gare Saint-Lazare'
    },
    items: [
      {
        perfume: INITIAL_PERFUMES[0], // King Vanille
        size: '50ml',
        quantity: 1,
        price: 39
      }
    ],
    subtotal: 39,
    shippingMethod: 'mondial_relay',
    shippingFee: 3.90,
    discount: 0,
    total: 42.90,
    status: 'a_preparer',
    paymentStatus: 'paye',
    paymentMethod: 'apple_pay'
  },
  {
    id: 'CMD-8490',
    createdAt: '2026-10-18T08:00:00.000Z',
    customer: {
      fullName: 'Marc Fontaine',
      email: 'm.fontaine@outlook.fr',
      phone: '07 62 14 33 88',
      address: '12 Avenue des Belges',
      postalCode: '13100',
      city: 'Aix-en-Provence',
      country: 'France'
    },
    items: [
      {
        perfume: INITIAL_PERFUMES[1], // Ultra Men Intense
        size: '100ml',
        quantity: 1,
        price: 69
      },
      {
        perfume: INITIAL_PERFUMES[4], // Cookie Caramel
        size: '50ml',
        quantity: 1,
        price: 39
      }
    ],
    subtotal: 108,
    shippingMethod: 'colissimo',
    shippingFee: 0, // Offerte dès 60€
    discount: 10.80, // Code promo SNAP10
    total: 97.20,
    status: 'expedie',
    trackingNumber: '8R4819401829FR',
    paymentStatus: 'paye',
    paymentMethod: 'stripe_card'
  }
];
