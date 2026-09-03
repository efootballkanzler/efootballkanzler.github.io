import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo size={32} />
            <span className="font-extrabold text-base tracking-tight text-foreground uppercase">
              LeagueSite
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-10">
            <Link href="/" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              Beranda
            </Link>
            <Link href="/standings" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              Klasemen
            </Link>
            <Link href="/schedule" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              Jadwal
            </Link>
            <Link href="/standings" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              Privasi
            </Link>
            <Link href="/ketentuan" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              Ketentuan
            </Link>
          </nav>

          <p className="text-[13px] font-semibold text-muted-foreground">
            © 2026 LeagueSite
          </p>
        </div>
      </div>
    </footer>
  );
}