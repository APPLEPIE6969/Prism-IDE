'use client';

import { motion } from 'framer-motion';
import { ZapIcon, BrainIcon, DatabaseIcon } from 'lucide-react';
import clsx from 'clsx';

const features = [
  {
    title: "Mistral Autocomplete",
    description: "Code faster with context-aware suggestions powered by Mistral 7B.",
    icon: <ZapIcon className="w-6 h-6 text-yellow-400" />,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Groq Speed",
    description: "Experience sub-second chat latency with Groq LPU inference.",
    icon: <BrainIcon className="w-6 h-6 text-orange-400" />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "ChromaDB Memory",
    description: "Your AI remembers everything. Infinite context window via RAG.",
    icon: <DatabaseIcon className="w-6 h-6 text-purple-400" />,
    className: "md:col-span-1 md:row-span-1",
  },
];

export default function Features() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={clsx(
              "group relative p-8 rounded-2xl border border-[#333333] bg-[#0a0a0a] overflow-hidden hover:border-[#555555] transition-colors",
              feature.className
            )}
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="bg-[#1a1a1a] w-12 h-12 rounded-lg flex items-center justify-center border border-[#333333] mb-4">
                  {feature.icon}
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                 <p className="text-[#888888]">{feature.description}</p>
               </div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
