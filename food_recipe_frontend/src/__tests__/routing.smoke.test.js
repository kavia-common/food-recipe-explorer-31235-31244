import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('navigates to favorites route', () => {
  render(
    <MemoryRouter initialEntries={['/favorites']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
});
