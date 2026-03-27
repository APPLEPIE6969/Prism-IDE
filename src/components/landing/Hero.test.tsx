import { describe, it, expect } from 'bun:test';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Hero from './Hero';

describe('Hero Component', () => {
  it('renders the main headline', () => {
    const html = renderToString(<Hero />);
    expect(html).toContain('Code at the Speed of Thought');
  });

  it('renders the description text', () => {
    const html = renderToString(<Hero />);
    expect(html).toContain('Prism orchestrates Mistral, Groq, and ChromaDB');
  });

  it('renders the CTA button', () => {
    const html = renderToString(<Hero />);
    expect(html).toContain('Launch Workspace');
  });

  it('contains a link to the editor', () => {
    const html = renderToString(<Hero />);
    expect(html).toContain('href="/editor"');
  });
});
