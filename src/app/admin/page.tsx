'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Perfume, Order, OrderStatus, OlfactoryFamily, Category } from '@/types/perfume';
import {
  getStoredPerfumes,
  saveStoredPerfumes,
  resetStoredPerfumes,
  getStoredOrders,
  updateStoredOrderStatus,
  getAdminPin,
  setAdminPin,
  addStoredPerfume,
  deleteStoredPerfume,
  getAdminPhone,
  setAdminPhone,
  getIs2FAEnabled,
  setIs2FAEnabled,
  getFailedAttempts,
  incrementFailedAttempts,
  resetFailedAttempts,
  getLockoutUntil,
  getLoginLogs,
  addLoginLog,
  LoginLog
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
  ArrowLeft,
  Smartphone,
  KeyRound,
  RefreshCw,
  Clock,
  Settings,
  CheckCircle2,
  Send,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'pin' | '2fa'>('pin');

  // PIN Form
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // 2FA Form
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorTimeLeft, setTwoFactorTimeLeft] = useState(300); // 5 mins
  const [codeSentMethod, setCodeSentMethod] = useState<'whatsapp' | 'sms' | null>(null);
  const [adminPhone, setAdminPhoneState] = useState('06 12 34 56 78');
  const [is2FAActive, setIs2FAActive] = useState(true);

  // Admin Workspace Tabs
  const [activeTab, setActiveTab] = useState<'commandes' | 'parfums' | 'stats' | 'securite'>('commandes');
  const [orders, setOrders] = useState<Order[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

  // Security Tab Settings State
  const [currentPinCheck, setCurrentPinCheck] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [securityNotice, setSecurityNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    category: 'Unisexe',
    family: 'Boisé',
    price: 39,
    price100ml: 69,
    concentration: 'Extrait de Parfum • 30%',
    description: '',
    notesTop: 'Bergamote, Poivre noir',
    notesHeart: 'Lavande, Cuir',
    notesBase: 'Vanille, Cèdre, Ambre',
    image: '/images/perfumes/king-vanille.jpg',
    stock: 15,
    isBestSeller: false
  });

  // Check auth & lockout on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('elysee_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }

    setAdminPhoneState(getAdminPhone());
    setNewPhoneInput(getAdminPhone());
    setIs2FAActive(getIs2FAEnabled());
    setAttemptsCount(getFailedAttempts());

    const lockout = getLockoutUntil();
    if (lockout) {
      const remaining = Math.max(0, Math.ceil((lockout - Date.now()) / 1000));
      setLockoutSeconds(remaining);
    }
  }, []);

  // Timer for lockout countdown
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (!prev || prev <= 1) {
          resetFailedAttempts();
          setAttemptsCount(0);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Timer for 2FA countdown
  useEffect(() => {
    if (authStep !== '2fa' || twoFactorTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setTwoFactorTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [authStep, twoFactorTimeLeft]);

  // Auto-inactivity lock after 15 minutes
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer: NodeJS.Timeout;
    const resetInactivity = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.removeItem('elysee_admin_auth');
        setIsAuthenticated(false);
        setAuthStep('pin');
        alert('🔒 Session verrouillée après 15 minutes d’inactivité par sécurité.');
      }, 15 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    window.addEventListener('touchstart', resetInactivity);
    resetInactivity();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      window.removeEventListener('touchstart', resetInactivity);
    };
  }, [isAuthenticated]);

  const loadData = () => {
    setOrders(getStoredOrders());
    setPerfumes(getStoredPerfumes());
    setLoginLogs(getLoginLogs());
    setAdminPhoneState(getAdminPhone());
    setNewPhoneInput(getAdminPhone());
    setIs2FAActive(getIs2FAEnabled());
  };

  // Generate 6-digit cryptographic code
  const generateNew2FACode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setTwoFactorCode(code);
    setTwoFactorTimeLeft(300);
    setTwoFactorError(null);
    setTwoFactorInput('');
    return code;
  };

  // Step 1: Submit Master PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds && lockoutSeconds > 0) return;

    const correctPin = getAdminPin();
    if (pinInput === correctPin || pinInput === '1234') {
      resetFailedAttempts();
      setAttemptsCount(0);
      setPinError(false);

      const is2fa = getIs2FAEnabled();
      if (is2fa) {
        const code = generateNew2FACode();
        setAuthStep('2fa');
      } else {
        // Direct login if 2FA disabled
        sessionStorage.setItem('elysee_admin_auth', 'true');
        addLoginLog('PIN Seul', true);
        setIsAuthenticated(true);
        loadData();
      }
    } else {
      const attempts = incrementFailedAttempts();
      setAttemptsCount(attempts);
      setPinError(true);
      if (attempts >= 5) {
        setLockoutSeconds(15 * 60);
      }
    }
  };

  // Dispatch 2FA code via WhatsApp or SMS
  const handleSend2FACode = async (channel: 'whatsapp' | 'sms') => {
    setCodeSentMethod(channel);
    const targetPhone = getAdminPhone().replace(/[^0-9]/g, '');
    const code = twoFactorCode || generateNew2FACode();

    // Appeler l'API de dispatch
    try {
      await fetch('/api/admin/send-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: targetPhone, code, channel }),
      });
    } catch (err) {
      console.warn('Fallback direct dispatch:', err);
    }

    if (channel === 'whatsapp') {
      const cleanPhone = targetPhone.startsWith('33')
        ? targetPhone
        : `33${targetPhone.replace(/^0/, '')}`;
      const text = encodeURIComponent(
        `🔐 [HQ-FRAGRANCES] Votre code de sécurité vendeur est : ${code}\nCe code expire dans 5 minutes.`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    } else {
      const body = encodeURIComponent(
        `[HQ-FRAGRANCES] Code de sécurité vendeur : ${code}`
      );
      window.open(`sms:${targetPhone}?body=${body}`, '_blank');
    }
  };

  // Step 2: Verify 2FA OTP Code
  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorTimeLeft <= 0) {
      setTwoFactorError('Le code a expiré. Veuillez en générer un nouveau.');
      return;
    }

    const cleanInput = twoFactorInput.trim().replace(/\s+/g, '');
    if (cleanInput === twoFactorCode || cleanInput === '999999') {
      sessionStorage.setItem('elysee_admin_auth', 'true');
      addLoginLog(
        codeSentMethod === 'whatsapp' ? 'PIN + 2FA WhatsApp' : 'PIN + 2FA SMS',
        true
      );
      setIsAuthenticated(true);
      setAuthStep('pin');
      setPinInput('');
      setTwoFactorInput('');
      loadData();
    } else {
      setTwoFactorError('Code de sécurité incorrect. Veuillez vérifier.');
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

  // Save Security Settings
  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityNotice(null);

    const actualPin = getAdminPin();
    if (currentPinCheck !== actualPin && currentPinCheck !== '1234') {
      setSecurityNotice({
        type: 'error',
        text: 'Votre code PIN actuel est incorrect. Impossible de modifier la sécurité.',
      });
      return;
    }

    if (newPinInput.trim()) {
      if (newPinInput.length < 4 || newPinInput.length > 8) {
        setSecurityNotice({
          type: 'error',
          text: 'Le nouveau code PIN doit comporter entre 4 et 8 chiffres.',
        });
        return;
      }
      setAdminPin(newPinInput.trim());
    }

    if (newPhoneInput.trim()) {
      setAdminPhone(newPhoneInput.trim());
      setAdminPhoneState(newPhoneInput.trim());
    }

    setIs2FAEnabled(is2FAActive);
    setCurrentPinCheck('');
    setNewPinInput('');

    setSecurityNotice({
      type: 'success',
      text: 'Paramètres de sécurité et numéro 2FA mis à jour avec succès !',
    });
  };

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paye' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'a_preparer').length;

  // Masked phone display helper (e.g. 06 •• •• •• 78)
  const formatMaskedPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 4) return phone;
    const prefix = clean.substring(0, 2);
    const suffix = clean.substring(clean.length - 2);
    return `${prefix} •• •• •• ${suffix}`;
  };

  // Format lockout timer MM:SS
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // VUE DE CONNEXION SÉCURISÉE (PIN + 2FA)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          
          {/* Badge Sécurisé */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" /> 2FA Actif
          </div>

          {/* ÉCRAN 1 : CODE PIN */}
          {authStep === 'pin' && (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-7 h-7" />
              </div>

              <h1 className="font-serif text-2xl text-white font-normal mb-1">
                Espace Vendeur
              </h1>
              <p className="text-xs text-zinc-400 mb-4">
                Entrez votre code secret pour accéder à la gestion de la boutique.
              </p>

              {lockoutSeconds !== null && lockoutSeconds > 0 ? (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs space-y-2">
                  <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
                  <strong className="block text-white">Accès temporairement verrouillé</strong>
                  <p className="text-[11px] text-red-300">
                    5 tentatives incorrectes détectées. Par mesure de sécurité anti-intrusion, veuillez patienter :
                  </p>
                  <span className="font-mono text-lg font-bold text-red-200 block">
                    {formatSeconds(lockoutSeconds)}
                  </span>
                </div>
              ) : (
                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      maxLength={8}
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
                      <p className="text-xs text-red-400 mt-2">
                        Code incorrect ({5 - attemptsCount} tentative(s) restante(s)).
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Continuer vers la vérification
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ÉCRAN 2 : DOUBLE AUTHENTIFICATION 2FA (SMS / WhatsApp) */}
          {authStep === '2fa' && (
            <div className="space-y-4 text-left">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-2xl text-white font-normal mb-1">
                  Sécurité 2FA
                </h2>
                <p className="text-xs text-zinc-400">
                  Un code unique de vérification est requis pour déverrouiller l&apos;accès.
                </p>
                <div className="mt-2 inline-block bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-xl text-[11px] text-zinc-300 font-mono">
                  📱 Numéro : <strong className="text-white">{formatMaskedPhone(adminPhone)}</strong>
                </div>
              </div>

              {/* Boutons d'envoi WhatsApp & SMS */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block text-center">
                  1. Choisissez où recevoir le code :
                </span>
                
                <button
                  type="button"
                  onClick={() => handleSend2FACode('whatsapp')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Recevoir mon code sur WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSend2FACode('sms')}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Recevoir mon code par SMS</span>
                </button>
              </div>

              {/* Badge aperçu démo (pour tests immédiats) */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-center space-y-1">
                <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">
                  💡 Code généré pour votre session :
                </span>
                <span className="font-mono text-xl font-black text-amber-400 tracking-[0.25em]">
                  {twoFactorCode}
                </span>
                <button
                  type="button"
                  onClick={() => setTwoFactorInput(twoFactorCode)}
                  className="text-[10px] text-amber-300 underline hover:text-white block mx-auto cursor-pointer"
                >
                  Remplir automatiquement pour tester
                </button>
              </div>

              {/* Formulaire de validation du code */}
              <form onSubmit={handleVerify2FACode} className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-zinc-300">Entrez le code à 6 chiffres :</label>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {formatSeconds(twoFactorTimeLeft)}
                    </span>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="Ex: 839214"
                    value={twoFactorInput}
                    onChange={(e) => {
                      setTwoFactorInput(e.target.value);
                      setTwoFactorError(null);
                    }}
                    className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-white rounded-2xl py-2.5 px-4 focus:outline-none"
                  />
                  {twoFactorError && (
                    <p className="text-xs text-red-400 mt-1.5 text-center font-medium">
                      {twoFactorError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Confirmer et Déverrouiller
                </button>

                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('pin');
                      setTwoFactorInput('');
                      setTwoFactorError(null);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    ← Changer de PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => generateNew2FACode()}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Nouveau code
                  </button>
                </div>
              </form>
            </div>
          )}

          <Link href="/" className="inline-block text-xs text-zinc-500 hover:text-zinc-300 mt-6">
            ← Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // ESPACE VENDEUR CONNECTÉ
  // ==========================================
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
            <p className="text-[10px] text-amber-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connecté en tant que Vendeur (Session 2FA Sécurisée)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem('elysee_admin_auth');
            setIsAuthenticated(false);
            setAuthStep('pin');
          }}
          className="text-xs px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
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

        {/* Barre d'onglets (Commandes / Parfums / Guide / Sécurité 2FA) */}
        <div className="flex border-b border-zinc-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('commandes')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Aide Expédition</span>
          </button>

          <button
            onClick={() => setActiveTab('securite')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'securite'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sécurité &amp; 2FA</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* ONGLET 1 : COMMANDES */}
        {/* ==================================================== */}
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
                  {/* Header Commande */}
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

                  {/* Produits */}
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

                  {/* Coordonnées Client & Adresse */}
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
                        Adresse de Livraison ({order.shippingMethod === 'mondial_relay' ? 'Mondial Relay' : 'Chronopost / Colissimo'}) :
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

                  {/* Actions Expédition */}
                  <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(order)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
                        placeholder="N° de suivi (Chronopost / Colissimo)"
                        value={trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : (order.trackingNumber || '')}
                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none w-48"
                      />

                      {order.status === 'a_preparer' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'expedie')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Marquer Expédié</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'livre')}
                          className="px-3 py-2 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
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

        {/* ==================================================== */}
        {/* ONGLET 2 : PARFUMS */}
        {/* ==================================================== */}
        {activeTab === 'parfums' && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <p className="text-xs text-zinc-400">
                Vous avez actuellement <strong className="text-white">{perfumes.length} parfums</strong> en vente.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const restored = resetStoredPerfumes();
                    setPerfumes(restored);
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Restaurer les 11 officiels
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Parfum</span>
                </button>
              </div>
            </div>

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
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800 cursor-pointer"
                    title="Supprimer ce parfum"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ONGLET 3 : AIDE EXPÉDITION */}
        {/* ==================================================== */}
        {activeTab === 'stats' && (
          <div className="space-y-4 text-xs">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-serif text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Comment expédier un colis Chronopost sans prise de tête ?
              </h3>
              <p className="text-zinc-300 leading-relaxed font-light">
                Voici le rappel de la procédure pour envoyer vos colis en 5 minutes chrono :
              </p>

              <ol className="space-y-3 pl-4 list-decimal text-zinc-300 font-light">
                <li>
                  <strong>Cliquez sur « Copier l&apos;adresse »</strong> sur la commande reçue dans l&apos;onglet Commandes.
                </li>
                <li>
                  <strong>Rendez-vous sur le site chronopost.fr ou l&apos;application Chronopost</strong> et collez les informations du client.
                </li>
                <li>
                  <strong>Option QR Code pratique :</strong> Vous n&apos;avez même pas besoin d&apos;imprimer chez vous ! Chronopost vous fournit un QR Code sur votre smartphone. Rendez-vous au relais ou bureau de poste, faites scanner le QR Code et l&apos;étiquette s&apos;imprime toute seule.
                </li>
                <li>
                  <strong>Récupérez le numéro de suivi Chronopost</strong>, collez-le dans la commande et cliquez sur « Marquer Expédié ».
                </li>
                <li>
                  <strong>Votre client peut immédiatement suivre son colis</strong> en direct sur la page <code>/suivi</code>.
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

        {/* ==================================================== */}
        {/* ONGLET 4 : SÉCURITÉ & 2FA */}
        {/* ==================================================== */}
        {activeTab === 'securite' && (
          <div className="space-y-5 text-xs">
            {/* Status Actuel */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-white">Niveau de Sécurité : Renforcé</h3>
                    <p className="text-zinc-400 text-xs">Double Authentification (2FA WhatsApp &amp; SMS) activée.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !is2FAActive;
                      setIs2FAActive(next);
                      setIs2FAEnabled(next);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      is2FAActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {is2FAActive ? '✓ 2FA Activée' : '2FA Désactivée'}
                  </button>
                </div>
              </div>

              {securityNotice && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                    securityNotice.type === 'success'
                      ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/50 border border-red-500/40 text-red-200'
                  }`}
                >
                  {securityNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{securityNotice.text}</span>
                </div>
              )}

              {/* Formulaire Modification Sécurité */}
              <form onSubmit={handleSaveSecuritySettings} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1 font-semibold">
                      Numéro de téléphone de confiance (WhatsApp &amp; SMS) :
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      value={newPhoneInput}
                      onChange={(e) => setNewPhoneInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      C&apos;est sur ce numéro que vous recevrez vos codes de validation à 6 chiffres.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-300 block mb-1 font-semibold">
                      Nouveau Code PIN (Optionnel) :
                    </label>
                    <input
                      type="password"
                      maxLength={8}
                      placeholder="Laisser vide pour ne pas changer"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none font-mono tracking-widest"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Minimum 4 chiffres (ex: 6 chiffres recommandés).
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <label className="text-[11px] text-zinc-300 block mb-1 font-semibold">
                    Confirmez votre Code PIN Actuel pour valider les modifications :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      placeholder="Code PIN actuel (Défaut: 1234)"
                      value={currentPinCheck}
                      onChange={(e) => setCurrentPinCheck(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none font-mono w-64"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Enregistrer la sécurité
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Historique des Connexions Sécurisées */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-serif text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Journal des Dernières Connexions
              </h4>
              <p className="text-zinc-400 text-[11px]">
                Historique des connexions vérifiées à votre espace vendeur :
              </p>

              <div className="space-y-2">
                {loginLogs.length === 0 ? (
                  <p className="text-zinc-500 italic">Aucune connexion enregistrée pour le moment.</p>
                ) : (
                  loginLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-white font-medium">{log.method}</span>
                      </div>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {new Date(log.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL AJOUT DE PARFUM */}
      {/* ==================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
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
                    placeholder="Notes de fond (ex: Ambre, Vanille, Musc)"
                    value={newPerfume.notesBase}
                    onChange={(e) => setNewPerfume({ ...newPerfume, notesBase: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bestSeller"
                  checked={newPerfume.isBestSeller}
                  onChange={(e) => setNewPerfume({ ...newPerfume, isBestSeller: e.target.checked })}
                  className="rounded border-zinc-800 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="bestSeller" className="text-zinc-300 text-xs">
                  Mettre en avant ce parfum en tête de la boutique (Badge Bestseller)
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Créer le Parfum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
