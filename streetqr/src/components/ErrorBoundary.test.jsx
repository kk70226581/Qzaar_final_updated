import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws intentionally
const ProblemChild = () => {
  throw new Error('Test rendering crash');
};

test('ErrorBoundary renders fallback UI when a child component crashes', () => {
  // Suppress console.error during expected test error
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ProblemChild />
    </ErrorBoundary>
  );

  expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Return Home/i })).toBeInTheDocument();

  spy.mockRestore();
});

test('ErrorBoundary renders children normally when there is no error', () => {
  render(
    <ErrorBoundary>
      <div>Normal App Content</div>
    </ErrorBoundary>
  );

  expect(screen.getByText('Normal App Content')).toBeInTheDocument();
});
