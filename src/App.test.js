import { render, screen } from '@testing-library/react';
import ToDO from './ToDo';

test('renders learn react link', () => {
  render(<ToDO />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
