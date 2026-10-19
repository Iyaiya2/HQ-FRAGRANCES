'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { addStoredOrder } from '@/lib/store';
import { Order } from '@/types/perfume';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  User,
} from 'lucide-react';
import Link from 'next/link';

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
    setIsOpen,
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [relayNotes, setRelayNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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
        }),
      });

      const data = await res.json();

      if (!res.ok && data.error) {
        setIsLoading(false);
        setFormError(data.error);
        return;
      }

      // Save order locally so both /suivi and /admin have it immediately
      addStoredOrder(newOrder);

      // If real Stripe session URL is returned, redirect to Stripe Checkout
      if (data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      }

      // Demo / Direct Boutique confirmation
      setCompletedOrder(newOrder);
      clearCart();
      setIsLoading(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch {
      setIsLoading(false);
      setFormError('Erreur de traitement du paiement. Veuillez réessayer.');
    }
  };

  const handleCloseAll = () => {
    const wasCompleted = Boolean(completedOrder);
    setCompletedOrder(null);
    onClose();
    if (wasCompleted) {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={handleCloseAll} />

      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#0c0c10] border border-amber-500/30 rounded-3xl shadow-2xl z-10 p-6 sm:p-8">
        <button
          type="button"
          onClick={handleCloseAll}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">
              Commande Validée • Maison HQ Fragrance
            </span>

            <h2 className="font-serif text-3xl text-white font-normal mt-1 mb-2">
              Merci pour votre confiance !
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 mb-6">
              Votre commande{' '}
              <strong className="text-amber-300 font-mono font-bold">
                #{completedOrder.id}
              </strong>{' '}
              est confirmée. Vos flacons sont en cours de préparation dans notre atelier.
            </p>

            <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 text-left mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Destinataire :</span>
                <span className="font-bold text-white">
                  {completedOrder.customer.fullName}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Mode d&apos;expédition :</span>
                <span className="text-amber-300 font-semibold">
                  {completedOrder.shippingMethod === 'mondial_relay'
                    ? 'Mondial Relay (Point Relais / Locker)'
                    : 'Colissimo La Poste (Domicile 48h)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Adresse :</span>
                <span className="text-white text-right">
                  {completedOrder.customer.address},{' '}
                  {completedOrder.customer.postalCode}{' '}
                  {completedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span className="text-zinc-300">Total réglé :</span>
                <span className="text-amber-300 font-serif text-xl">
                  {completedOrder.total.toFixed(2)} €
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/suivi?order=${completedOrder.id}`}
                onClick={handleCloseAll}
                className="w-full py-3.5 px-4 rounded-xl gold-shimmer-bg hover:brightness-110 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Suivre ma commande #{completedOrder.id}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        ) : (
          /* Secure Checkout Form */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Paiement Chiffré SSL 256-Bit
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1">
              Finaliser votre commande
            </h2>

            <p className="text-xs text-zinc-400 mb-6">
              Total TTC :{' '}
              <strong className="text-amber-300 font-serif text-lg">
                {total.toFixed(2)} €
              </strong>{' '}
              ({cart.reduce((s, i) => s + i.quantity, 0)} flacon
              {cart.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''})
            </p>

            {formError && (
              <div className="bg-red-950/70 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  1. Vos Coordonnées
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
                      Nom &amp; Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Karim Mansouri"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
                      Téléphone (Suivi SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] text-zinc-300 block mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  2. Adresse d&apos;Expédition
                </h3>

                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">
                    Adresse complète (N° et Rue) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="15 Rue de la Paix"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
                      Code Postal *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="75001"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paris"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>

                {shippingMethod === 'mondial_relay' && (
                  <div className="mt-3">
                    <label className="text-[11px] text-amber-300 block mb-1">
                      Point Relais ou Locker Mondial Relay souhaité (facultatif)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Locker InPost / Mondial Relay Gare ou Commerce proche"
                      value={relayNotes}
                      onChange={e => setRelayNotes(e.target.value)}
                      className="w-full bg-zinc-950 border border-amber-500/30 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  3. Mode de Livraison
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      shippingMethod === 'mondial_relay'
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'mondial_relay'}
                        onChange={() => setShippingMethod('mondial_relay')}
                        className="accent-amber-400"
                      />
                      <div>
                        <div className="font-bold text-xs text-zinc-100">
                          Mondial Relay
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Point Relais &amp; Locker (3-5j)
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-amber-300 font-mono">
                      {subtotal >= 60 ? 'OFFERT' : '3.90 €'}
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      shippingMethod === 'colissimo'
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'colissimo'}
                        onChange={() => setShippingMethod('colissimo')}
                        className="accent-amber-400"
                      />
                      <div>
                        <div className="font-bold text-xs text-zinc-100">
                          Colissimo 48h
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Livraison à domicile
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-amber-300 font-mono">
                      {subtotal >= 60 ? 'OFFERT' : '5.90 €'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Payment Gateway Info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    4. Règlement Sécurisé
                  </span>
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Stripe 3D-Secure
                  </span>
                </h3>

                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-zinc-950/90 space-y-2">
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                    Validation instantanée par <strong>Apple Pay</strong>,{' '}
                    <strong>Google Pay</strong>, <strong>Carte Bancaire</strong>{' '}
                    ou <strong>Klarna 3x sans frais</strong>.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] bg-zinc-900 text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
                      Apple Pay
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
                      Google Pay
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
                      Visa / Mastercard
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
                      Klarna 3x
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl gold-shimmer-bg hover:brightness-110 text-zinc-950 font-bold text-xs sm:text-sm tracking-[0.14em] uppercase shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Validation sécurisée en cours...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirmer &amp; Payer • {total.toFixed(2)} €</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
