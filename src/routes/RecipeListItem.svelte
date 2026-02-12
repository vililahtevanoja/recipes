<script lang="ts">
  import { resolve } from '$app/paths'

  let { recipeId, lang, title, tags } = $props<{
    recipeId: string
    lang: string
    title: string
    tags: string[]
  }>()

  const languageLabel = $derived(lang.toLowerCase() === 'fi' ? 'Finnish' : 'English')
</script>

<article class="recipe-card">
  <a href={resolve(`/recipes/${recipeId}`)} class="recipe-link">
    <div class="recipe-card-top">
      <span class="language-pill">{languageLabel}</span>
      <span class="open-recipe-label">Open recipe</span>
    </div>

    <h3>{title}</h3>

    {#if tags.length > 0}
      <ul class="tag-list" aria-label="Recipe tags">
        {#each tags as tag, index (`${tag}-${index}`)}
          <li>{tag}</li>
        {/each}
      </ul>
    {/if}
  </a>
</article>
