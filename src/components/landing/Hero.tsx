'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden min-h-screen">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black -z-10" />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-bold text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-4"
      >
        Code at the Speed of Thought
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-[#888888] text-center max-w-2xl font-light"
      >
        Prism orchestrates Mistral, Groq, and ChromaDB to deliver a
        coding experience that feels like magic.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="mt-10 z-10"
      >
        <Link
          href="https://tiktok-kappa-steel.vercel.app/quiz/generator"
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium transition-transform hover:scale-105 active:scale-95"
        >
          <span>New Quiz</span>
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />

          {/* Subtle Glow */}
          <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
        </Link>
      </motion.div>

      {/* Mock IDE Screenshot with Floating Animation */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="mt-24 relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-[#333333] shadow-2xl shadow-white/5 bg-[#0a0a0a] perspective-1000"
      >
        {/* Floating Effect Wrapper */}
        <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full h-full"
        >
            {/* Mock UI Content */}
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <div className="w-16 md:w-64 border-r border-[#333333] h-full bg-[#0a0a0a]/50 p-4 hidden md:block">
                    <div className="space-y-3">
                        <div className="h-2 w-1/2 bg-[#333333] rounded"></div>
                        <div className="h-2 w-3/4 bg-[#333333] rounded"></div>
                        <div className="h-2 w-2/3 bg-[#333333] rounded"></div>
                    </div>
                </div>
                {/* Editor */}
                <div className="flex-1 p-8 font-mono text-sm text-[#888888] bg-black/40">
                    <div className="text-purple-400">import <span className="text-white">prism</span></div>
                    <div className="mt-4 text-blue-400">def <span className="text-yellow-400">accelerate_coding</span>():</div>
                    <div className="pl-4 text-white">latency = <span className="text-orange-400">0.05</span></div>
                    <div className="pl-4 text-white">model = <span className="text-green-400">&quot;mistral-large&quot;</span></div>
                    <div className="pl-4 text-white">return <span className="text-white">prism.generate(model, latency)</span></div>
                    <div className="pl-4 mt-4 text-[#444444] animate-pulse">|</div>
                </div>
                {/* Chat */}
                <div className="w-16 md:w-80 border-l border-[#333333] h-full bg-[#0a0a0a]/50 p-4 hidden md:block">
                     <div className="space-y-4">
                        <div className="flex gap-2">
                             <div className="w-6 h-6 rounded-full bg-[#333333]"></div>
                             <div className="h-10 flex-1 bg-[#222222] rounded-lg"></div>
                        </div>
                        <div className="flex gap-2 flex-row-reverse">
                             <div className="w-6 h-6 rounded-full bg-white"></div>
                             <div className="h-16 flex-1 bg-[#1a1a1a] rounded-lg border border-[#333333]"></div>
                        </div>
                     </div>
                </div>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
