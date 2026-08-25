import { test, expect } from '@playwright/test'

test('QA Tool loads successfully', async ({ page }) => {
  await page.goto('/', {
    waitUntil: 'domcontentloaded',
  })

  await expect(page).toHaveTitle(/QA|Quality/i)

  await expect(
    page.getByText(/QA Control Center|New Review|Admin Control/i).first(),
  ).toBeVisible({
    timeout: 15_000,
  })

  const googleLogin = page.getByText(
    /Continue as|Continue with Google|Sign in with Google/i,
  )

  const authenticatedPage = page.getByText(
    /New Review|Admin Control|Review History/i,
  )

  const loginVisible = await googleLogin
    .first()
    .isVisible()
    .catch(() => false)

  const appVisible = await authenticatedPage
    .first()
    .isVisible()
    .catch(() => false)

  expect(
    loginVisible || appVisible,
    'Expected either the Google login screen or the authenticated QA app.',
  ).toBeTruthy()
})