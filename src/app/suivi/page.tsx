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
  Clock,
  Package,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams.get('order') || '';

  const [searchCode, setSearchCode] = useState(initialOrderParam);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialOrderParam) {
      handleSearch(initialOrderParam);
    }
  }, [initialOrderParam]);

  const handleSearch = (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase().replace('#', '');
    if (!clean) return;

    const orders = getStoredOrders();
    const match = orders.find(
      o => o.id.toUpperCase() === clean || o.customer.email.toLowerCase() === clean.toLowerCase()
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
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la boutique
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-2">
          Suivi de votre Colis
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Entrez votre numéro de commande (ex: <code className="text-amber-400">CMD-9840</code>) ou l&apos;adresse email utilisée lors de votre achat.
        </p>
      </div>

      {/* Formulaire de Recherche */}
      <form onSubmit={onSubmit} className="flex gap-2 max-w-md mx-auto mb-10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            required
            placeholder="Ex: CMD-9840 ou votre@email.fr"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
        >
          Rechercher
        </button>
      </form>

      {/* Résultat de Suivi */}
      {searched && (
        <>
          {foundOrder ? (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
              {/* En-tête de la commande */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Commande Confirmée
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white">
                    #{foundOrder.id}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Passée le {new Date(foundOrder.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Total réglé</span>
                  <span className="font-serif text-xl font-bold text-amber-400">
                    {foundOrder.total.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Étapes Visuelles de Suivi (Stepper) */}
              <div className="py-4">
                <div className="grid grid-cols-3 gap-2 text-center relative">
                  {/* Étape 1 : Payé */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold mb-2 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white">1. Payé</span>
                    <span className="text-[10px] text-zinc-400">Paiement validé</span>
                  </div>

                  {/* Étape 2 : Préparation */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                      foundOrder.status === 'a_preparer'
                        ? 'bg-amber-500 text-zinc-950 animate-pulse'
                        : 'bg-emerald-500 text-zinc-950'
                    }`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white">2. Préparation</span>
                    <span className="text-[10px] text-zinc-400">
                      {foundOrder.status === 'a_preparer' ? 'En cours d’emballage' : 'Prêt & Emballé'}
                    </span>
                  </div>

                  {/* Étape 3 : Expédié */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                      foundOrder.status === 'expedie' || foundOrder.status === 'livre'
                        ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white">3. En route</span>
                    <span className="text-[10px] text-zinc-400">
                      {foundOrder.status === 'expedie' ? 'Colis chez le transporteur' : foundOrder.status === 'livre' ? 'Livré' : 'Bientôt expédié'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloc Numéro de Suivi & Transporteur */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Mode de livraison :</span>
                  <span className="font-bold text-white">
                    {foundOrder.shippingMethod === 'mondial_relay' ? 'Mondial Relay (Point Relais)' : 'Colissimo La Poste (Domicile)'}
                  </span>
                </div>

                {foundOrder.trackingNumber ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                    <div>
                      <span className="text-zinc-400 block">Numéro de suivi transporteur :</span>
                      <strong className="text-amber-400 font-mono text-sm tracking-wider">
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
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <span>Voir sur le site officiel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-zinc-800/80 text-zinc-400 italic">
                    Le numéro de suivi sera renseigné dès que le colis aura été déposé en point relais / poste (généralement sous 24h).
                  </div>
                )}
              </div>

              {/* Flacons commandés */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Articles de votre commande :
                </span>
                {foundOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                      <img src={it.perfume.image} alt={it.perfume.name} className="w-10 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="font-bold text-white">{it.perfume.name}</p>
                        <p className="text-zinc-400 text-[11px]">{it.size} • Qté: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif text-sm text-zinc-200">{it.price * it.quantity} €</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-900/40 rounded-3xl border border-zinc-800">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <h3 className="font-serif text-lg text-white">Commande introuvable</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                Vérifiez le numéro saisi (ex: <code className="text-amber-400">CMD-9840</code>) ou l&apos;adresse email de commande.
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
    <main className="min-h-screen flex flex-col bg-[#09090b]">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 text-xs">
          Chargement du suivi...
        </div>
      }>
        <TrackingContent />
      </Suspense>
      <Footer />
      <CartDrawer />
    </main>
  );
}
