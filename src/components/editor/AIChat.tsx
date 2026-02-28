'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrismStore } from '@/store/usePrismStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, SparklesIcon, BotIcon, UserIcon } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

export default function AIChat() {
  const { chatMessages, addMessage, isGenerating, setIsGenerating } = usePrismStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    setIsGenerating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) throw new Error('Backend disconnected');

      const data = await response.json();
      addMessage({ role: 'assistant', content: data.response });
      setIsGenerating(false);
    } catch {
      // Mock response delay
      setTimeout(() => {
        addMessage({ role: 'assistant', content: `Mock Response: Prism backend disconnected. I am running in offline mode.

Here is a Python example:

\`\`\`python
def hello_world():
    print("Hello from Prism AI")
    return True
\`\`\`
` });
        setIsGenerating(false);
      }, 1500);
    }
  };

  const MarkdownComponents: Components = {
    code(props) {
      const { children, className, node, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        // @ts-expect-error - SyntaxHighlighter types are slightly incompatible with ReactMarkdown
        <SyntaxHighlighter
          {...rest}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md border border-[#333333] my-2 text-sm"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={clsx("bg-white/10 rounded px-1 py-0.5 text-xs font-mono", className)} {...rest}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="h-full bg-[#0a0a0a] border-l border-[#333333] flex flex-col relative w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#333333] flex items-center gap-2 bg-[#0a0a0a] z-10 shrink-0">
        <SparklesIcon className="w-4 h-4 text-white" />
        <span className="font-mono text-sm font-bold text-white tracking-tight">PRISM AI</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 pb-24"
      >
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={clsx(
                "flex gap-3 text-sm leading-relaxed",
                msg.role === 'assistant' ? "items-start" : "items-start flex-row-reverse"
              )}
            >
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#333333]",
                msg.role === 'assistant' ? "bg-[#111111]" : "bg-white text-black"
              )}>
                {msg.role === 'assistant' ? <BotIcon className="w-4 h-4 text-white" /> : <UserIcon className="w-4 h-4" />}
              </div>

              <div className={clsx(
                "max-w-[85%] p-3 rounded-lg border overflow-hidden text-sm space-y-2",
                msg.role === 'assistant'
                  ? "bg-[#111111] border-[#333333] text-[#ededed]"
                  : "bg-[#1a1a1a] border-[#333333] text-white"
              )}>
                <ReactMarkdown
                    components={MarkdownComponents}
                >
                    {msg.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 items-center"
          >
             <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
             </div>
             <div className="flex gap-1 h-2 items-center pl-2">
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0 }}
                 className="w-1.5 h-1.5 bg-white rounded-full"
               />
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
                 className="w-1.5 h-1.5 bg-white rounded-full"
               />
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.4 }}
                 className="w-1.5 h-1.5 bg-white rounded-full"
               />
             </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent pt-10">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Prism..."
            className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border border-[#333333] rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-colors shadow-lg shadow-black/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/10 text-[#888888] hover:text-white transition-colors disabled:opacity-50"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
