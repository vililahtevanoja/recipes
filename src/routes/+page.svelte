<script lang="ts">
  import type { MarkdownRecipe } from '$lib/server/recipeModel'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  let searchTerm = ''
  let filteredRecipes: MarkdownRecipe[] = []
  const searchRecipes = () => {
    const filtered = data.recipes.filter((r) =>
      `${r.title} ${JSON.stringify(r.metadata.tags)}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    return (filteredRecipes = filtered)
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
      on:change={searchRecipes}
      on:input={searchRecipes}
    />
  </div>
</section>

<div>
  {#if searchTerm}
    {#each filteredRecipes as recipe}
      <div>
        <a href={`/${recipe.id}`} class="no-underline content-center align-middle text-blue-300">
          <div class={`flex mb-4`}>
            <div class="w-1/12 text-xl content-top">{recipe.metadata.lang?.toLowerCase() === 'fi' ? '🇫🇮' : '🇬🇧'}</div>
            <div class="w-6/12 grow align-middle">{recipe.title}</div>
            <div class="w-4/12 align-middle">{recipe.metadata.tags}</div>
          </div>
        </a>
      </div>
    {/each}
  {:else}
    {#each data.recipes as recipe}
      <div>
        <a href={`/${recipe.id}`} class="no-underline content-center align-middle text-blue-300">
          <div class={`flex mb-4`}>
            <div class="w-1/12 text-xl content-top">{recipe.metadata.lang?.toLowerCase() === 'fi' ? '🇫🇮' : '🇬🇧'}</div>
            <div class="w-6/12 grow align-middle">{recipe.title}</div>
            <div class="w-4/12 align-middle">{recipe.metadata.tags}</div>
          </div>
        </a>
      </div>
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
