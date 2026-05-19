import { test, expect } from '@playwright/test';

test.describe('Front-end E2E', () => {
  test('should display the header and non connecté state on the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Non connecté')).toBeVisible();
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('should navigate from connexion to inscription', async ({ page }) => {
    await page.goto('/connexion');
    await expect(page.locator('text=Connexion')).toBeVisible();
    await page.click('text=S’inscrire');
    await expect(page).toHaveURL(/\/inscription/);
    await expect(page.locator('text=Inscription')).toBeVisible();
  });

  test('should submit the login form and store the token in localStorage', async ({ page }) => {
    await page.route('**/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'fake-token' }),
      });
    });

    await page.goto('/connexion');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'secret123');
    await page.click('button:has-text("Se connecter")');

    await expect(page).toHaveURL('/');
    await expect(page.evaluate(() => localStorage.getItem('access_token'))).resolves.toBe('fake-token');
  });

  test('should show an error message when login fails', async ({ page }) => {
    await page.route('**/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Identifiants incorrects.' }),
      });
    });

    await page.goto('/connexion');
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button:has-text("Se connecter")');

    await expect(page.locator('text=Identifiants incorrects.')).toBeVisible();
  });
});
