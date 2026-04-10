<script lang="ts">
  import { asset, resolve } from '$app/paths'
  import PillButton from '$lib/ui/PillButton.svelte'
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import { marked } from 'marked'
  import { onMount } from 'svelte'
  import { isPlainLeftClick } from '$lib/isPlainLeftClick'
  import { SvelteURLSearchParams } from 'svelte/reactivity'
  import type { PageServerData } from './$types'

  let { data } = $props<{ data: PageServerData }>()

  marked.use({
    extensions: [
      {
        name: 'link',
        renderer({ href, text }) {
          return `<a data-sveltekit-reload href="${href}">${text}</a>`
        },
      },
    ],
  })

  let wakeLock = $state<WakeLockSentinel | undefined>(undefined)
  let wakeLockAvailable = $state(false)

  onMount(() => {
    wakeLockAvailable = typeof navigator !== 'undefined' && 'wakeLock' in navigator
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {})
        wakeLock = undefined
      }
    }
  })

  const toggleWakeLock = async () => {
    if (typeof navigator === 'undefined' || !wakeLockAvailable) {
      return
    }

    if (wakeLock === undefined) {
      wakeLock = await navigator.wakeLock.request('screen')
    } else {
      await wakeLock.release()
      wakeLock = undefined
    }
  }

  const markdownHtml = $derived(marked.parse(data.content))
  const title = $derived(data.title)
  const nutrition = $derived(data.metadata.nutrition)
  const wakeLockEnabled = $derived(wakeLock !== undefined)
  const lockIcon = $derived(wakeLockEnabled ? asset('/toggle_on.svg') : asset('/toggle_off.svg'))
  const wakeLockLabel = $derived(wakeLockEnabled ? 'Screen awake' : 'Keep screen awake')
  const nutritionWithCalories = $derived.by(() => {
    if (!nutrition) {
      return undefined
    }
    return {
      ...nutrition,
      calories: nutrition.protein * 4 + nutrition.carbs * 4 + nutrition.fat * 9,
    }
  })

  const formatNutritionValue = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)

  const navigateBackToRecipes = (event: MouseEvent) => {
    if (!isPlainLeftClick(event)) {
      return
    }

    const cameFromRecipesList = !!page.state?.fromRecipesList
    if (!cameFromRecipesList || window.history.length <= 1) {
      return
    }

    event.preventDefault()
    window.history.back()
  }

  const backToListPath = $derived.by(() => {
    if (!browser) {
      return '/'
    }

    const params = new SvelteURLSearchParams()
    const q = page.url.searchParams.get('q')
    const quick = page.url.searchParams.get('quick')

    if (q) {
      params.set('q', q)
    }
    if (quick) {
      params.set('quick', quick)
    }

    const query = params.toString()
    return query.length > 0 ? `/?${query}` : '/'
  })
</script>

<svelte:head>
  <title>{title} | Personal Recipes</title>
</svelte:head>

