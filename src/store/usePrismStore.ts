import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface File {
  name: string;
  language: string;
  content: string;
}

interface PrismState {
  // File Explorer State
  files: File[];
  activeFile: string | null;
  unsavedFiles: string[];
  setActiveFile: (fileName: string) => void;
  updateFileContent: (fileName: string, content: string) => void;
  addFile: (name: string, language: string) => void;
  deleteFile: (name: string) => void;
  markFileDirty: (name: string) => void;
  saveFile: (name: string) => void;

  // Editor State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // Chat State
  chatMessages: ChatMessage[];
  isGenerating: boolean;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  setIsGenerating: (isGenerating: boolean) => void;

  // Actions
  resetWorkspace: () => void;
}

const DEFAULT_FILES: File[] = [
  {
    name: 'main.py',
    language: 'python',
    content: `import os
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    # TODO: Implement LLM logic here
    return {"response": "Hello from Prism AI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`
  },
  {
    name: 'memory.py',
    language: 'python',
    content: `import chromadb

client = chromadb.Client()
collection = client.create_collection("chat_history")

def store_memory(text: str):
    collection.add(documents=[text], ids=[str(hash(text))])

def retrieve_memory(query: str):
    results = collection.query(query_texts=[query], n_results=1)
    return results
`
  },
  {
    name: 'requirements.txt',
    language: 'plaintext',
    content: `fastapi
uvicorn
chromadb
pydantic
`
  },
  {
    name: '.env',
    language: 'plaintext',
    content: `OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
`
  }
];

export const usePrismStore = create<PrismState>()(
  persist(
    (set) => ({
      files: DEFAULT_FILES,
      activeFile: 'main.py',
      unsavedFiles: [],
      setActiveFile: (fileName) => set({ activeFile: fileName }),
      updateFileContent: (fileName, content) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.name === fileName ? { ...f, content } : f
          ),
          unsavedFiles: state.unsavedFiles.includes(fileName)
            ? state.unsavedFiles
            : [...state.unsavedFiles, fileName],
        })),
      addFile: (name, language) =>
        set((state) => {
          if (state.files.some((f) => f.name === name)) return state;
          return {
            files: [...state.files, { name, language, content: '' }],
            activeFile: name,
            unsavedFiles: [...state.unsavedFiles, name]
          };
        }),
      deleteFile: (name) =>
        set((state) => ({
          files: state.files.filter((f) => f.name !== name),
          activeFile: state.activeFile === name ? null : state.activeFile,
          unsavedFiles: state.unsavedFiles.filter((f) => f !== name),
        })),
      markFileDirty: (name) =>
        set((state) => ({
          unsavedFiles: state.unsavedFiles.includes(name)
            ? state.unsavedFiles
            : [...state.unsavedFiles, name],
        })),
      saveFile: (name) =>
        set((state) => ({
          unsavedFiles: state.unsavedFiles.filter((f) => f !== name),
        })),
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      chatMessages: [
        { id: '1', role: 'assistant', content: 'Welcome to Prism. How can I help you code today?' }
      ],
      isGenerating: false,
      addMessage: (msg) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            { ...msg, id: Math.random().toString(36).substring(7) },
          ],
        })),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      resetWorkspace: () =>
        set({
          files: DEFAULT_FILES,
          activeFile: 'main.py',
          unsavedFiles: [],
          chatMessages: [
            { id: '1', role: 'assistant', content: 'Welcome to Prism. How can I help you code today?' }
          ],
          isGenerating: false,
        }),
    }),
    {
      name: 'prism-storage',
    }
  )
);
