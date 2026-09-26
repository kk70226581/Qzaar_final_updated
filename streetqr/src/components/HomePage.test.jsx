import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

jest.mock('framer-motion', () => {
  const React = require('react');
  const element = (tag) => ({
    children,
    className,
    onClick,
    whileInView,
    viewport,
    variants,
    initial,
    animate,
    exit,
    transition,
    ...props
  }) =>
    React.createElement(tag, { className, onClick, ...props }, children);

  return {
    motion: {
      div: element('div'),
      article: element('article'),
      h1: element('h1'),
      h2: element('h2'),
      p: element('p'),
      span: element('span')
    },
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => true
  };
});

describe('HomePage Restaurant OS Suite', () => {
  test('renders hero headline, cta buttons, and real-impact metrics strip', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Hero elements
    expect(screen.getByText(/One scan. Every part of service/i)).toBeInTheDocument();
    const ctaButtons = screen.getAllByText(/Start your workspace/i);
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Explore live demo/i)).toBeInTheDocument();

    // Metrics strip
    expect(screen.getByText('+34%')).toBeInTheDocument();
    expect(screen.getByText('+28%')).toBeInTheDocument();
    expect(screen.getByText('< 1.2s')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('renders the 6 core platform capabilities without any food dishes', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // 6 Platform Capabilities
    expect(screen.getByText('Smart Table QR Ordering')).toBeInTheDocument();
    expect(screen.getByText('Live Kitchen Display (KDS)')).toBeInTheDocument();
    expect(screen.getByText('Dynamic Menu & 86 Engine')).toBeInTheDocument();
    expect(screen.getByText('Thermal KOT & Bill Printing')).toBeInTheDocument();
    expect(screen.getByText('Executive Margin Analytics')).toBeInTheDocument();
    expect(screen.getByText('Multi-Channel Table Payments')).toBeInTheDocument();

    // Verify food catalog items are NOT on the homepage
    expect(screen.queryByText('Royal Dum Biryani')).not.toBeInTheDocument();
    expect(screen.queryByText('Grand Maharaja Thali')).not.toBeInTheDocument();
    expect(screen.queryByText('Smoked Paneer Tikka')).not.toBeInTheDocument();
  });

  test('interacts with table QR code generator sandbox', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Initial table selection
    expect(screen.getByText('Window Section')).toBeInTheDocument();

    // Switch to Table 08
    const table08Btn = screen.getByRole('button', { name: /Table 08/i });
    fireEvent.click(table08Btn);

    expect(screen.getByText('Main Dining Floor')).toBeInTheDocument();
    expect(screen.getByText('https://app.qzaar.in/t/08/menu')).toBeInTheDocument();
  });

  test('renders paper vs qzaar comparison matrix', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Traditional Paper Menus/i)).toBeInTheDocument();
    expect(screen.getByText(/Qzaar Unified Restaurant OS/i)).toBeInTheDocument();
    expect(screen.getByText(/Menu & Price Edits/i)).toBeInTheDocument();
  });

  test('renders hardware ecosystem and manages FAQ accordion state', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Hardware cards
    expect(screen.getByText(/Thermal KOT & Bill Printers/i)).toBeInTheDocument();
    expect(screen.getByText(/Kitchen Tablets & Touch POS/i)).toBeInTheDocument();

    // FAQ first item is open by default
    expect(screen.getByText(/Never. Guests simply point their iPhone or Android camera at the QR code on the table/i)).toBeInTheDocument();

    // Clicking question 2 opens it
    const faqQuestion2 = screen.getByText(/Can we still take orders manually with our regular floor waiters\?/i);
    fireEvent.click(faqQuestion2);

    expect(screen.getByText(/Yes! Qzaar is hybrid-first/i)).toBeInTheDocument();
  });
});
