<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/state'
  import { resolve } from '$app/paths'
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

  const effectiveTheme = $derived(themePreference === 'system' ? getSystemTheme() : themePreference)

  const toggleTheme = () => {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark'
    themePreference = nextTheme
    writeStoredTheme(nextTheme)
    applyTheme(nextTheme)
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

  const isCurrent = (path: string) => {
    if (path === '/') {
      return page.url.pathname === '/'
    }
    return page.url.pathname.startsWith(path)
  }
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<div class="site-shell">
  <nav class="site-nav" aria-label="Main navigation">
    <div class="nav-content">
      <div class="nav-links">
        <a
          href={resolve('/')}
          class="nav-item"
          class:is-active={isCurrent('/')}
          aria-current={isCurrent('/') ? 'page' : undefined}
        >
          <span class="nav-icon">📖</span>
          <span class="nav-label">Recipes</span>
        </a>
        <a
          href={resolve('/seasonal')}
          class="nav-item"
          class:is-active={isCurrent('/seasonal')}
          aria-current={isCurrent('/seasonal') ? 'page' : undefined}
        >
          <span class="nav-icon">🌿</span>
          <span class="nav-label">Seasonal</span>
        </a>
      </div>

      <div class="nav-actions">
        <button
          type="button"
          class="theme-toggle-minimal"
          aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={effectiveTheme === 'dark'}
          onclick={toggleTheme}
        >
          {effectiveTheme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  </nav>

  <div class="site-glow site-glow-left" aria-hidden="true"></div>
  <div class="site-glow site-glow-right" aria-hidden="true"></div>
  <main id="main-content" class="site-main">
    {@render children()}
  </main>
</div>

<style>
  .site-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
    z-index: 100;
    display: flex;
    justify-content: center;
    padding: 0 1rem;
  }

  :root[data-theme='dark'] .site-nav {
    background: rgba(19, 24, 22, 0.8);
  }

  .nav-content {
    width: 100%;
    max-width: 1100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: flex;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    text-decoration: none;
    color: var(--ink);
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background: var(--surface-alt);
  }

  .nav-item.is-active {
    background: var(--accent);
    color: white;
  }

  .theme-toggle-minimal {
    cursor: pointer;
    background: var(--surface);
    border: 1px solid var(--line);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.2s;
  }

  .theme-toggle-minimal:hover {
    transform: scale(1.05);
    border-color: var(--accent);
  }

  @media (max-width: 800px) {
    .site-nav {
      top: auto;
      bottom: 0;
      height: 64px;
      border-top: 1px solid var(--line);
      border-bottom: none;
      padding: 0 0.5rem;
    }

    .nav-content {
      justify-content: space-around;
    }

    .nav-links {
      flex: 1;
      justify-content: space-around;
      gap: 0;
    }

    .nav-item {
      flex-direction: column;
      gap: 2px;
      padding: 4px 12px;
      font-size: 0.75rem;
    }

    .nav-icon {
      font-size: 1.25rem;
    }

    .nav-actions {
      display: none; /* Hide theme toggle on mobile nav for now or find better place */
    }
  }
</style>
