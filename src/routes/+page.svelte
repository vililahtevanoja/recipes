<script lang="ts">
  import type { MarkdownRecipe } from '$lib/server/recipeModel'
  import type { PageServerData } from './$types'
  import { base } from '$app/paths'
  import RecipeListItem from './RecipeListItem.svelte'

  export let data: PageServerData
  let searchTerm: string = ''
  let filteredRecipes: MarkdownRecipe[] = []
  let onlyQuickWeekday: boolean = false
  const filterRecipes = () => {
    const filtered = data.recipes
      .filter((r) => `${r.title} ${JSON.stringify(r.metadata.tags)}`.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((r) => (onlyQuickWeekday ? r.metadata.tags.some((t) => t === 'quick' || t === 'weekday') : true))
    console.log(`Was: ${data.recipes.length} is: ${filtered.length}`)
    return (filteredRecipes = filtered)
  }
  const getRecipeHref = (recipeId: string): string => {
    return `${base}/recipes/${recipeId}`
  }
  const toggleQuickWeekdayFilter = () => {
    onlyQuickWeekday = !onlyQuickWeekday
    console.log(`onlyQuickWeekday=${onlyQuickWeekday}`)
    filterRecipes()
    return (onlyQuickWeekday = onlyQuickWeekday)
  }
</script>

<section id="query-section">
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
    <button type="button" id="quick-weekday-filter-button" on:click={() => toggleQuickWeekdayFilter()}
      >Quick/weekday</button
    >
  </div>
</section>

<div>
  {#if searchTerm || onlyQuickWeekday}
    {#each filteredRecipes as recipe}
      <RecipeListItem
        href={getRecipeHref(recipe.id)}
        title={recipe.title}
        lang={recipe.metadata.lang ?? 'fi'}
        tags={recipe.metadata.tags}
      />
    {/each}
  {:else}
    {#each data.recipes as recipe}
      <RecipeListItem
        href={getRecipeHref(recipe.id)}
        title={recipe.title}
        lang={recipe.metadata.lang ?? 'fi'}
        tags={recipe.metadata.tags}
      />
    {/each}
  {/if}
</div>

<style>
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
</style>
