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

describe('HomePage Revamped Suite', () => {
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

  test('renders interactive food menu gallery and handles category filtering', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Initial dishes in gallery
    expect(screen.getByText('Grand Maharaja Thali')).toBeInTheDocument();
    expect(screen.getByText('Smoked Paneer Tikka')).toBeInTheDocument();

    // Filter by Pure Veg
    const vegBtn = screen.getByRole('button', { name: /🌱 Pure Veg/i });
    fireEvent.click(vegBtn);

    expect(screen.getByText('Smoked Paneer Tikka')).toBeInTheDocument();
    expect(screen.queryByText('Tandoori Chicken Supreme')).not.toBeInTheDocument();

    // Return to All Items
    const allBtn = screen.getByRole('button', { name: /All Items/i });
    fireEvent.click(allBtn);
    expect(screen.getByText('Tandoori Chicken Supreme')).toBeInTheDocument();
  });

  test('adds dish to demo cart and displays interactive order pill', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const addButtons = screen.getAllByRole('button', { name: /\+ Add to Order/i });
    fireEvent.click(addButtons[0]);

    // Demo cart active banner
    expect(screen.getByText(/Table 04 Demo Order Active/i)).toBeInTheDocument();
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
