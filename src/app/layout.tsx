import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
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
      className={`${montserrat.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-[#111113] font-sans selection:bg-zinc-900 selection:text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
