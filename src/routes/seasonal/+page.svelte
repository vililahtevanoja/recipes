<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { getSeasonalMonth, seasonalByMonth, type SeasonalCategory } from '$lib/seasonal'

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
  <header class="panel seasonal-header">
    <a href={resolve('/')} class="back-link">Back to all recipes</a>

    <div class="seasonal-header-main">
      <h1>Seasonal ingredients</h1>
    </div>

    <nav class="seasonal-nav" aria-label="Seasonal month navigation">
      <form method="GET" action={seasonalRoot} class="seasonal-nav-form">
        <input type="hidden" name="month" value={previousMonth} />
        <button type="submit" class="seasonal-month-link" aria-label={`Go to ${previousMonthName}`}>
          ← {previousMonthName}
        </button>
      </form>
      <p class="seasonal-current-month">{monthData.monthNameFi}</p>
      <form method="GET" action={seasonalRoot} class="seasonal-nav-form">
        <input type="hidden" name="month" value={nextMonth} />
        <button type="submit" class="seasonal-month-link" aria-label={`Go to ${nextMonthName}`}>
          {nextMonthName} →
        </button>
      </form>
    </nav>
  </header>

  <div class="seasonal-grid">
    {#each categoryOrder as category (category)}
      {@const ingredients = monthData.categories[category]}
      {#if ingredients.length > 0}
        <section class="panel seasonal-category">
          <h2>{categoryLabels[category]}</h2>
          <ul class="seasonal-ingredients" aria-label={categoryLabels[category]}>
            {#each ingredients as ingredient (ingredient.slug)}
              <li class="seasonal-ingredient">
                <span>{ingredient.labelFi}</span>
                {#if ingredient.domestic}
                  <span
                    class="seasonal-domestic-flag"
                    role="img"
                    aria-label="Finnish seasonal ingredient"
                    title="Finnish seasonal ingredient">🇫🇮</span
                  >
                {/if}
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    {/each}
  </div>
</div>
