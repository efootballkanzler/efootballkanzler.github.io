import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Kanzler eFootball League',
  description: 'Ikuti klasemen, jadwal, bracket 16 besar, dan profil tim Kanzler eFootball League terlengkap.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  if (typeof window === 'undefined') return;
  window.addEventListener('load', function() {
    var links = document.querySelectorAll('link[rel="stylesheet"][href*="6f0bb0df815d650e"]');
    links.forEach(function(link) {
      link.media = 'all';
    });
  });
  // Defer non-critical stylesheets by switching media to print during parse
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeName === 'LINK' && node.rel === 'stylesheet' && node.href && node.href.indexOf('6f0bb0df815d650e') !== -1) {
          node.media = 'print';
          node.addEventListener('load', function() { node.media = 'all'; });
        }
      });
    });
  });
  observer.observe(document.head, { childList: true });
})();
            `,
          }}
        />
      
      <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fleaguesite7195back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
      <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></head>
      <body className={plusJakartaSans.className}>
        {children}
      </body>
    </html>
  );
}