'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Perfume, Order, OrderStatus, OlfactoryFamily, Category } from '@/types/perfume';
import {
  getStoredPerfumes,
  saveStoredPerfumes,
  getStoredOrders,
  updateStoredOrderStatus,
  getAdminPin,
  setAdminPin,
  addStoredPerfume,
  deleteStoredPerfume
} from '@/lib/store';
import {
  Lock,
  Package,
  Sparkles,
  DollarSign,
  Plus,
  Trash2,
  Copy,
  Check,
  Truck,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  ArrowLeft
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'commandes' | 'parfums' | 'stats'>('commandes');
  const [orders, setOrders] = useState<Order[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);

  // Tracking numbers draft
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // New perfume modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPerfume, setNewPerfume] = useState<{
    name: string;
    brand: string;
    inspiration: string;
    category: Category;
    family: OlfactoryFamily;
    price: number;
    price100ml: number;
    concentration: string;
    description: string;
    notesTop: string;
    notesHeart: string;
    notesBase: string;
    image: string;
    stock: number;
    isBestSeller: boolean;
  }>({
    name: '',
    brand: 'HQ FRAGRANCE',
    inspiration: '',
    category: 'Homme',
    family: 'Boisé',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum (30%)',
    description: '',
    notesTop: 'Bergamote, Poivre noir',
    notesHeart: 'Lavande, Cuir',
    notesBase: 'Vanille, Cèdre, Ambre',
    image: '/images/perfumes/king-vanille.png',
    stock: 15,
    isBestSeller: false
  });

  useEffect(() => {
    // Check if session pin already unlocked
    const sessionAuth = sessionStorage.getItem('elysee_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    setOrders(getStoredOrders());
    setPerfumes(getStoredPerfumes());
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getAdminPin();
    if (pinInput === correctPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem('elysee_admin_auth', 'true');
      loadData();
    } else {
      setPinError(true);
    }
  };

  const handleCopyAddress = (order: Order) => {
    const formatted = `${order.customer.fullName}\n${order.customer.address}\n${order.customer.postalCode} ${order.customer.city}\nFrance\nTél: ${order.customer.phone}\n${order.customer.notes ? `Note: ${order.customer.notes}` : ''}`;
    navigator.clipboard.writeText(formatted);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    const tracking = trackingInputs[orderId];
    const updated = updateStoredOrderStatus(orderId, status, tracking);
    setOrders(updated);
  };

  const handleDeletePerfume = (id: string) => {
    if (confirm('Voulez-vous vraiment retirer ce parfum de la boutique ?')) {
      const updated = deleteStoredPerfume(id);
      setPerfumes(updated);
    }
  };

  const handleCreatePerfume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerfume.name.trim()) return;

    const created: Perfume = {
      id: `perfume-${Date.now()}`,
      name: newPerfume.name,
      brand: newPerfume.brand,
      inspiration: newPerfume.inspiration ? `Inspiration ${newPerfume.inspiration}` : undefined,
      category: newPerfume.category,
      family: newPerfume.family,
      price: Number(newPerfume.price) || 45,
      price100ml: Number(newPerfume.price100ml) || 75,
      concentration: newPerfume.concentration,
      description: newPerfume.description || 'Création olfactive intense formulée à 30% d’extraits de parfum.',
      notes: {
        top: newPerfume.notesTop.split(',').map(s => s.trim()).filter(Boolean),
        heart: newPerfume.notesHeart.split(',').map(s => s.trim()).filter(Boolean),
        base: newPerfume.notesBase.split(',').map(s => s.trim()).filter(Boolean),
      },
      image: newPerfume.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
      stock: Number(newPerfume.stock) || 10,
      isBestSeller: newPerfume.isBestSeller
    };

    const updated = addStoredPerfume(created);
    setPerfumes(updated);
    setIsAddModalOpen(false);
  };

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paye' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'a_preparer').length;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-2xl text-white font-normal mb-1">
            Espace Vendeur
          </h1>
          <p className="text-xs text-zinc-400 mb-6">
            Entrez votre code secret pour gérer vos commandes et vos parfums.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="Code PIN (Défaut: 1234)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center tracking-[0.5em] text-2xl font-bold bg-zinc-950 border ${
                  pinError ? 'border-red-500 text-red-300' : 'border-zinc-800 focus:border-amber-400 text-white'
                } rounded-2xl py-3 px-4 focus:outline-none`}
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2">Code incorrect. Le code par défaut est 1234.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Déverrouiller
            </button>
          </form>

          <Link href="/" className="inline-block text-xs text-zinc-500 hover:text-zinc-300 mt-6">
            ← Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 pb-16">
      {/* Top Header Admin */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Voir la boutique client"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-normal text-white">
              Gestion de la Boutique
            </h1>
            <p className="text-[10px] text-amber-400 font-medium">Connecté en tant que Vendeur</p>
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem('elysee_admin_auth');
            setIsAuthenticated(false);
          }}
          className="text-xs px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
        >
          Déconnexion
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Résumé des Chiffres Express (3 Cartes) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <span className="text-[11px] text-zinc-400 block mb-1">Commandes à expédier</span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-amber-400">
                {pendingOrdersCount}
              </span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <span className="text-[11px] text-zinc-400 block mb-1">Chiffre d&apos;Affaires</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">
              {totalRevenue.toFixed(2)} €
            </span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-zinc-400 block mb-1">Parfums en Vente</span>
            <span className="font-serif text-2xl font-bold text-white">
              {perfumes.length}
            </span>
          </div>
        </div>

        {/* Barre d'onglets (Commandes / Parfums / Guide) */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('commandes')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'commandes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Commandes ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('parfums')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'parfums'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Mes Parfums ({perfumes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Aide Expédition</span>
          </button>
        </div>

        {/* ONGLET 1 : COMMANDES */}
        {activeTab === 'commandes' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-white">Aucune commande pour le moment</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Les commandes passées par vos clients apparaîtront ici automatiquement.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl"
                >
                  {/* Ligne Header Commande */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        #{order.id}
                      </span>
                      <span className="text-xs text-zinc-400">
                        • {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-serif text-amber-400">
                        {order.total.toFixed(2)} €
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          order.status === 'a_preparer'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : order.status === 'expedie'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {order.status === 'a_preparer'
                          ? '🟡 À préparer'
                          : order.status === 'expedie'
                          ? '🔵 Expédié'
                          : '🟢 Livré'}
                      </span>
                    </div>
                  </div>

                  {/* Produits de la commande */}
                  <div className="bg-zinc-950/60 rounded-2xl p-3 border border-zinc-800/80 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Flacons à mettre dans le carton :
                    </span>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400">{it.quantity}x</span>
                          <span className="text-white font-medium">{it.perfume.name}</span>
                          <span className="text-zinc-400 font-mono">({it.size})</span>
                        </div>
                        <span className="text-zinc-300 font-mono">{it.price * it.quantity} €</span>
                      </div>
                    ))}
                  </div>

                  {/* Coordonnées Client & Bouton Copier pour Étiquette */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Client &amp; Contact :
                      </span>
                      <p className="font-bold text-white text-sm">{order.customer.fullName}</p>
                      <p className="text-zinc-300 flex items-center gap-2">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <a href={`tel:${order.customer.phone}`} className="hover:underline">
                          {order.customer.phone}
                        </a>
                        <a
                          href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center gap-0.5 ml-1"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      </p>
                      <p className="text-zinc-400">{order.customer.email}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Adresse de Livraison ({order.shippingMethod === 'mondial_relay' ? 'Mondial Relay' : 'Colissimo'}) :
                      </span>
                      <p className="text-white font-medium">{order.customer.address}</p>
                      <p className="text-zinc-300">
                        {order.customer.postalCode} {order.customer.city}, France
                      </p>
                      {order.customer.notes && (
                        <p className="text-amber-300 text-[11px] bg-amber-950/40 p-1.5 rounded-lg border border-amber-900/40">
                          Note / Point Relais : {order.customer.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Boutons d'Action Expédition */}
                  <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(order)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        copiedOrderId === order.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                      }`}
                    >
                      {copiedOrderId === order.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Adresse copiée dans le presse-papier !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>📋 Copier l&apos;adresse pour l&apos;étiquette</span>
                        </>
                      )}
                    </button>

                    {/* Validation Expédition avec Numéro de Suivi */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="N° de suivi (La Poste / Mondial Relay)"
                        value={trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : (order.trackingNumber || '')}
                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none w-48"
                      />

                      {order.status === 'a_preparer' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'expedie')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Marquer Expédié</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'livre')}
                          className="px-3 py-2 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                        >
                          Marquer Livré
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ONGLET 2 : PARFUMS */}
        {activeTab === 'parfums' && (
          <div className="space-y-4">
            {/* Bouton Ajouter */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-400">
                Vous avez actuellement <strong className="text-white">{perfumes.length} parfums</strong> en vente.
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Parfum</span>
              </button>
            </div>

            {/* Grille des Parfums Existants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {perfumes.map((perfume) => (
                <div
                  key={perfume.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex gap-3.5 items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-16 h-20 object-cover rounded-xl bg-zinc-950 shrink-0"
                    />
                    <div className="min-w-0">
                      {perfume.inspiration && (
                        <p className="text-[10px] font-bold text-amber-400 tracking-wider uppercase truncate">
                          {perfume.inspiration}
                        </p>
                      )}
                      <h4 className="font-serif text-sm font-normal text-white truncate">
                        {perfume.name}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        50ml : <strong className="text-white">{perfume.price} €</strong> • 100ml : <strong className="text-white">{perfume.price100ml} €</strong>
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Stock : <span className="text-amber-300 font-bold">{perfume.stock}</span> flacons
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePerfume(perfume.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                    title="Supprimer ce parfum"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 3 : AIDE EXPÉDITION & CONSEILS */}
        {activeTab === 'stats' && (
          <div className="space-y-4 text-xs">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-serif text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Comment expédier un parfum sans prise de tête ?
              </h3>
              <p className="text-zinc-300 leading-relaxed font-light">
                Voici le rappel de la procédure pour envoyer vos colis en 5 minutes chrono :
              </p>

              <ol className="space-y-3 pl-4 list-decimal text-zinc-300 font-light">
                <li>
                  <strong>Cliquez sur « Copier l&apos;adresse »</strong> sur la commande reçue dans l&apos;onglet Commandes.
                </li>
                <li>
                  <strong>Rendez-vous sur l&apos;application Mondial Relay ou le site laposte.fr</strong> et collez l&apos;adresse du client.
                </li>
                <li>
                  <strong>Pour Mondial Relay :</strong> Vous n&apos;avez même pas besoin d&apos;imprimer ! L&apos;application vous donne un QR Code. Allez au Locker ou au point relais, scannez le QR code et la machine imprime l&apos;étiquette pour vous.
                </li>
                <li>
                  <strong>Pour La Poste :</strong> Vous pouvez déposer le carton directement dans votre propre boîte aux lettres le matin avant 8h. Le facteur le prend sans que vous ayez à vous déplacer.
                </li>
                <li>
                  <strong>Récupérez le numéro de suivi</strong>, collez-le dans la case de la commande et cliquez sur « Marquer Expédié ».
                </li>
              </ol>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-serif text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Astuce Snapchat pour doubler vos ventes
              </h3>
              <p className="text-zinc-300 leading-relaxed font-light">
                Quand vous postez en story Snap :
              </p>
              <ul className="space-y-2 pl-4 list-disc text-zinc-300 font-light">
                <li>Mettez toujours le lien direct vers le parfum ou le site en sticker de lien en story.</li>
                <li>Rappelez le code promo de bienvenue : <strong>SNAP10</strong> pour 10% de réduction immédiate.</li>
                <li>Rappelez que la <strong>livraison est offerte dès 60 €</strong> d&apos;achat (pour inciter à prendre 2 flacons d&apos;un coup).</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* MODAL AJOUT DE PARFUM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-serif text-2xl text-white font-normal mb-1">
              Ajouter un nouveau parfum
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Remplissez les détails pour le mettre en ligne immédiatement sur la boutique.
            </p>

            <form onSubmit={handleCreatePerfume} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Nom du Parfum *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ambre Impérial"
                  value={newPerfume.name}
                  onChange={(e) => setNewPerfume({ ...newPerfume, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">
                  Inspiration / Référence connue (Optionnel mais recommandé)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Baccarat Rouge 540 ou Ombre Nomade"
                  value={newPerfume.inspiration}
                  onChange={(e) => setNewPerfume({ ...newPerfume, inspiration: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Prix 50ml (€) *</label>
                  <input
                    type="number"
                    required
                    value={newPerfume.price}
                    onChange={(e) => setNewPerfume({ ...newPerfume, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Prix 100ml (€) *</label>
                  <input
                    type="number"
                    required
                    value={newPerfume.price100ml}
                    onChange={(e) => setNewPerfume({ ...newPerfume, price100ml: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Stock disponible *</label>
                  <input
                    type="number"
                    required
                    value={newPerfume.stock}
                    onChange={(e) => setNewPerfume({ ...newPerfume, stock: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 block mb-1">Genre</label>
                  <select
                    value={newPerfume.category}
                    onChange={(e) => setNewPerfume({ ...newPerfume, category: e.target.value as Category })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="Unisexe">Unisexe</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Famille Olfactive</label>
                <select
                  value={newPerfume.family}
                  onChange={(e) => setNewPerfume({ ...newPerfume, family: e.target.value as OlfactoryFamily })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                >
                  <option value="Boisé">Boisé</option>
                  <option value="Ambré">Ambré</option>
                  <option value="Gourmand">Gourmand</option>
                  <option value="Floral">Floral</option>
                  <option value="Cuiré">Cuiré</option>
                  <option value="Frais">Frais</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">
                  Notes Olfactives (séparées par des virgules)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Notes de tête (ex: Poivre noir, Bergamote)"
                    value={newPerfume.notesTop}
                    onChange={(e) => setNewPerfume({ ...newPerfume, notesTop: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Notes de cœur (ex: Rose, Jasmin, Cèdre)"
                    value={newPerfume.notesHeart}
                    onChange={(e) => setNewPerfume({ ...newPerfume, notesHeart: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Notes de fond (ex: Oud, Vanille, Ambre gris)"
                    value={newPerfume.notesBase}
                    onChange={(e) => setNewPerfume({ ...newPerfume, notesBase: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-300 block mb-1">Photo du Flacon (Lien URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPerfume.image}
                  onChange={(e) => setNewPerfume({ ...newPerfume, image: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-white focus:outline-none text-[11px]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20"
                >
                  Mettre en vente sur le site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
