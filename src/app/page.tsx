'use client';

import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <Hero />
      <Features />

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 text-center bg-black">
        <p className="text-neutral-500 text-xs font-mono tracking-wide">
          © 2026 Prism AI. Built with Mistral, Groq, and ChromaDB.
        </p>
      </footer>
    </main>
  );
}
