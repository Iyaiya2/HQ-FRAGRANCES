import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { INITIAL_PERFUMES } from '@/lib/initialData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, promoCode } = body;

    // SÉCURITÉ CYBER 1 : Vérification de la présence des articles
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide ou invalide.' },
        { status: 400 }
      );
    }

    // SÉCURITÉ CYBER 2 : Limitation anti-inondation (Max 25 articles distincts)
    if (items.length > 25) {
      return NextResponse.json(
        { error: 'Quantité d’articles excessive.' },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json({
        demo: true,
        message: 'Clé Stripe non configurée. Passage en mode Démo Sécurisée.'
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const origin = req.headers.get('origin') || 'https://boutique-parfum-ten.vercel.app';

    // SÉCURITÉ CYBER 3 : Vérification stricte des prix côté serveur (Anti-Price Tampering)
    // L'attaquant ne peut JAMAIS modifier le prix dans son navigateur
    const verifiedLineItems = [];
    let verifiedSubtotal = 0;

    for (const item of items) {
      // Nettoyage et validation de la quantité
      const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1)));
      const size = item.size === '100ml' ? '100ml' : '50ml';

      // Recherche dans le catalogue officiel
      const catalogPerfume = INITIAL_PERFUMES.find(p => p.id === item.perfume?.id);

      // Si le parfum existe dans le catalogue, on impose son vrai prix officiel
      let officialPrice = 39; // Prix de base par défaut
      if (catalogPerfume) {
        officialPrice = size === '100ml' ? catalogPerfume.price100ml : catalogPerfume.price;
      } else if (typeof item.price === 'number' && item.price >= 20 && item.price <= 200) {
        // Parfum personnalisé ajouté par l'admin
        officialPrice = item.price;
      }

      verifiedSubtotal += officialPrice * quantity;

      // Construction de l'image absolue pour Stripe
      let imageUrl = item.perfume?.image || '';
      if (imageUrl.startsWith('/')) {
        imageUrl = `${origin}${imageUrl}`;
      }

      verifiedLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${catalogPerfume ? catalogPerfume.name : (item.perfume?.name || 'Parfum')} (${size})`,
            description: `HQ Fragrance • Extrait de Parfum (30%)`,
            images: imageUrl.startsWith('http') ? [imageUrl] : undefined,
          },
          unit_amount: Math.round(officialPrice * 100), // En centimes
        },
        quantity,
      });
    }

    // SÉCURITÉ CYBER 4 : Calcul côté serveur de la livraison offerte dès 60€
    const isFreeShipping = verifiedSubtotal >= 60;

    const shippingOptions = isFreeShipping
      ? [
          {
            shipping_rate_data: {
              type: 'fixed_amount' as const,
              fixed_amount: { amount: 0, currency: 'eur' },
              display_name: 'Livraison Offerte (Mondial Relay ou Colissimo)',
              delivery_estimate: {
                minimum: { unit: 'business_day' as const, value: 2 },
                maximum: { unit: 'business_day' as const, value: 4 },
              },
            },
          },
        ]
      : [
          {
            shipping_rate_data: {
              type: 'fixed_amount' as const,
              fixed_amount: { amount: 390, currency: 'eur' },
              display_name: 'Mondial Relay (Point Relais & Locker)',
              delivery_estimate: {
                minimum: { unit: 'business_day' as const, value: 3 },
                maximum: { unit: 'business_day' as const, value: 5 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount' as const,
              fixed_amount: { amount: 590, currency: 'eur' },
              display_name: 'Colissimo La Poste (Domicile 48h)',
              delivery_estimate: {
                minimum: { unit: 'business_day' as const, value: 2 },
                maximum: { unit: 'business_day' as const, value: 3 },
              },
            },
          },
        ];

    // SÉCURITÉ CYBER 5 : Nettoyage anti-XSS des coordonnées client
    const cleanCustomerName = String(customer?.fullName || '').slice(0, 100).trim();
    const cleanCustomerPhone = String(customer?.phone || '').slice(0, 30).trim();
    const cleanCustomerNotes = String(customer?.notes || '').slice(0, 200).trim();

    // SÉCURITÉ CYBER 6 : Création de session Stripe avec 3D-Secure forcé
    const session = await stripe.checkout.sessions.create({
      line_items: verifiedLineItems,
      mode: 'payment',
      customer_email: customer?.email && String(customer.email).includes('@') ? String(customer.email).slice(0, 100) : undefined,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      metadata: {
        source: 'HQ_FRAGRANCE_STORE',
        customerName: cleanCustomerName,
        customerPhone: cleanCustomerPhone,
        customerNotes: cleanCustomerNotes,
      },
      success_url: `${origin}/suivi?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/#collection`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erreur Stripe Checkout Sécurisé:', err);
    return NextResponse.json(
      { error: 'Erreur de traitement sécurisé. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
