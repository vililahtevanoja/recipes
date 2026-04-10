<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import SeasonalTitle from '$lib/SeasonalTitle.svelte'
  import { getSeasonForMonth, getSeasonalMonth, seasonalByMonth, type SeasonalCategory } from '$lib/seasonal'
  import FlagFI from '$lib/ui/FlagFI.svelte'

  const categoryLabels: Record<SeasonalCategory, string> = {
    highlights: 'Kuukauden suositukset',
    fruitsAndBerries: 'Hedelmät ja marjat',
    vegetables: 'Vihannekset',
    rootVegetables: 'Juurekset',
    naturalPlants: 'Luonnonkasvit',
    herbs: 'Yrtit',
    mushrooms: 'Sienet',
  }

  const categoryOrder: SeasonalCategory[] = [
    'fruitsAndBerries',
    'vegetables',
    'rootVegetables',
    'naturalPlants',
    'herbs',
    'mushrooms',
  ]
  const seasonalRoot = resolve('/seasonal')

  const isValidMonth = (value: number): boolean => Number.isInteger(value) && value >= 1 && value <= 12
  const fallbackMonthData = seasonalByMonth[0]

  if (!fallbackMonthData) {
    throw new Error('Seasonal month data is missing')
  }

  const monthQuery = $derived(page.url.searchParams.get('month'))

  const monthFromQuery = $derived.by(() => {
    if (monthQuery === null) {
      return null
    }

    const parsedMonth = Number(monthQuery)
    return isValidMonth(parsedMonth) ? parsedMonth : null
  })

  const currentMonth = $derived(browser ? new Date().getMonth() + 1 : 1)
  const activeMonth = $derived(monthFromQuery ?? currentMonth)
  const monthData = $derived(getSeasonalMonth(activeMonth) ?? fallbackMonthData)
  const seasonalSeason = $derived(getSeasonForMonth(activeMonth))
  const previousMonth = $derived(activeMonth === 1 ? 12 : activeMonth - 1)
  const nextMonth = $derived(activeMonth === 12 ? 1 : activeMonth + 1)
  const previousMonthName = $derived((getSeasonalMonth(previousMonth) ?? fallbackMonthData).monthNameFi)
  const nextMonthName = $derived((getSeasonalMonth(nextMonth) ?? fallbackMonthData).monthNameFi)

  $effect(() => {
    if (!browser) {
      return
    }

    if (monthQuery !== null && monthFromQuery === null) {
      void goto(seasonalRoot, { replaceState: true })
    }
  })
</script>

<svelte:head>
  <title>Seasonal Ingredients | Personal Recipes</title>
  <meta
    name="description"
    content="Browse what ingredients are in season month by month, including Finnish domestic seasonal picks."
  />
</svelte:head>

<div class="page-wrap seasonal-page">
  <header class="seasonal-hero">
    <div class="hero-main">
      <h1 class="hero-title">
        <SeasonalTitle season={seasonalSeason}>
          Seasonal in {monthData.monthNameFi}
        </SeasonalTitle>
      </h1>
      <p class="hero-subtitle">Discover what's fresh and delicious right now.</p>
    </div>

    <nav class="month-picker" aria-label="Select month">
      <form method="GET" action={seasonalRoot} class="nav-form">
        <input type="hidden" name="month" value={previousMonth} />
        <button type="submit" class="nav-arrow" aria-label={`Go to ${previousMonthName}`}>
          <span class="arrow">←</span>
          <span class="nav-month-name">{previousMonthName}</span>
        </button>
      </form>

      <div class="current-month-display">
        <span class="month-num">{activeMonth.toString().padStart(2, '0')}</span>
        <span class="month-name">{monthData.monthNameFi}</span>
      </div>

      <form method="GET" action={seasonalRoot} class="nav-form">
        <input type="hidden" name="month" value={nextMonth} />
        <button type="submit" class="nav-arrow" aria-label={`Go to ${nextMonthName}`}>
          <span class="nav-month-name">{nextMonthName}</span>
          <span class="arrow">→</span>
        </button>
      </form>
    </nav>
  </header>

  <div class="seasonal-content-grid">
    {#each categoryOrder as category (category)}
      {@const ingredients = monthData.categories[category]}
      {#if ingredients.length > 0}
        <section class="category-card">
          <div class="category-header">
            <span class="category-icon">
              {#if category === 'fruitsAndBerries'}🍎{:else if category === 'vegetables'}🥦{:else if category === 'rootVegetables'}🥕{:else if category === 'herbs'}🌿{:else if category === 'mushrooms'}🍄{:else}🍃{/if}
            </span>
            <h2>{categoryLabels[category]}</h2>
          </div>
          <ul class="ingredient-list">
            {#each ingredients as ingredient (ingredient.slug)}
              <li class="ingredient-pill" class:is-domestic={ingredient.domestic}>
                <span class="ingredient-name">{ingredient.labelFi}</span>
                {#if ingredient.domestic}
                  <span role="img" aria-label="Finnish seasonal ingredient" title="Finnish seasonal ingredient">
                    <FlagFI />
                  </span>
                {/if}
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    {/each}
  </div>
</div>

<style>
  .seasonal-page {
    gap: 3rem;
  }

  .seasonal-hero {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding: 2rem 0;
  }

  .hero-title {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.1;
  }

  .hero-subtitle {
    color: var(--muted);
    font-size: 1.1rem;
    margin: 0.5rem 0 0 0;
  }

  .month-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.5rem;
    box-shadow: var(--shadow-soft);
  }

  .nav-form {
    display: flex;
  }

  .nav-arrow {
    background: none;
    border: none;
    padding: 0.5rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--muted);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 999px;
  }

  .nav-arrow:hover {
    color: var(--accent);
    background: var(--surface-alt);
  }

  .current-month-display {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 2rem;
  }

  .month-num {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--accent);
    opacity: 0.5;
  }

  .month-name {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ink-strong);
  }

  .seasonal-content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  .category-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow: var(--shadow-soft);
    transition: transform 0.2s;
  }

  .category-card:hover {
    transform: translateY(-4px);
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.75rem;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .category-card h2 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    margin: 0;
    color: var(--ink-strong);
  }

  .ingredient-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .ingredient-pill {
    background: var(--surface-alt);
    border: 1px solid var(--line);
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--ink);
  }

  .ingredient-pill.is-domestic {
    border-color: #74c0fc;
    background: #e7f5ff;
  }

  :root[data-theme='dark'] .ingredient-pill.is-domestic {
    background: #1864ab22;
    border-color: #1864ab;
    color: #a5d8ff;
  }

  @media (max-width: 800px) {
    .seasonal-hero {
      gap: 1.5rem;
    }

    .month-picker {
      padding: 0.25rem;
    }

    .nav-month-name {
      display: none;
    }

    .current-month-display {
      padding: 0 1rem;
    }

    .month-name {
      font-size: 1.25rem;
    }

    .seasonal-content-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
