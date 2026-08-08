import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { GlassCard } from '../components/GlassCard';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Landing } from '../pages/Landing';

describe('Landing', () => {
  it('presents the bedtime habit and registration action', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /go to sleep on time/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /set my goal/i })).toHaveAttribute('href', '/login?mode=register');
    expect(screen.getByRole('region', { name: /how it works/i })).toBeInTheDocument();
  });
});

describe('MobileBottomNav', () => {
  it('renders every primary authenticated route', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('History').closest('a')).toHaveClass('active');
    expect(screen.getByText('Leaderboard').closest('a')).toHaveAttribute('href', '/leaderboard');
    expect(screen.getByText('Badges').closest('a')).toHaveAttribute('href', '/badges');
    expect(screen.getByText('Settings').closest('a')).toHaveAttribute('href', '/settings');
  });
});

describe('GlassCard', () => {
  it('forwards semantic attributes and interactive styling', () => {
    render(
      <GlassCard interactive aria-label="Sleep summary">
        Tonight's progress
      </GlassCard>,
    );

    const card = screen.getByLabelText('Sleep summary');
    expect(card).toHaveClass('glass-card', 'interactive');
    expect(card).toHaveTextContent("Tonight's progress");
  });
});
