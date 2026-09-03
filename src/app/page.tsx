import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import StandingsPreview from '@/app/components/StandingsPreview';
import BracketSection from '@/app/components/BracketSection';
import RecentMatches from '@/app/components/RecentMatches';
import TopScorersSection from '@/app/components/TopScorersSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StandingsPreview />
        <BracketSection />
        <RecentMatches />
        <TopScorersSection />
      </main>
      <Footer />
    </>
  );
}