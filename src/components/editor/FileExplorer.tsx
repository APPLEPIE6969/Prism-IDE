'use client';

import { motion } from 'framer-motion';
import { usePrismStore } from '@/store/usePrismStore';
import { FileIcon, FolderIcon, FileTextIcon, TerminalIcon } from 'lucide-react';
import clsx from 'clsx';

export default function FileExplorer() {
  const { files, activeFile, setActiveFile, isSidebarOpen } = usePrismStore();

  const getIcon = (fileName: string) => {
    if (fileName.endsWith('.py')) return <FileIcon className="w-4 h-4 text-yellow-500" />;
    if (fileName.endsWith('.txt')) return <FileTextIcon className="w-4 h-4 text-gray-400" />;
    if (fileName.endsWith('.env')) return <TerminalIcon className="w-4 h-4 text-purple-400" />;
    return <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ width: 250, opacity: 1 }}
      animate={{
        width: isSidebarOpen ? 250 : 0,
        opacity: isSidebarOpen ? 1 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-[#0a0a0a] border-r border-[#333333] overflow-hidden flex flex-col shrink-0"
    >
      <div className="p-4 flex items-center gap-2 border-b border-[#333333] min-w-[250px]">
        <FolderIcon className="w-4 h-4 text-white" />
        <span className="font-mono text-sm font-bold text-white tracking-tight">PRISM-WORKSPACE</span>
      </div>

      <div className="flex-1 py-2 min-w-[250px]">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={clsx(
              'w-full flex items-center gap-2 px-4 py-1.5 text-sm transition-colors font-mono',
              activeFile === file.name
                ? 'bg-white/10 text-white'
                : 'text-[#888888] hover:text-white hover:bg-white/5'
            )}
          >
            {getIcon(file.name)}
            <span>{file.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
