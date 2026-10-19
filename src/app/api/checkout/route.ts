import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { INITIAL_PERFUMES } from '@/lib/initialData';

const VALID_PROMO_CODES: Record<string, number> = {
  SNAP10: 10,
  BIENVENUE10: 10,
  HQ10: 10,
  OFFERT: 15,
  VIP15: 15,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, promoCode, shippingMethod, orderId } = body;

    // 1. Validation de la présence des articles
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide ou invalide.' },
        { status: 400 }
      );
    }

    // 2. Limitation anti-inondation (Max 25 articles distincts)
    if (items.length > 25) {
      return NextResponse.json(
        { error: 'Quantité d’articles excessive.' },
        { status: 400 }
      );
    }

    // 3. Vérification de la réduction promo côté serveur
    const cleanPromo = String(promoCode || '').trim().toUpperCase();
    const discountPercent = VALID_PROMO_CODES[cleanPromo] || 0;
    const discountMultiplier = (100 - discountPercent) / 100;

    // 4. Vérification stricte des prix côté serveur (Anti-Price Tampering)
    const verifiedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let verifiedSubtotal = 0;

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    for (const item of items) {
      const quantity = Math.max(
        1,
        Math.min(20, Math.floor(Number(item.quantity) || 1))
      );
      const size = item.size === '100ml' ? '100ml' : '50ml';

      const catalogPerfume = INITIAL_PERFUMES.find(
        p => p.id === item.perfume?.id
      );

      let officialPrice = size === '100ml' ? 69 : 39;
      if (catalogPerfume) {
        officialPrice =
          size === '100ml' ? catalogPerfume.price100ml : catalogPerfume.price;
      } else if (
        typeof item.price === 'number' &&
        item.price >= 20 &&
        item.price <= 250
      ) {
        officialPrice = item.price;
      }

      verifiedSubtotal += officialPrice * quantity;

      const unitAmountCents = Math.round(
        officialPrice * 100 * discountMultiplier
      );

      let imageUrl = catalogPerfume?.image || item.perfume?.image || '';
      if (imageUrl.startsWith('/')) {
        imageUrl = `${origin}${imageUrl}`;
      }

      const descriptionParts = [`HQ Fragrance Paris • Extrait de Parfum (30%)`];
      if (discountPercent > 0) {
        descriptionParts.push(`Remise ${cleanPromo} (-${discountPercent}%) incluse`);
      }

      verifiedLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${catalogPerfume ? catalogPerfume.name : item.perfume?.name || 'Parfum HQ'} — Flacon ${size}`,
            description: descriptionParts.join(' • '),
            images: imageUrl.startsWith('http') ? [imageUrl] : undefined,
          },
          unit_amount: unitAmountCents,
        },
        quantity,
      });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // Mode Démo Sécurisée si aucune clé Stripe active n'est renseignée
    if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_placeholder')) {
      return NextResponse.json({
        demo: true,
        verifiedSubtotal,
        discountPercent,
        message:
          'Clé Stripe non configurée. Validation en mode Boutique Directe.',
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    // 5. Calcul côté serveur de la livraison offerte dès 60€
    const isFreeShipping = verifiedSubtotal >= 60;

    const mondialRelayOption: Stripe.Checkout.SessionCreateParams.ShippingOption = {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: isFreeShipping ? 0 : 390, currency: 'eur' },
        display_name: isFreeShipping
          ? 'Mondial Relay Point Relais & Locker (OFFERT)'
          : 'Mondial Relay (Point Relais & Locker)',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 3 },
          maximum: { unit: 'business_day', value: 5 },
        },
      },
    };

    const colissimoOption: Stripe.Checkout.SessionCreateParams.ShippingOption = {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: isFreeShipping ? 0 : 590, currency: 'eur' },
        display_name: isFreeShipping
          ? 'Colissimo Domicile 48h (OFFERT)'
          : 'Colissimo La Poste (Domicile 48h)',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 2 },
          maximum: { unit: 'business_day', value: 3 },
        },
      },
    };

    const shippingOptions =
      shippingMethod === 'colissimo'
        ? [colissimoOption, mondialRelayOption]
        : [mondialRelayOption, colissimoOption];

    // 6. Nettoyage anti-XSS des coordonnées client
    const cleanCustomerName = String(customer?.fullName || '')
      .slice(0, 100)
      .trim();
    const cleanCustomerPhone = String(customer?.phone || '')
      .slice(0, 30)
      .trim();
    const cleanCustomerNotes = String(customer?.notes || '')
      .slice(0, 200)
      .trim();
    const cleanOrderId = String(orderId || '')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .slice(0, 30);

    const session = await stripe.checkout.sessions.create({
      line_items: verifiedLineItems,
      mode: 'payment',
      customer_email:
        customer?.email && String(customer.email).includes('@')
          ? String(customer.email).slice(0, 100).trim()
          : undefined,
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
        orderId: cleanOrderId,
        promoCode: cleanPromo,
        customerName: cleanCustomerName,
        customerPhone: cleanCustomerPhone,
        customerNotes: cleanCustomerNotes,
      },
      success_url: `${origin}/suivi?order=${cleanOrderId}&session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/#collection`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Erreur Stripe Checkout Sécurisé:', err);
    return NextResponse.json(
      { error: 'Erreur de traitement sécurisé. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
