'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { getStoredOrders } from '@/lib/store';
import { Order } from '@/types/perfume';
import {
  Search,
  Truck,
  CheckCircle2,
  Package,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams.get('order') || '';
  const isSuccess = searchParams.get('success') === 'true';

  const [searchCode, setSearchCode] = useState(initialOrderParam);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const allOrders = getStoredOrders();
    setRecentOrders(allOrders.slice(0, 3));
    if (initialOrderParam) {
      const clean = initialOrderParam.trim().toUpperCase().replace('#', '');
      const match = allOrders.find(
        o =>
          o.id.toUpperCase() === clean ||
          o.customer.email.toLowerCase() === clean.toLowerCase()
      );
      setFoundOrder(match || null);
      setSearched(true);
    } else if (isSuccess && allOrders.length > 0) {
      setFoundOrder(allOrders[0]);
      setSearchCode(allOrders[0].id);
      setSearched(true);
    }
  }, [initialOrderParam, isSuccess]);

  const handleSearch = (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase().replace('#', '');
    if (!clean) return;

    const orders = getStoredOrders();
    const match = orders.find(
      o =>
        o.id.toUpperCase() === clean ||
        o.customer.email.toLowerCase() === clean.toLowerCase()
    );

    setFoundOrder(match || null);
    setSearched(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchCode);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
      {isSuccess && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-xs sm:text-sm">
            <strong className="text-emerald-950 block">
              Paiement confirmé avec succès !
            </strong>
            Merci pour votre commande chez HQ Fragrance Paris. Voici le suivi en direct de votre colis.
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la boutique HQ Fragrance
        </Link>
        <h1 className="font-serif text-2xl sm:text-4xl text-zinc-950 font-bold mb-2">
          Suivi de votre Colis
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          Entrez votre numéro de commande (ex:{' '}
          <code className="text-zinc-950 font-mono font-semibold">CMD-8491</code>) ou votre adresse email.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={onSubmit} className="flex gap-2 max-w-md mx-auto mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
          <input
            type="text"
            required
            placeholder="Ex: CMD-8491 ou votre@email.fr"
            value={searchCode}
            onChange={e => setSearchCode(e.target.value)}
            className="w-full bg-white border border-zinc-300 focus:border-zinc-950 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 focus:outline-none shadow-2xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
        >
          Suivre
        </button>
      </form>

      {/* Quick Recent Orders Pills */}
      {recentOrders.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
          <span className="text-zinc-500">Accès rapide :</span>
          {recentOrders.map(ord => (
            <button
              key={ord.id}
              type="button"
              onClick={() => {
                setSearchCode(ord.id);
                handleSearch(ord.id);
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
            >
              #{ord.id}
            </button>
          ))}
        </div>
      )}

      {/* Tracking Result */}
      {searched && (
        <>
          {foundOrder ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Commande Confirmée • HQ Fragrance Paris
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-zinc-950">
                    #{foundOrder.id}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Passée le{' '}
                    {new Date(foundOrder.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 block">Total réglé</span>
                  <span className="font-serif text-2xl font-bold text-zinc-950">
                    {foundOrder.total.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Visual Stepper */}
              <div className="py-4">
                <div className="grid grid-cols-3 gap-2 text-center relative">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950">1. Payé</span>
                    <span className="text-[10px] text-zinc-500">
                      Commande validée
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                        foundOrder.status === 'a_preparer'
                          ? 'bg-zinc-950 text-white animate-pulse'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950">
                      2. Préparation
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {foundOrder.status === 'a_preparer'
                        ? 'En cours d’emballage'
                        : 'Prêt & Emballé'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                        foundOrder.status === 'expedie' ||
                        foundOrder.status === 'livre'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950">
                      3. Expédition
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {foundOrder.status === 'expedie'
                        ? 'Colis en transit'
                        : foundOrder.status === 'livre'
                        ? 'Colis livré'
                        : 'Expédition sous 24h'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Carrier & Tracking Number */}
              <div className="bg-[#faf9f6] border border-zinc-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Transporteur :</span>
                  <span className="font-semibold text-zinc-950">
                    {foundOrder.shippingMethod === 'mondial_relay'
                      ? 'Mondial Relay (Point Relais & Locker)'
                      : 'Colissimo La Poste (Domicile 48h)'}
                  </span>
                </div>

                {foundOrder.trackingNumber ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200">
                    <div>
                      <span className="text-zinc-500 block">
                        Numéro de suivi officiel :
                      </span>
                      <strong className="text-zinc-950 font-mono text-sm tracking-wider">
                        {foundOrder.trackingNumber}
                      </strong>
                    </div>

                    <a
                      href={
                        foundOrder.shippingMethod === 'mondial_relay'
                          ? `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${foundOrder.trackingNumber}`
                          : `https://www.laposte.fr/outils/suivre-vos-envois?code=${foundOrder.trackingNumber}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white flex items-center gap-1.5 font-semibold text-[11px]"
                    >
                      <span>Suivre sur le transporteur</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-zinc-200 text-zinc-500">
                    Votre numéro de suivi sera affiché ici dès la remise au transporteur (sous 24h ouvrées).
                  </div>
                )}
              </div>

              {/* Ordered Perfumes */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Flacons de votre commande :
                </span>
                {foundOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#faf9f6] p-3 rounded-xl border border-zinc-200"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={it.perfume.image}
                        alt={it.perfume.name}
                        className="w-12 h-14 object-cover rounded-lg border border-zinc-200"
                      />
                      <div>
                        <p className="font-serif text-base text-zinc-950">
                          {it.perfume.name}
                        </p>
                        <p className="text-zinc-500 text-[11px]">
                          Flacon {it.size} • Quantité : {it.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-base text-zinc-950 font-semibold">
                      {it.price * it.quantity} €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-zinc-200 shadow-xs">
              <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
              <h3 className="font-serif text-xl text-zinc-950">
                Commande introuvable
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                Vérifiez le numéro saisi (ex:{' '}
                <code className="text-zinc-950 font-semibold">CMD-8491</code>) ou l&apos;adresse email utilisée lors de votre commande.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SuiviPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#faf9f6] text-zinc-900">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 text-xs">
            Chargement du suivi...
          </div>
        }
      >
        <TrackingContent />
      </Suspense>
      <Footer />
      <CartDrawer />
    </main>
  );
}
