'use client';

import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <Hero />
      <Features />

      {/* Footer */}
      <footer className="border-t border-[#333333] py-8 text-center text-[#888888] text-sm font-mono bg-[#0a0a0a]">
        <p>© 2024 Prism AI. Built with Mistral, Groq, and ChromaDB.</p>
      </footer>
    </main>
  );
}
