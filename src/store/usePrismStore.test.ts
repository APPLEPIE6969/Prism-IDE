import { describe, it, expect, beforeEach, beforeAll, mock } from 'bun:test';
import { usePrismStore } from './usePrismStore';

beforeAll(() => {
  // Mock localStorage for Zustand persist
  const store: Record<string, string> = {};
  global.localStorage = {
    getItem: mock((key: string) => store[key] || null),
    setItem: mock((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key in store) {
        delete store[key];
      }
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
});

describe('usePrismStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    usePrismStore.getState().resetWorkspace();
  });

  it('should initialize with default files', () => {
    const state = usePrismStore.getState();
    expect(state.files.length).toBeGreaterThan(0);
    expect(state.activeFile).toBe('main.py');
    expect(state.unsavedFiles).toEqual([]);
  });

  it('should add a file', () => {
    const store = usePrismStore.getState();
    const initialCount = store.files.length;

    store.addFile('test.ts', 'typescript');
    const newState = usePrismStore.getState();

    expect(newState.files.length).toBe(initialCount + 1);
    expect(newState.files.some(f => f.name === 'test.ts')).toBe(true);
    expect(newState.activeFile).toBe('test.ts');
    expect(newState.unsavedFiles).toContain('test.ts');
  });

  it('should not add a file if it already exists', () => {
    const store = usePrismStore.getState();
    const initialCount = store.files.length;

    store.addFile('main.py', 'python');
    const newState = usePrismStore.getState();

    expect(newState.files.length).toBe(initialCount);
  });

  it('should delete a file', () => {
    const store = usePrismStore.getState();
    store.addFile('delete_me.txt', 'plaintext');

    expect(usePrismStore.getState().files.some(f => f.name === 'delete_me.txt')).toBe(true);

    usePrismStore.getState().deleteFile('delete_me.txt');

    expect(usePrismStore.getState().files.some(f => f.name === 'delete_me.txt')).toBe(false);
  });

  it('should update file content and mark as unsaved', () => {
    const store = usePrismStore.getState();
    const fileName = 'main.py';
    const newContent = 'print("Hello, world!")';

    store.updateFileContent(fileName, newContent);
    const newState = usePrismStore.getState();

    const file = newState.files.find(f => f.name === fileName);
    expect(file?.content).toBe(newContent);
    expect(newState.unsavedFiles).toContain(fileName);
  });

  it('should save a file and remove from unsavedFiles', () => {
    const store = usePrismStore.getState();
    const fileName = 'main.py';

    store.markFileDirty(fileName);
    expect(usePrismStore.getState().unsavedFiles).toContain(fileName);

    store.saveFile(fileName);
    expect(usePrismStore.getState().unsavedFiles).not.toContain(fileName);
  });

  it('should reset workspace', () => {
    const store = usePrismStore.getState();
    store.addFile('test_reset.txt', 'plaintext');
    store.updateFileContent('main.py', 'modified content');

    let state = usePrismStore.getState();
    expect(state.files.some(f => f.name === 'test_reset.txt')).toBe(true);
    expect(state.unsavedFiles.length).toBeGreaterThan(0);

    state.resetWorkspace();
    state = usePrismStore.getState();

    expect(state.files.some(f => f.name === 'test_reset.txt')).toBe(false);
    expect(state.unsavedFiles).toEqual([]);
    expect(state.activeFile).toBe('main.py');
  });
});
