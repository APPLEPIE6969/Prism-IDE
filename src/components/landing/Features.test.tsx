import { describe, it, expect, mock } from 'bun:test';
import React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * MOCKING EXTERNAL LIBRARIES
 * We mock these libraries directly in the test file to ensure the tests are
 * deterministic and don't rely on the full environment setup, which can be
 * problematic in CI/CD or restricted environments.
 */

// Mock framer-motion: Replace complex animations with simple div elements
mock.module('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return (props: any) => React.createElement(prop, props);
    }
  })
}));

// Mock lucide-react: Replace icons with SVGs that have data-testids for easy verification
mock.module('lucide-react', () => {
  const mockIcon = (name: string) => (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': name });
  return {
    ZapIcon: mockIcon('ZapIcon'),
    BrainIcon: mockIcon('BrainIcon'),
    DatabaseIcon: mockIcon('DatabaseIcon')
  };
});

// Mock clsx: A simple implementation for the test
mock.module('clsx', () => ({
  clsx: (...args: any[]) => args.filter(Boolean).join(' '),
  default: (...args: any[]) => args.filter(Boolean).join(' ')
}));

import Features from './Features';

describe('Features Component', () => {
  /**
   * We use renderToString for testing this presentational component.
   * This is a lightweight approach that doesn't require a full DOM environment
   * (like JSDOM or Happy DOM), making the tests faster and more portable
   * while still effectively verifying the rendered output structure.
   */
  it('renders all feature cards correctly', () => {
    const html = renderToString(<Features />);

    // Check for titles
    expect(html).toContain('Mistral Autocomplete');
    expect(html).toContain('Groq Speed');
    expect(html).toContain('ChromaDB Memory');

    // Check for descriptions
    expect(html).toContain('Code faster with context-aware suggestions');
    expect(html).toContain('Experience sub-second chat latency');
    expect(html).toContain('Your AI remembers everything');
  });

  it('renders icons for each feature', () => {
    const html = renderToString(<Features />);

    // Verify that our mocked icons are present in the output
    expect(html).toContain('data-testid="ZapIcon"');
    expect(html).toContain('data-testid="BrainIcon"');
    expect(html).toContain('data-testid="DatabaseIcon"');
  });
});
