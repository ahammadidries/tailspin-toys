import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Tailspin Toys - Crowdfunding your new favorite game!');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Toys', exact: true })).toBeVisible();
  });

  test('should display the site branding in header', async ({ page }) => {
    await expect(page.getByText('Tailspin Toys').first()).toBeVisible();
  });

  test('should display the welcome message', async ({ page }) => {
    await expect(page.getByText('Find your next game! And maybe even back one! Explore our collection!')).toBeVisible();
  });

  test('should filter the games list by title as the user types', async ({ page }) => {
    const searchInput = page.getByTestId('game-search-input');
    const gamesGrid = page.getByTestId('games-grid');
    const emptyState = page.getByTestId('search-empty-state');

    const getVisibleGameCount = async (): Promise<number> =>
      page.locator('[data-game-title]').evaluateAll((cards) =>
        cards.filter((card) => !card.classList.contains('hidden')).length,
      );

    await expect(searchInput).toBeVisible();
    await expect(gamesGrid).toBeVisible();
    await expect.poll(getVisibleGameCount).toBe(21);

    await searchInput.fill('server');
    await expect.poll(getVisibleGameCount).toBe(2);
    await expect(page.getByRole('link', { name: /server siege/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /virtual server simulator/i })).toBeVisible();
    await expect(emptyState).toBeHidden();

    await searchInput.fill('no-match');
    await expect.poll(getVisibleGameCount).toBe(0);
    await expect(emptyState).toBeVisible();
  });
});
