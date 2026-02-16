<script lang="ts">
  import { resolve } from '$app/paths'
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import type { MarkdownRecipe } from '$lib/server/recipeModel'
  import { onMount } from 'svelte'
  import type { PageServerData, Snapshot } from './$types'
  import RecipeListItem from './RecipeListItem.svelte'

  type LanguageFilter = 'all' | 'fi' | 'en'
  type SearchSnapshot = {
    searchTerm: string
    onlyQuickWeekday: boolean
    languageFilter: LanguageFilter
  }

  let { data } = $props<{ data: PageServerData }>()
  let searchTerm = $state('')
  let onlyQuickWeekday = $state(false)
  let languageFilter = $state<LanguageFilter>('all')

  export const snapshot: Snapshot<SearchSnapshot> = {
    capture: () => ({ searchTerm, onlyQuickWeekday, languageFilter }),
    restore: (value) => {
      searchTerm = value.searchTerm
      onlyQuickWeekday = value.onlyQuickWeekday
      languageFilter = value.languageFilter
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
      const matchesLanguage = languageFilter === 'all' || recipe.metadata.lang === languageFilter

      return matchesQuery && matchesQuickWeekday && matchesLanguage
    })
  })

  const quickWeekdayCount = $derived(recipes.filter(isQuickOrWeekdayRecipe).length)
  const hasActiveFilters = $derived(searchTerm.trim().length > 0 || onlyQuickWeekday || languageFilter !== 'all')

  const clearFilters = () => {
    searchTerm = ''
    onlyQuickWeekday = false
    languageFilter = 'all'
  }
</script>

<svelte:head>
  <title>Recipes | Personal Recipes</title>
  <meta
    name="description"
    content="Search and browse a personal recipe collection by title, tags, speed, and language."
  />
</svelte:head>

<div class="page-wrap home-page">
  <header class="list-summary" aria-label="Recipe collection summary">
    <div class="list-summary-main">
      <h1 class="list-summary-title">Recipes</h1>
      <a href={resolve('/seasonal')} class="summary-link-button">Seasonal ingredients</a>
    </div>
    <div class="list-summary-stats">
      <p class="list-summary-stat">
        <span>{recipes.length}</span>
        recipes
      </p>
      <p class="list-summary-stat">
        <span>{quickWeekdayCount}</span>
        quick or weekday
      </p>
    </div>
  </header>

  <section class="panel filter-panel" aria-label="Recipe filters">
    <div class="search-block">
      <label for="search-field">Search by title or tag</label>
      <input
        type="search"
        id="search-field"
        placeholder="Try: soup, chicken, pasta, quick"
        autocomplete="off"
        spellcheck="false"
        bind:value={searchTerm}
      />
    </div>

    <div class="filter-controls">
      <div class="button-group" role="group" aria-label="Filter by language">
        <button
          type="button"
          class="filter-button"
          class:is-active={languageFilter === 'all'}
          onclick={() => (languageFilter = 'all')}
        >
          All
        </button>
        <button
          type="button"
          class="filter-button"
          class:is-active={languageFilter === 'fi'}
          onclick={() => (languageFilter = 'fi')}
        >
          Finnish
        </button>
        <button
          type="button"
          class="filter-button"
          class:is-active={languageFilter === 'en'}
          onclick={() => (languageFilter = 'en')}
        >
          English
        </button>
      </div>

      <button
        type="button"
        class="filter-button"
        class:is-active={onlyQuickWeekday}
        aria-pressed={onlyQuickWeekday}
        onclick={() => (onlyQuickWeekday = !onlyQuickWeekday)}
      >
        Quick and weekday
      </button>

      {#if hasActiveFilters}
        <button type="button" class="text-button" onclick={clearFilters}>Clear filters</button>
      {/if}
    </div>
  </section>

  <section class="panel results-panel" aria-live="polite">
    <div class="results-header">
      <h2>Recipes</h2>
      <p>
        Showing {filteredRecipes.length} of {recipes.length}
      </p>
    </div>

    {#if filteredRecipes.length === 0}
      <p class="empty-state">No recipes matched your filters. Try broadening the search.</p>
    {:else}
      <ul class="recipe-grid">
        {#each filteredRecipes as recipe (recipe.id)}
          <li>
            <RecipeListItem
              recipeId={recipe.id}
              title={recipe.title}
              lang={recipe.metadata.lang ?? 'fi'}
              tags={recipe.metadata.tags}
            />
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