<div class="page-wrap recipe-page">
  <nav class="recipe-nav">
    <a href={resolve(backToListPath as '/')} class="back-link-modern" onclick={navigateBackToRecipes}>
      <span class="back-icon">←</span> Back to Collection
    </a>
  </nav>

  <header class="recipe-hero">
    <h1 class="recipe-hero-title">{title}</h1>

    <div class="recipe-meta-actions">
      {#if wakeLockAvailable}
        <PillButton
          class="action-pill"
          active={wakeLockEnabled}
          aria-pressed={wakeLockEnabled}
          onclick={toggleWakeLock}
        >
          <img src={lockIcon} alt="" width="20" height="20" aria-hidden="true" />
          <span>{wakeLockLabel}</span>
        </PillButton>
      {/if}
    </div>
  </header>

  <div class="recipe-container">
    <article class="recipe-content-modern">
      {#if nutritionWithCalories}
        <section class="nutrition-banner" aria-labelledby="nutrition-heading">
          <div class="nutrition-banner-header">
            <h2 id="nutrition-heading">Nutrition</h2>
            <p class="nutrition-note">Per 100g</p>
          </div>

          <div class="nutrition-grid">
            <div class="stat-pill">
              <span class="stat-label">Energy</span>
              <span class="stat-value">{formatNutritionValue(nutritionWithCalories.calories)} <small>kcal</small></span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Protein</span>
              <span class="stat-value">{formatNutritionValue(nutritionWithCalories.protein)} <small>g</small></span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Carbs</span>
              <span class="stat-value">{formatNutritionValue(nutritionWithCalories.carbs)} <small>g</small></span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Fat</span>
              <span class="stat-value">{formatNutritionValue(nutritionWithCalories.fat)} <small>g</small></span>
            </div>
          </div>
        </section>
      {/if}

      <div class="content-wrapper">
        {@html markdownHtml}
      </div>
    </article>
  </div>
</div>

<style>
  .recipe-page {
    gap: 1.5rem;
    padding-bottom: 4rem;
  }

  .recipe-nav {
    margin-bottom: 1rem;
  }

  .back-link-modern {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  .back-link-modern:hover {
    color: var(--accent);
  }

  .recipe-hero {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem 0;
    border-bottom: 2px solid var(--line);
  }

  .recipe-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    color: var(--ink-strong);
    margin: 0;
    line-height: 1.1;
  }

  .recipe-meta-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  :global(.action-pill) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
  }

  .recipe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .nutrition-banner {
    background: var(--surface-alt);
    border-bottom: 1px solid var(--line);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .nutrition-banner-header {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: fit-content;
  }

  .nutrition-banner h2 {
    font-family: var(--font-heading);
    font-size: 1rem;
    margin: 0;
    color: var(--ink-strong);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .nutrition-note {
    font-size: 0.7rem;
    color: var(--muted);
    margin: 0;
  }

  .nutrition-grid {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
    flex: 1;
  }

  .stat-pill {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .stat-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
  }

  .stat-value {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 700;
    color: var(--ink-strong);
  }

  .stat-value small {
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--muted);
    margin-left: 0.1rem;
  }

  .recipe-content-modern {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--line);
    overflow: hidden;
    width: 100%;
    max-width: 800px;
    margin-inline: auto;
  }

  .content-wrapper {
    padding: 2.5rem;
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--ink);
  }

  :global(.content-wrapper h2) {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    color: var(--ink-strong);
    margin: 2.5rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--line);
  }

  :global(.content-wrapper ul, .content-wrapper ol) {
    padding-left: 1.5rem;
    margin: 1.5rem 0;
  }

  :global(.content-wrapper li) {
    margin-bottom: 0.35rem;
  }

  :global(.content-wrapper blockquote) {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    background: var(--surface-alt);
    border-left: 4px solid var(--accent);
    border-radius: 4px;
    font-style: italic;
  }

  :global(.content-wrapper code) {
    font-family: var(--font-mono);
    color: #7a2f1a;
    background: #fff0e6;
    border: 1px solid #f2d3c3;
    border-radius: 6px;
    padding: 0.08rem 0.35rem;
    font-size: 0.9em;
  }

  :global(.content-wrapper pre code) {
    color: inherit;
    background: transparent;
    border: 0;
    padding: 0;
  }

  :global(:root[data-theme='dark'] .content-wrapper code) {
    color: #ffd0b5;
    background: #3a2a24;
    border-color: #6a4b3f;
  }

  @media (max-width: 1000px) {
    .content-wrapper {
      padding: 1.5rem;
    }
  }

  @media (max-width: 700px) {
    .nutrition-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .nutrition-grid {
      justify-content: space-between;
      width: 100%;
      gap: 1rem;
    }

    .stat-pill {
      align-items: flex-start;
      flex: 1;
      min-width: 60px;
    }
  }

  @media (max-width: 600px) {
    .recipe-hero {
      padding: 1rem 0;
    }

    .recipe-hero-title {
      font-size: 2.2rem;
    }
  }
</style>
