import { describe, it, expect, beforeEach, mock } from 'bun:test';

// Mock zustand before importing usePrismStore
mock.module('zustand', () => ({
  create: (fn: any) => {
    // If it's the version with middleware (curried)
    if (typeof fn !== 'function') {
      return (realFn: any) => createStore(realFn);
    }
    return createStore(fn);
  }
}));

mock.module('zustand/middleware', () => ({
  persist: (config: any) => (set: any, get: any, api: any) => config(set, get, api)
}));

function createStore(fn: any) {
  let state: any;
  const setState = (partial: any) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...nextState };
  };
  const getState = () => state;
  const api = { setState, getState };
  state = fn(setState, getState, api);
  return api;
}

// Now we can import usePrismStore
import { usePrismStore } from './usePrismStore';

describe('usePrismStore (Mocked Zustand)', () => {
  beforeEach(() => {
    usePrismStore.getState().resetWorkspace();
  });

  describe('addFile', () => {
    it('should add a new file successfully', () => {
      const fileName = 'test.py';
      const language = 'python';

      usePrismStore.getState().addFile(fileName, language);

      const state = usePrismStore.getState();
      const file = state.files.find((f: any) => f.name === fileName);

      expect(file).toBeDefined();
      expect(file?.name).toBe(fileName);
      expect(file?.language).toBe(language);
      expect(state.activeFile).toBe(fileName);
      expect(state.unsavedFiles).toContain(fileName);
    });

    it('should not add a file if the name already exists', () => {
      const fileName = 'main.py';
      const language = 'python';
      const initialState = usePrismStore.getState();
      const initialFileCount = initialState.files.length;

      usePrismStore.getState().addFile(fileName, language);

      const state = usePrismStore.getState();
      expect(state.files.length).toBe(initialFileCount);

      const otherExistingFile = 'memory.py';
      usePrismStore.getState().setActiveFile('main.py');
      usePrismStore.getState().addFile(otherExistingFile, 'python');

      const state2 = usePrismStore.getState();
      expect(state2.files.length).toBe(initialFileCount);
      expect(state2.activeFile).toBe('main.py');
    });
  });
});
