import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';

test('offers a recovery path for an unknown page', () => {
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /This page is not on the menu/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Back to home/i })).toHaveAttribute('href', '/');
});
