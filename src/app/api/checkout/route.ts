import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, promoCode } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // Si Stripe n'est pas encore configuré (mode démonstration / test)
    if (!stripeSecretKey) {
      return NextResponse.json({
        demo: true,
        message: 'Clé Stripe non configurée. Passage en mode Démo Sécurisée.'
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    // Calcul du sous-total
    const subtotal = items.reduce((acc: number, it: any) => acc + (it.price * it.quantity), 0);
    const isFreeShipping = subtotal >= 60;

    // Construire les line items pour Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.perfume.name} (${item.size})`,
          description: `${item.perfume.concentration} • ${item.perfume.inspiration || item.perfume.family}`,
          images: [item.perfume.image],
        },
        unit_amount: Math.round(item.price * 100), // en centimes
      },
      quantity: item.quantity,
    }));

    // Options de livraison
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

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Création de la session Stripe Checkout avec TOUS les moyens de paiement activés
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer?.email || undefined,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      shipping_options: shippingOptions,
      allow_promotion_codes: true,
      metadata: {
        customerName: customer?.fullName || '',
        customerPhone: customer?.phone || '',
        customerNotes: customer?.notes || '',
      },
      success_url: `${origin}/suivi?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/#collection`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erreur Stripe Checkout:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la création de la session Stripe' },
      { status: 500 }
    );
  }
}
