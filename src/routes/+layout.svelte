<script lang="ts">
  import { onMount } from 'svelte'
  import '../app.css'

  const THEME_STORAGE_KEY = 'theme'
  type ThemeValue = 'light' | 'dark'
  type ThemePreference = ThemeValue | 'system'

  let themePreference = $state<ThemePreference>('system')

  const getSystemTheme = (): ThemeValue =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const applyTheme = (theme: ThemeValue) => {
    if (typeof document === 'undefined') {
      return
    }
    document.documentElement.dataset.theme = theme
  }

  const readStoredTheme = (): ThemeValue | null => {
    if (typeof window === 'undefined') {
      return null
    }
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
      return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null
    } catch {
      return null
    }
  }

  const writeStoredTheme = (theme: ThemeValue) => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Fallback to in-memory preference when storage is unavailable.
    }
  }

  const removeStoredTheme = () => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.removeItem(THEME_STORAGE_KEY)
    } catch {
      // Fallback to in-memory preference when storage is unavailable.
    }
  }

  const effectiveTheme = $derived(themePreference === 'system' ? getSystemTheme() : themePreference)

  const toggleTheme = () => {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark'
    themePreference = nextTheme
    writeStoredTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const useSystemTheme = () => {
    themePreference = 'system'
    removeStoredTheme()
    applyTheme(getSystemTheme())
  }

  onMount(() => {
    const storedTheme = readStoredTheme()
    if (storedTheme !== null) {
      themePreference = storedTheme
      applyTheme(storedTheme)
    } else {
      themePreference = 'system'
      applyTheme(getSystemTheme())
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (themePreference === 'system') {
        applyTheme(event.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  })

  let { children } = $props()
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<div class="site-shell">
  <div class="theme-switcher">
    <button
      type="button"
      class="theme-toggle"
      aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={effectiveTheme === 'dark'}
      onclick={toggleTheme}
    >
      {effectiveTheme === 'dark' ? 'Dark mode' : 'Light mode'}
    </button>
    {#if themePreference !== 'system'}
      <button type="button" class="theme-reset" onclick={useSystemTheme}>Use system</button>
    {/if}
  </div>
  <div class="site-glow site-glow-left" aria-hidden="true"></div>
  <div class="site-glow site-glow-right" aria-hidden="true"></div>
  <main id="main-content" class="site-main">
    {@render children()}
  </main>
</div>
