<script lang="ts">
  import { resolve } from '$app/paths'
  import { goto } from '$app/navigation'
  import { isPlainLeftClick } from '$lib/isPlainLeftClick'

  let { recipeId, lang, title, tags, backQuery } = $props<{
    recipeId: string
    lang: string
    title: string
    tags: string[]
    backQuery?: string
  }>()

  const isTestedTag = (tag: string) => tag.trim().toLowerCase() === 'tested'
  const hasTestedTag = $derived(tags.some((tag: string) => isTestedTag(tag)))
  const displayTags = $derived(tags.filter((tag: string) => !isTestedTag(tag)))
  const compactTags = $derived(displayTags.length >= 5)
  const denseTags = $derived(displayTags.length >= 8)
  const languageCode = $derived(lang.toLowerCase() === 'fi' ? 'fi' : 'en')
  const languageLabel = $derived(lang.toLowerCase() === 'fi' ? 'Finnish' : 'English')

  const handleLinkClick = async (event: MouseEvent) => {
    if (!isPlainLeftClick(event)) {
      return
    }

    event.preventDefault()
    await goto(
      resolve((backQuery ? `/recipes/${recipeId}?${backQuery}` : `/recipes/${recipeId}`) as `/recipes/${string}`),
      {
        state: { fromRecipesList: true },
      },
    )
  }
</script>

<article class="recipe-card">
  <a
    href={resolve((backQuery ? `/recipes/${recipeId}?${backQuery}` : `/recipes/${recipeId}`) as `/recipes/${string}`)}
    class="recipe-link"
    onclick={handleLinkClick}
  >
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
