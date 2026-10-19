import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HQ FRAGRANCE PARIS | Maison de Haute Parfumerie • Extraits 30%',
  description:
    'Boutique officielle HQ Fragrance Paris. Découvrez nos 11 créations olfactives haute concentration (30% Extrait de Parfum). Tenue extrême 24h+, expédition 24/48h Mondial Relay & Colissimo, paiement 100% sécurisé.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#060608] text-[#f5f3ef] font-sans selection:bg-amber-500/30 selection:text-amber-200">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
