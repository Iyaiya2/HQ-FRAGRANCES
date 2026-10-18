import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MAISON ÉLYSÉE | Haute Parfumerie & Extraits de Parfum',
  description: 'Boutique exclusive de parfums rares, extraits intenses et créations olfactives prestigieuses. Livraison rapide 48h Colissimo & Mondial Relay. Paiement 100% sécurisé.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-amber-500/30 selection:text-amber-200">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
