'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { addStoredOrder } from '@/lib/store';
import { Order } from '@/types/perfume';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  MapPin,
  User,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const {
    cart,
    total,
    subtotal,
    shippingFee,
    shippingMethod,
    setShippingMethod,
    discountAmount,
    promoCode,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [relayNotes, setRelayNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [needsStripeKey, setNeedsStripeKey] = useState(false);
  const [stripeKeyInput, setStripeKeyInput] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !postalCode.trim() ||
      !city.trim()
    ) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsLoading(true);
    const orderId = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
        country: 'France',
        notes: relayNotes.trim() || undefined,
      },
      items: [...cart],
      subtotal,
      shippingMethod,
      shippingFee,
      discount: discountAmount,
      promoCode: promoCode || undefined,
      total,
      status: 'a_preparer',
      paymentStatus: 'paye',
      paymentMethod: 'stripe_card',
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          items: cart,
          customer: newOrder.customer,
          promoCode,
          shippingMethod,
          stripeKeyOverride: stripeKeyInput.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        if (data.code === 'STRIPE_KEY_MISSING') {
          setNeedsStripeKey(true);
        }
        setFormError(
          data.error || 'Impossible de créer la session de paiement Stripe.'
        );
        return;
      }

      // Redirection OBLIGATOIRE vers la vraie page Stripe Checkout (checkout.stripe.com)
      if (data.url) {
        addStoredOrder(newOrder);
        clearCart();
        window.location.href = data.url;
        return;
      }

      setIsLoading(false);
      setFormError(
        'Aucune URL de paiement Stripe retournée. Vérifiez votre clé STRIPE_SECRET_KEY.'
      );
    } catch {
      setIsLoading(false);
      setFormError('Erreur de connexion à Stripe. Veuillez réessayer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[92dvh] overflow-y-auto bg-white border border-zinc-200 rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 p-5 sm:p-8 text-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-semibold">
              Redirection Officielle Stripe Checkout
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl text-zinc-950 font-bold mb-1">
            Finaliser votre commande
          </h2>

          <p className="text-xs text-zinc-500 mb-5">
            Total à régler sur Stripe :{' '}
            <strong className="text-zinc-950 font-serif text-lg">
              {total.toFixed(2)} €
            </strong>{' '}
            ({cart.reduce((s, i) => s + i.quantity, 0)} flacon
            {cart.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''})
          </p>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-900 text-xs p-3.5 rounded-xl mb-4 space-y-2">
              <p className="font-semibold">{formError}</p>
              {needsStripeKey && (
                <div className="pt-2 border-t border-red-200 space-y-2">
                  <label className="text-[11px] text-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <KeyRound className="w-3.5 h-3.5 text-zinc-950" />
                      Collez votre clé secrète Stripe (sk_test_... ou sk_live_...) :
                    </span>
                    <a
                      href="https://dashboard.stripe.com/apikeys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-950 underline inline-flex items-center gap-1 hover:text-zinc-600 font-semibold"
                    >
                      Ouvrir Stripe <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="password"
                    placeholder="sk_test_... ou sk_live_..."
                    value={stripeKeyInput}
                    onChange={e => setStripeKeyInput(e.target.value)}
                    className="w-full bg-white border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-zinc-600">
                    La clé sera enregistrée automatiquement dans votre fichier{' '}
                    <code className="text-zinc-900 font-mono font-semibold">.env.local</code> et vous serez redirigé vers Stripe.
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            {/* Customer Info */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                1. Vos Coordonnées
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-600 block mb-1">
                    Nom &amp; Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Karim Mansouri"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-600 block mb-1">
                    Téléphone (Suivi SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-[11px] text-zinc-600 block mb-1">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre@email.fr"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                2. Adresse d&apos;Expédition
              </h3>

              <div>
                <label className="text-[11px] text-zinc-600 block mb-1">
                  Adresse complète (N° et Rue) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="15 Rue de la Paix"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-[11px] text-zinc-600 block mb-1">
                    Code Postal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="75001"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-600 block mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Paris"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              {shippingMethod === 'mondial_relay' && (
                <div className="mt-3">
                  <label className="text-[11px] text-zinc-600 block mb-1">
                    Point Relais ou Locker Mondial Relay souhaité (facultatif)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Locker InPost / Mondial Relay proche"
                    value={relayNotes}
                    onChange={e => setRelayNotes(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-zinc-300 focus:border-zinc-950 rounded-xl px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                3. Mode de Livraison
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === 'mondial_relay'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-[#faf9f6] text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'mondial_relay'}
                      onChange={() => setShippingMethod('mondial_relay')}
                      className="accent-zinc-950"
                    />
                    <div>
                      <div className="font-semibold text-xs">
                        Mondial Relay
                      </div>
                      <div
                        className={`text-[10px] ${
                          shippingMethod === 'mondial_relay'
                            ? 'text-zinc-300'
                            : 'text-zinc-500'
                        }`}
                      >
                        Point Relais &amp; Locker (3-5j)
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-xs font-mono">
                    {subtotal >= 60 ? 'OFFERT' : '3.90 €'}
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === 'colissimo'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-[#faf9f6] text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'colissimo'}
                      onChange={() => setShippingMethod('colissimo')}
                      className="accent-zinc-950"
                    />
                    <div>
                      <div className="font-semibold text-xs">
                        Colissimo 48h
                      </div>
                      <div
                        className={`text-[10px] ${
                          shippingMethod === 'colissimo'
                            ? 'text-zinc-300'
                            : 'text-zinc-500'
                        }`}
                      >
                        Livraison à domicile
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-xs font-mono">
                    {subtotal >= 60 ? 'OFFERT' : '5.90 €'}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Gateway Info */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  4. Paiement sur Stripe
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 3D-Secure
                </span>
              </h3>

              <div className="p-3.5 rounded-2xl border border-zinc-200 bg-[#faf9f6] flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] bg-white text-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 font-medium">
                  Apple Pay
                </span>
                <span className="text-[10px] bg-white text-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 font-medium">
                  Google Pay
                </span>
                <span className="text-[10px] bg-white text-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 font-medium">
                  Carte Bancaire
                </span>
                <span className="text-[10px] bg-white text-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 font-medium">
                  Klarna 3x
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Redirection vers Stripe...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Payer sur Stripe • {total.toFixed(2)} €</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
