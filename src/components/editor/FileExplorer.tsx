'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrismStore } from '@/store/usePrismStore';
import { FileIcon, FolderIcon, FileTextIcon, TerminalIcon, PlusIcon, Trash2Icon, RefreshCwIcon } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function FileExplorer() {
  const { files, activeFile, setActiveFile, isSidebarOpen, addFile, deleteFile, unsavedFiles, resetWorkspace } = usePrismStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const getIcon = (fileName: string) => {
    if (fileName.endsWith('.py')) return <FileIcon className="w-4 h-4 text-yellow-500" />;
    if (fileName.endsWith('.js') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return <FileIcon className="w-4 h-4 text-blue-400" />;
    if (fileName.endsWith('.txt')) return <FileTextIcon className="w-4 h-4 text-gray-400" />;
    if (fileName.endsWith('.env')) return <TerminalIcon className="w-4 h-4 text-purple-400" />;
    return <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
        setIsCreating(false);
        return;
    }

    if (files.some(f => f.name === newFileName)) {
        toast.error('File already exists');
        return;
    }

    const language = newFileName.endsWith('.py') ? 'python' : 'plaintext'; // Simple detection
    addFile(newFileName, language);
    setNewFileName('');
    setIsCreating(false);
    toast.success('File created');
  };

  const handleDelete = (e: React.MouseEvent, fileName: string) => {
      e.stopPropagation();
      if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
          deleteFile(fileName);
          toast.success('File deleted');
      }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workspace? All unsaved changes and new files will be lost.')) {
        resetWorkspace();
        toast.success('Workspace reset to default');
    }
  };

  return (
    <motion.div
      initial={{ width: 250, opacity: 1 }}
      animate={{
        width: isSidebarOpen ? 250 : 0,
        opacity: isSidebarOpen ? 1 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-[#0a0a0a] border-r border-[#333333] overflow-hidden flex flex-col shrink-0 group/sidebar"
    >
      <div className="p-4 flex items-center justify-between border-b border-[#333333] min-w-[250px]">
        <div className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4 text-white" />
            <span className="font-mono text-sm font-bold text-white tracking-tight">WORKSPACE</span>
        </div>
        <div className="flex items-center gap-1">
            <button
                onClick={handleReset}
                className="p-1 hover:bg-[#333333] rounded text-[#888888] hover:text-white transition-colors"
                title="Reset Workspace"
            >
                <RefreshCwIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setIsCreating(true)}
                className="p-1 hover:bg-[#333333] rounded text-[#888888] hover:text-white transition-colors"
                title="New File"
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="flex-1 py-2 min-w-[250px] overflow-y-auto custom-scrollbar">
        {isCreating && (
            <div className="px-4 py-1.5 flex items-center gap-2">
                <FileIcon className="w-4 h-4 text-gray-500" />
                <form onSubmit={handleCreateFile} className="flex-1">
                    <input
                        autoFocus
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onBlur={() => { if(!newFileName) setIsCreating(false); }}
                        className="w-full bg-[#111111] border border-[#333333] text-white text-sm px-1 py-0.5 rounded focus:outline-none focus:border-white/20 font-mono"
                        placeholder="filename.py"
                    />
                </form>
            </div>
        )}

        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={clsx(
              'w-full flex items-center gap-2 px-4 py-1.5 text-sm transition-colors font-mono group/file relative',
              activeFile === file.name
                ? 'bg-white/10 text-white'
                : 'text-[#888888] hover:text-white hover:bg-white/5'
            )}
          >
            {getIcon(file.name)}
            <span className="truncate flex-1 text-left">{file.name}</span>

            {unsavedFiles.includes(file.name) && (
                <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" title="Unsaved changes" />
            )}

            <div
                onClick={(e) => handleDelete(e, file.name)}
                className="opacity-0 group-hover/file:opacity-100 p-1 hover:bg-white/20 rounded transition-opacity absolute right-2 bg-[#0a0a0a]/80 backdrop-blur-sm"
            >
                <Trash2Icon className="w-3 h-3 text-red-400" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
