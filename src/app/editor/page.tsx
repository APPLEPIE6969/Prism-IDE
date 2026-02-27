'use client';

import dynamic from 'next/dynamic';

const FileExplorer = dynamic(() => import('@/components/editor/FileExplorer'), { ssr: false });
const EditorPane = dynamic(() => import('@/components/editor/EditorPane'), { ssr: false });
const AIChat = dynamic(() => import('@/components/editor/AIChat'), { ssr: false });

export default function EditorPage() {
  return (
    <div className="h-screen w-screen bg-black flex overflow-hidden font-sans text-white selection:bg-white/20">
      <FileExplorer />

      <div className="flex-1 flex flex-row h-full min-w-0">
        <div className="flex-1 h-full relative min-w-0">
           <EditorPane />
        </div>

        <div className="w-[30%] min-w-[320px] max-w-[450px] h-full shrink-0">
           <AIChat />
        </div>
      </div>
    </div>
  );
}
