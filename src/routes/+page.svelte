<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import type { MarkdownRecipe } from '$lib/server/recipeModel'
  import { onMount } from 'svelte'
  import { SvelteURLSearchParams } from 'svelte/reactivity'
  import type { PageServerData, Snapshot } from './$types'
  import PillButton from '$lib/ui/PillButton.svelte'
  import RecipeListItem from './RecipeListItem.svelte'

  type SearchSnapshot = {
    searchTerm: string
    onlyQuickWeekday: boolean
  }

  let { data } = $props<{ data: PageServerData }>()
  let searchTerm = $state('')
  let onlyQuickWeekday = $state(false)

  export const snapshot: Snapshot<SearchSnapshot> = {
    capture: () => ({ searchTerm, onlyQuickWeekday }),
    restore: (value) => {
      searchTerm = value.searchTerm
      onlyQuickWeekday = value.onlyQuickWeekday
    },
  }

  const handleRoutingForOldLinks = () => {
    if (!browser || !page.url.hostname.includes('github')) {
      return
    }

    const pathComponents = page.url.pathname.split('/').filter((component) => component.length > 0)
    if (pathComponents.length <= 1) {
      return
    }

    const recipesPathCount = pathComponents.filter((component) => component === 'recipes').length
    const recipesPathIndex = pathComponents.indexOf('recipes')
    const notInRecipesRoot = recipesPathIndex !== pathComponents.length - 1

    if (recipesPathCount === 1 && recipesPathIndex >= 0 && notInRecipesRoot) {
      const updatedPathComponents = [...pathComponents]
      updatedPathComponents.splice(recipesPathIndex, 0, 'recipes')
      const newPath = `/${updatedPathComponents.join('/')}`

      if (newPath !== page.url.pathname) {
        window.location.replace(newPath)
      }
    }
  }

  onMount(() => {
    handleRoutingForOldLinks()
    const q = page.url.searchParams.get('q')
    const quick = page.url.searchParams.get('quick')

    if (q !== null) {
      searchTerm = q
    }
    if (quick !== null) {
      onlyQuickWeekday = quick === '1' || quick.toLowerCase() === 'true'
    }
  })

  const isQuickOrWeekdayRecipe = (recipe: MarkdownRecipe) =>
    recipe.metadata.tags.some((tag) => {
      const normalizedTag = tag.toLowerCase()
      return normalizedTag === 'quick' || normalizedTag === 'weekday'
    })

  const recipes = $derived.by(() => [...data.recipes].sort((a, b) => a.title.localeCompare(b.title, 'fi')))

  const filteredRecipes = $derived.by(() => {
    const query = searchTerm.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const recipeText = `${recipe.title} ${recipe.metadata.tags.join(' ')}`.toLowerCase()
      const matchesQuery = query.length === 0 || recipeText.includes(query)
      const matchesQuickWeekday = !onlyQuickWeekday || isQuickOrWeekdayRecipe(recipe)

      return matchesQuery && matchesQuickWeekday
    })
  })

  const quickWeekdayCount = $derived(recipes.filter(isQuickOrWeekdayRecipe).length)
  const hasActiveFilters = $derived(searchTerm.trim().length > 0 || onlyQuickWeekday)

  const clearFilters = () => {
    searchTerm = ''
    onlyQuickWeekday = false
  }

  const recipesListQuery = $derived.by(() => {
    const params = new SvelteURLSearchParams()
    const trimmedSearch = searchTerm.trim()
    if (trimmedSearch.length > 0) {
      params.set('q', trimmedSearch)
    }
    if (onlyQuickWeekday) {
      params.set('quick', '1')
    }
    return params.toString()
  })
</script>

<svelte:head>
  <title>Recipes | Personal Recipes</title>
  <meta
    name="description"
    content="Search and browse a personal recipe collection by title, tags, speed, and language."
  />
</svelte:head>

<div class="page-wrap home-page">
  <header class="list-hero" aria-label="Recipe collection summary">
    <div class="hero-content">
      <h1 class="hero-title">Recipes</h1>
    </div>
    <div class="hero-stats">
      <div class="stat-badge">
        <span class="stat-value">{recipes.length}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-badge">
        <span class="stat-value">{quickWeekdayCount}</span>
        <span class="stat-label">Quick</span>
      </div>
    </div>
  </header>

  <section class="filter-section" aria-label="Recipe filters">
    <div class="search-container">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="search"
          id="search-field"
          aria-label="Search recipes by title, ingredient or tag"
          placeholder="Search by title, ingredient or tag..."
          autocomplete="off"
          spellcheck="false"
          bind:value={searchTerm}
        />
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <PillButton
          class="filter-button"
          active={onlyQuickWeekday}
          onclick={() => (onlyQuickWeekday = !onlyQuickWeekday)}
        >
          {onlyQuickWeekday ? '🌟 Quick & Weekday' : '⚡ Quick & Weekday'}
        </PillButton>
      </div>
    </div>
  </section>

  <section class="results-section" aria-live="polite">
    <div class="results-info">
      <h2 class="results-title">
        {#if hasActiveFilters}
          Found {filteredRecipes.length} recipes
        {:else}
          All Recipes
        {/if}
      </h2>
    </div>

    {#if filteredRecipes.length === 0}
      <div class="empty-state-card">
        <span class="empty-icon">🍳</span>
        <h3>No recipes found</h3>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
        <button class="primary-button" onclick={clearFilters}>View all recipes</button>
      </div>
    {:else}
      <ul class="recipe-grid" class:is-searching={searchTerm.trim().length > 0}>
        {#each filteredRecipes as recipe (recipe.id)}
          <li>
            <RecipeListItem
              recipeId={recipe.id}
              title={recipe.title}
              lang={recipe.metadata.lang ?? 'fi'}
              tags={recipe.metadata.tags}
              backQuery={recipesListQuery}
              compact={searchTerm.trim().length > 0}
            />
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>

<style>
  .home-page {
    gap: 0.75rem;
  }

  .recipe-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .recipe-grid.is-searching {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 600px) {
    .recipe-grid.is-searching {
      grid-template-columns: 1fr;
    }
  }

  .list-hero {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0.5rem 0;
    gap: 1rem;
  }

  .hero-title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3.5vw, 2.25rem);
    color: var(--ink-strong);
    margin: 0;
    line-height: 1.1;
  }

  .hero-stats {
    display: flex;
    gap: 0.5rem;
    margin-left: 0.5rem;
  }

  .stat-badge {
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--shadow-soft);
  }

  .stat-value {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
  }

  .stat-label {
    font-size: 0.65rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-section {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    padding: 0.75rem;
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-input-wrapper input {
    width: 100%;
    padding: 0.65rem 1rem 0.65rem 2.5rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: var(--surface-alt);
    transition: all 0.2s;
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
  }

  .results-info {
    margin-bottom: 0.75rem;
  }

  .results-title {
    font-family: var(--font-heading);
    font-size: 1.15rem;
    color: var(--ink-strong);
    margin: 0;
  }

  @media (max-width: 800px) {
    .list-hero {
      justify-content: space-between;
      padding: 0.25rem 0 0.5rem 0;
      gap: 0.75rem;
    }

    .hero-stats {
      margin-left: 0;
    }

    .stat-badge {
      padding: 0.3rem 0.6rem;
    }

    .filter-section {
      padding: 0.75rem;
    }

    .filter-bar {
      gap: 0.75rem;
    }
  }
</style>
