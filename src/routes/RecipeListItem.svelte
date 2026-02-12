<script lang="ts">
  import { resolve } from '$app/paths'

  let { recipeId, lang, title, tags } = $props<{
    recipeId: string
    lang: string
    title: string
    tags: string[]
  }>()

  const isTestedTag = (tag: string) => tag.trim().toLowerCase() === 'tested'
  const hasTestedTag = $derived(tags.some((tag: string) => isTestedTag(tag)))
  const displayTags = $derived(tags.filter((tag: string) => !isTestedTag(tag)))
  const compactTags = $derived(displayTags.length >= 5)
  const denseTags = $derived(displayTags.length >= 8)
  const languageCode = $derived(lang.toLowerCase() === 'fi' ? 'fi' : 'en')
  const languageLabel = $derived(lang.toLowerCase() === 'fi' ? 'Finnish' : 'English')
</script>

<article class="recipe-card">
  <a href={resolve(`/recipes/${recipeId}`)} class="recipe-link">
    <h3>{title}</h3>

    {#if displayTags.length > 0}
      <ul
        class="tag-list"
        class:tag-list-compact={compactTags}
        class:tag-list-dense={denseTags}
        aria-label="Recipe tags"
      >
        {#each displayTags as tag, index (`${tag}-${index}`)}
          <li>{tag}</li>
        {/each}
      </ul>
    {/if}

    {#if hasTestedTag}
      <span class="tested-checkmark tested-checkmark-corner" role="img" aria-label="Tested recipe">✓</span>
    {/if}

    <span class="language-flag language-flag-corner" data-lang={languageCode} role="img" aria-label={languageLabel}
    ></span>
  </a>
</article>
