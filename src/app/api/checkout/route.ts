import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { INITIAL_PERFUMES } from '@/lib/initialData';

const VALID_PROMO_CODES: Record<string, number> = {
  SNAP10: 10,
  BIENVENUE10: 10,
  HQ10: 10,
  OFFERT: 15,
  VIP15: 15,
};

function resolveStripeSecretKey(providedKey?: string): string {
  if (providedKey && providedKey.trim().startsWith('sk_')) {
    return providedKey.trim();
  }

  const envKey =
    process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '';
  const cleanedEnv = envKey.replace(/^["']|["']$/g, '').trim();
  if (cleanedEnv.startsWith('sk_') && !cleanedEnv.startsWith('sk_test_placeholder')) {
    return cleanedEnv;
  }

  // Lecture directe de .env.local ou .env à chaud (sans besoin de redémarrer le serveur)
  for (const fileName of ['.env.local', '.env']) {
    try {
      const envPath = path.join(process.cwd(), fileName);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/^\s*STRIPE_SECRET_KEY\s*=\s*(.+)\s*$/m);
        if (match && match[1]) {
          const fileKey = match[1].replace(/^["']|["']$/g, '').trim();
          if (
            fileKey.startsWith('sk_') &&
            !fileKey.startsWith('sk_test_placeholder') &&
            !fileKey.startsWith('sk_test_votre')
          ) {
            return fileKey;
          }
        }
      }
    } catch {
      // ignore fs read errors
    }
  }

  return '';
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const cleanKey = String(body.stripeSecretKey || '')
      .replace(/^["']|["']$/g, '')
      .trim();

    if (!cleanKey.startsWith('sk_')) {
      return NextResponse.json(
        {
          error:
            'Clé invalide. Une clé secrète Stripe commence par "sk_test_" ou "sk_live_".',
        },
        { status: 400 }
      );
    }

    // Vérifier que la clé fonctionne auprès de Stripe avant de l'enregistrer
    const stripe = new Stripe(cleanKey);
    await stripe.balance.retrieve();

    // Enregistrer dans .env.local pour persister la clé
    const envPath = path.join(process.cwd(), '.env.local');
    let existing = '';
    if (fs.existsSync(envPath)) {
      existing = fs.readFileSync(envPath, 'utf8');
    }

    if (/^\s*STRIPE_SECRET_KEY\s*=/m.test(existing)) {
      existing = existing.replace(
        /^\s*STRIPE_SECRET_KEY\s*=.*$/m,
        `STRIPE_SECRET_KEY=${cleanKey}`
      );
    } else {
      existing = `${existing.trim()}\nSTRIPE_SECRET_KEY=${cleanKey}\n`.trimStart();
    }

    fs.writeFileSync(envPath, existing, 'utf8');
    process.env.STRIPE_SECRET_KEY = cleanKey;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : 'Clé Stripe refusée par Stripe.';
    return NextResponse.json(
      { error: `Clé Stripe invalide : ${msg}` },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, promoCode, shippingMethod, orderId, stripeKeyOverride } =
      body;

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

    const stripeSecretKey = resolveStripeSecretKey(stripeKeyOverride);

    // Si l'utilisateur vient de fournir sa clé dans le champ d'activation rapide, on la sauvegarde dans .env.local
    if (stripeKeyOverride && stripeSecretKey) {
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        fs.writeFileSync(envPath, `STRIPE_SECRET_KEY=${stripeSecretKey}\n`, 'utf8');
        process.env.STRIPE_SECRET_KEY = stripeSecretKey;
      } catch {
        // ignore write error on read-only fs
      }
    }

    // AUCUNE validation sans Stripe : si la clé n'est pas configurée, on bloque et on demande la clé
    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          code: 'STRIPE_KEY_MISSING',
          error:
            'Clé secrète Stripe (sk_test_... ou sk_live_...) requise pour ouvrir la page de paiement Stripe.',
        },
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

      const safeStripeImages =
        imageUrl.startsWith('https://') ? [encodeURI(imageUrl)] : undefined;

      verifiedLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${catalogPerfume ? catalogPerfume.name : item.perfume?.name || 'Parfum HQ'} — Flacon ${size}`,
            description: descriptionParts.join(' • '),
            images: safeStripeImages,
          },
          unit_amount: unitAmountCents,
        },
        quantity,
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
  } catch (err: unknown) {
    console.error('Erreur Stripe Checkout Sécurisé:', err);
    const errMsg =
      err instanceof Error ? err.message : 'Erreur inconnue Stripe';
    return NextResponse.json(
      {
        error: `Erreur Stripe : ${errMsg}`,
      },
      { status: 500 }
    );
  }
}
