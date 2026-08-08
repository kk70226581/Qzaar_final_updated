import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DemoPage from './components/DemoPage';
import Navbar from './components/Navbar';

jest.mock('framer-motion', () => {
  const React = require('react');
  const element = (tag) => ({ children, className }) => React.createElement(tag, { className }, children);

  return {
    motion: {
      div: element('div'),
      article: element('article'),
    },
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => true,
  };
});

test('publishes a working demo destination from the shared navigation', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const demoLinks = screen.getAllByRole('link', { name: /live demo/i });
  expect(demoLinks[0]).toHaveAttribute('href', '/demo');
});

test('renders the product demo with a working first step', () => {
  render(
    <MemoryRouter>
      <DemoPage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /See the whole restaurant flow/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Start live demo/i })).toHaveAttribute('href', '/modern/menu');
});
