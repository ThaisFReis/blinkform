import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MagicButton from './MagicButton';

describe('MagicButton', () => {
  it('renders children correctly', () => {
    render(<MagicButton>Get Started</MagicButton>);
    expect(screen.getByText('Get Started')).toBeTruthy();
  });

  it('renders as a button when no href', () => {
    render(<MagicButton>Click me</MagicButton>);
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('renders as a Link when href is provided', () => {
    render(<MagicButton href="/test">Link me</MagicButton>);
    const link = screen.getByRole('link');
    expect(link).toBeTruthy();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MagicButton onClick={handleClick}>Click me</MagicButton>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<MagicButton className="custom-class">Test</MagicButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});