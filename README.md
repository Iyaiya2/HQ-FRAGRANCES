# 🌟 Maison Élysée — Boutique E-commerce Parfumerie Prestige

Plateforme e-commerce haut de gamme dédiée à la vente de parfums et extraits de haute concentration, conçue pour convertir le trafic mobile (Snapchat, TikTok, Instagram) avec **0 € d'abonnement mensuel** et une gestion ultra-simplifiée pour le vendeur.

---

## ✨ Points Clés du Projet

- **0 € / mois d'abonnement fixe** : Hébergement gratuit sur Vercel, gestion par Stripe sans aucun frais d'abonnement récurrent.
- **Mobile-First & Ultra Rapide** : Développé en Next.js (App Router) et Tailwind CSS.
- **Paiement Sécurisé 100% Automatisé** :
  - Support Apple Pay, Google Pay et Carte Bancaire.
  - Protection 3D Secure & Stripe Radar anti-fraude.
- **Espace Vendeur Mobile Dédié (`/admin`)** :
  - Verrouillé par code PIN (défaut : `1234`).
  - Ajout de nouveaux parfums en 1 minute depuis un smartphone.
  - Bouton **📋 Copier l'adresse** en un clic pour générer les étiquettes Mondial Relay et La Poste sans ressaisie.
  - Mise à jour du statut des commandes et ajout des numéros de suivi.
- **Livraison Intégrée** :
  - Mondial Relay (Point Relais & Locker)
  - Colissimo (Domicile en 48h)
  - Jauge dynamique de livraison offerte dès 60 € d'achat.
- **Suivi Colis Client en Direct (`/suivi`)** :
  - Stepper visuel : 1. Payé ➔ 2. En préparation ➔ 3. Colis en route.
- **Code Promo Snapchat Intégré** :
  - Code `SNAP10` (-10% immédiat).

---

## 🚀 Lancement Rapide en Local

```bash
# 1. Cloner le projet
git clone https://github.com/Iyaiya2/boutique-parfum.git
cd boutique-parfum

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📱 Accès Rapides

- **Boutique publique** : `http://localhost:3000`
- **Espace Vendeur** : `http://localhost:3000/admin` (Code secret : `1234`)
- **Suivi des commandes** : `http://localhost:3000/suivi`

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (React 19, TypeScript)
- **Styling** : Tailwind CSS v4, Lucide React
- **Paiements** : Stripe Checkout & Apple Pay / Google Pay
- **Confetti** : Canvas Confetti
