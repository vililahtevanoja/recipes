<script lang="ts">
  import type { MarkdownRecipe } from '$lib/server/recipeModel'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  let searchTerm = ''
  let filteredRecipes: MarkdownRecipe[] = []
  const searchRecipes = () => {
    return (filteredRecipes = data.recipes.filter((r) =>
      `${r.title} ${r.metadata.tags.join(' ')}`.toLowerCase().includes(searchTerm.toLowerCase()),
    ))
  }
</script>

<section id="query-section">
  <div id="search-input-cont">
    <input
      type="text"
      id="search-field"
      placeholder="Search recipe names and tags"
      autocomplete="off"
      bind:value={searchTerm}
      on:change={searchRecipes}
    />
  </div>
</section>

<div>
  {#if searchTerm}
    {#each filteredRecipes as recipe}
      <div>
        <a href="/recipes/{recipe.id}" class="no-underline content-center align-middle text-blue-300">
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
        <a href="/recipes/{recipe.id}" class="no-underline content-center align-middle text-blue-300">
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
