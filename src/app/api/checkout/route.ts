import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, promoCode } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // Si Stripe n'est pas encore configuré (mode développement / démo)
    if (!stripeSecretKey) {
      return NextResponse.json({
        demo: true,
        message: 'Clé Stripe non configurée. Le site fonctionne en mode Démo Sécurisée.'
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

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

    // Créer la session Stripe Checkout avec collecte d'adresse et options de livraison
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 390, currency: 'eur' },
            display_name: 'Mondial Relay (Point Relais)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 590, currency: 'eur' },
            display_name: 'Colissimo Domicile 48h',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
      success_url: `${origin}/suivi?session_id={CHECKOUT_SESSION_ID}`,
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
