import { render, screen } from '@testing-library/react';
import CustomInfoWindow from '../../components/CustomInfoWindow';

test('renders CustomInfoWindow with title, description, walking info and button', () => {
  const title = 'Test Bar';
  const description = 'Test location';
  const walkingInfo = '<a href="https://example.com" target="_blank" rel="noopener noreferrer">5 min walk</a>';
  render(
    <CustomInfoWindow
      title={title}
      description={description}
      buttonText="Információ"
      buttonLink="/bar/123"
      walkingInfo={walkingInfo}
    />
  );
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(screen.getByText('Információ')).toBeInTheDocument();
  // walkingInfo rendered as HTML
  const link = screen.getByRole('link', { name: /5 min walk/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', 'https://example.com');
});
