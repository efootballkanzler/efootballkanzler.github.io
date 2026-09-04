'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Klasemen', href: '/standings' },
  { label: 'Jadwal', href: '/schedule' },
  { label: 'Knock Out', href: '/r16' },
  { label: 'Tim', href: '/teams' },
  { label: 'Admin', href: '/admin' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-primary/90 backdrop-blur-xl border-b border-border py-3' :'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <AppLogo size={36} onClick={() => {}} />
            <span className="font-extrabold text-lg tracking-tight text-foreground uppercase hidden sm:block">
              LeagueSite
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center pill-nav gap-8">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  pathname === link?.href
                    ? 'text-accent' :'text-foreground/60 hover:text-foreground'
                }`}
              >
                {link?.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/schedule"
              className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-accent/90 transition-all accent-glow"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-accent-foreground/80 live-badge"></span>
              Jadwal Terkini
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-border"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <>
                  <span className="block w-5 h-0.5 bg-foreground rotate-45 translate-y-2 transition-all"></span>
                  <span className="block w-5 h-0.5 bg-foreground opacity-0 transition-all"></span>
                  <span className="block w-5 h-0.5 bg-foreground -rotate-45 -translate-y-2 transition-all"></span>
                </>
              ) : (
                <>
                  <span className="block w-5 h-0.5 bg-foreground transition-all"></span>
                  <span className="block w-5 h-0.5 bg-foreground transition-all"></span>
                  <span className="block w-5 h-0.5 bg-foreground transition-all"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-black uppercase tracking-widest transition-colors ${
                pathname === link?.href ? 'text-accent' : 'text-foreground/60'
              }`}
            >
              {link?.label}
            </Link>
          ))}
          <Link
            href="/schedule"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-accent text-accent-foreground px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest"
          >
            Jadwal Terkini
          </Link>
        </div>
      )}
    </>
  );
}