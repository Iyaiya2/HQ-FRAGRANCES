'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { addStoredOrder } from '@/lib/store';
import { Order, ShippingMethod } from '@/types/perfume';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  User
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
    discount,
    promoCode,
    clearCart
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [relayNotes, setRelayNotes] = useState('');
  const [paymentChoice, setPaymentChoice] = useState<'apple_pay' | 'card'>('apple_pay');

  const [isLoading, setIsLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validations
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !postalCode.trim() || !city.trim()) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsLoading(true);

    // Simulate safe Stripe Payment processing (1.2s delay)
    setTimeout(() => {
      const orderId = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          fullName,
          email,
          phone,
          address,
          postalCode,
          city,
          country: 'France',
          notes: relayNotes || undefined
        },
        items: [...cart],
        subtotal,
        shippingMethod,
        shippingFee,
        discount: (subtotal * discount) / 100,
        total,
        status: 'a_preparer',
        paymentStatus: 'paye',
        paymentMethod: paymentChoice === 'apple_pay' ? 'apple_pay' : 'stripe_card'
      };

      // Save order in persistent store so seller sees it in /admin immediately!
      addStoredOrder(newOrder);
      setCompletedOrder(newOrder);
      clearCart();
      setIsLoading(false);

      // Trigger victory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  const handleCloseAll = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={handleCloseAll} />

      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl z-10 p-6 sm:p-8">
        <button
          onClick={handleCloseAll}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          /* Confirmation d'Achat Écran Succès */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Paiement Confirmé • 100% Sécurisé
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1 mb-2">
              Merci pour votre commande !
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 mb-6">
              Votre commande <strong className="text-amber-300 font-mono font-bold">#{completedOrder.id}</strong> a été enregistrée avec succès. Votre flacon est en cours de préparation dans notre atelier.
            </p>

            {/* Récapitulatif expédition */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Destinataire :</span>
                <span className="font-bold text-white">{completedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Livraison :</span>
                <span className="text-amber-300 capitalize">
                  {completedOrder.shippingMethod === 'mondial_relay' ? 'Mondial Relay (Point Relais)' : 'Colissimo à Domicile'}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Adresse :</span>
                <span className="text-white text-right">
                  {completedOrder.customer.address}, {completedOrder.customer.postalCode} {completedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span className="text-zinc-300">Total réglé :</span>
                <span className="text-amber-400 font-serif text-base">{completedOrder.total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/suivi?order=${completedOrder.id}`}
                onClick={handleCloseAll}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Suivre ma commande en direct</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
              >
                Retour à la boutique
              </button>
            </div>
          </div>
        ) : (
          /* Formulaire de Commande Sécurisé */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Paiement Sécurisé SSL 256-Bit
              </span>
            </div>

            <h2 className="font-serif text-2xl text-white font-normal mb-1">
              Finaliser votre commande
            </h2>

            <p className="text-xs text-zinc-400 mb-6">
              Total à régler : <strong className="text-white font-serif text-base">{total.toFixed(2)} €</strong> ({cart.length} flacon{cart.length > 1 ? 's' : ''})
            </p>

            {formError && (
              <div className="bg-red-950/70 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Coordonnées */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Vos Coordonnées
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Lucas Morel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">Téléphone (SMS de suivi) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] text-zinc-300 block mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="lucas@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Adresse de Livraison */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Adresse de Livraison
                </h3>

                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Adresse (Numéro et Rue) *</label>
                  <input
                    type="text"
                    required
                    placeholder="15 Rue de la République"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">Code Postal *</label>
                    <input
                      type="text"
                      required
                      placeholder="75001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1">Ville *</label>
                    <input
                      type="text"
                      required
                      placeholder="Paris"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>

                {shippingMethod === 'mondial_relay' && (
                  <div className="mt-3">
                    <label className="text-[11px] text-amber-300 block mb-1">
                      Nom du Locker ou Point Relais préféré (facultatif)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Locker Auchan ou Tabac de la Gare"
                      value={relayNotes}
                      onChange={(e) => setRelayNotes(e.target.value)}
                      className="w-full bg-zinc-950 border border-amber-900/50 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Mode de Livraison */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Mode de Livraison
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      shippingMethod === 'mondial_relay'
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'mondial_relay'}
                        onChange={() => setShippingMethod('mondial_relay')}
                        className="text-amber-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-zinc-100">Mondial Relay</div>
                        <div className="text-[10px] text-zinc-400">Point relais en 3-5j</div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-amber-300">
                      {subtotal >= 60 ? 'OFFERT' : '3.90 €'}
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      shippingMethod === 'colissimo'
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'colissimo'}
                        onChange={() => setShippingMethod('colissimo')}
                        className="text-amber-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-zinc-100">Colissimo La Poste</div>
                        <div className="text-[10px] text-zinc-400">À domicile en 48h</div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-amber-300">
                      {subtotal >= 60 ? 'OFFERT' : '5.90 €'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Mode de Paiement */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Moyen de Paiement
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('apple_pay')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentChoice === 'apple_pay'
                        ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs">🍏 Apple Pay / G Pay</span>
                    <span className="text-[10px] text-zinc-400">Paiement 1 Clic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('card')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentChoice === 'card'
                        ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs">💳 Carte Bancaire</span>
                    <span className="text-[10px] text-zinc-400">Visa, Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Bouton Payer */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Validation du paiement sécurisé...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Payer {total.toFixed(2)} € en toute sécurité</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-zinc-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Paiement chiffré SSL • Stripe Certified Level 1 PCI-DSS
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
