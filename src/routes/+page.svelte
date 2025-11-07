<script lang="ts">
  import type { MarkdownRecipe } from '$lib/server/recipeModel'
  import type { PageServerData } from './$types'
  import RecipeListItem from './RecipeListItem.svelte'
  import { browser } from '$app/environment'
  import { page } from '$app/state'

  export let data: PageServerData
  let searchTerm: string = ''
  let filteredRecipes: MarkdownRecipe[] = []
  let onlyQuickWeekday: boolean = false
  // with old Next.js-based frontend the routing for recipes in GitHub Pages was
  // ...github.io/recipes/<recipe-slug> but with SvelteKit (for now at least) it is
  // ...github.io/recipes/recipes/<recipe-slug>
  // this function attempts to redirect old links to the correct path with containing two recipes-components in path
  // TODO: does not work, e.g. /recipes/juustosampylat
  const handleRoutingForOldLinks = () => {
    if (browser && page.url.hostname.includes('github')) {
      // running in GitHub Pages
      const pathComponents = page.url.pathname.split('/').filter((pc) => pc.length > 0)
      if (pathComponents.length <= 1) {
        // noop
        return
      }
      const hasOnlyOneRecipesComponentInPath = pathComponents.filter((pc) => pc === 'recipes').length === 1
      const recipesPathComponentIndex = pathComponents.indexOf('recipes')
      const notInRecipesRoot = recipesPathComponentIndex !== pathComponents.length - 1
      if (hasOnlyOneRecipesComponentInPath && notInRecipesRoot) {
        const newComponents = pathComponents.splice(recipesPathComponentIndex, 0, 'recipes')
        const newPath = `/${newComponents.join('/')}`
        console.log(`Redirecting ${page.url.pathname} to ${newPath}`)
        window.location.href = newPath
      }
    }
  }
  handleRoutingForOldLinks()
  const filterRecipes = () => {
    const filtered = data.recipes
      .filter((r) => `${r.title} ${JSON.stringify(r.metadata.tags)}`.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((r) => (onlyQuickWeekday ? r.metadata.tags.some((t) => t === 'quick' || t === 'weekday') : true))
    console.log(`Was: ${data.recipes.length} is: ${filtered.length}`)
    return (filteredRecipes = filtered)
  }
  
  const toggleQuickWeekdayFilter = () => {
    onlyQuickWeekday = !onlyQuickWeekday
    console.log(`onlyQuickWeekday=${onlyQuickWeekday}`)
    filterRecipes()
    return (onlyQuickWeekday = onlyQuickWeekday)
  }
</script>

<svelte:head>
  <title>Recipes</title>
</svelte:head>

<section class="flex flex-row" id="query-section">
  <div id="search-input-div">
    <input
      type="text"
      id="search-field"
      placeholder="Search recipe names and tags"
      autocomplete="off"
      bind:value={searchTerm}
      on:change={() => filterRecipes()}
      on:input={() => filterRecipes()}
    />
  </div>
  <div id="quick-weekday-button-container">
    <button
      type="button"
      id={onlyQuickWeekday ? 'quick-weekday-filter-button-toggled' : 'quick-weekday-filter-button-untoggled'}
      on:click={() => toggleQuickWeekdayFilter()}>Quick/weekday</button
    >
  </div>
</section>

<div>
  {#if searchTerm || onlyQuickWeekday}
    {#each filteredRecipes as recipe (recipe.id)}
      <RecipeListItem
        recipeId={recipe.id}
        title={recipe.title}
        lang={recipe.metadata.lang ?? 'fi'}
        tags={recipe.metadata.tags}
      />
    {/each}
  {:else}
    {#each data.recipes as recipe (recipe.id)}
      <RecipeListItem
        recipeId={recipe.id}
        title={recipe.title}
        lang={recipe.metadata.lang ?? 'fi'}
        tags={recipe.metadata.tags}
      />
    {/each}
  {/if}
</div>

<style>
  #query-section {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  #search-input-div {
    width: 40%;
    display: flex;
    align-items: center;
    margin: 0 0 0 10px;
    margin-bottom: 15px;
  }

  #search-field {
    width: 100%;
    font-size: 1rem;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 8px;
    margin: 0 10px 0;
  }

  #quick-weekday-button-container {
    height: 100%;
    width: 40%;
    display: flex;
    align-items: center;
  }

  #quick-weekday-filter-button-untoggled {
    font-size: 1.5rem;
    border-radius: 7px;
    background-color: black;
    color: #a78bfa;
    border-color: #a78bfa;
  }

  #quick-weekday-filter-button-toggled {
    font-size: 1.5rem;
    border-radius: 7px;
    background-color: #a78bfa;
    color: #ffffff;
    border-color: #a78bfa;
  }
</style>
