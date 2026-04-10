<script lang="ts">
  import { resolve } from '$app/paths'
  import { goto } from '$app/navigation'
  import { isPlainLeftClick } from '$lib/isPlainLeftClick'
  import FlagFI from '$lib/ui/FlagFI.svelte'
  import FlagGB from '$lib/ui/FlagGB.svelte'

  let {
    recipeId,
    lang,
    title,
    tags,
    backQuery,
    compact = false,
  } = $props<{
    recipeId: string
    lang: string
    title: string
    tags: string[]
    backQuery?: string
    compact?: boolean
  }>()

  const isTestedTag = (tag: string) => tag.trim().toLowerCase() === 'tested'
  const hasTestedTag = $derived(tags.some((tag: string) => isTestedTag(tag)))
  const displayTags = $derived(tags.filter((tag: string) => !isTestedTag(tag)))
  const languageCode = $derived(lang.toLowerCase() === 'fi' ? 'fi' : 'en')
  const languageLabel = $derived(languageCode === 'fi' ? 'Recipe language: Finnish' : 'Recipe language: English')

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

<article class="recipe-card-modern" class:is-compact={compact}>
  <a
    href={resolve((backQuery ? `/recipes/${recipeId}?${backQuery}` : `/recipes/${recipeId}`) as `/recipes/${string}`)}
    class="recipe-link"
    onclick={handleLinkClick}
  >
    <div class="language-indicator" data-lang={languageCode} role="img" aria-label={languageLabel}>
      {#if languageCode === 'fi'}<FlagFI />{:else}<FlagGB />{/if}
    </div>

    {#if hasTestedTag}
      <span class="tested-badge" title="Tested recipe">
        {compact ? '✓' : '✓ Tested'}
      </span>
    {/if}

    <div class="card-body">
      <div class="title-row">
        <h3 class="recipe-title">{title}</h3>
      </div>

      {#if displayTags.length > 0}
        <div class="tag-container" class:is-compact={compact}>
          {#each compact ? displayTags.slice(0, 3) : displayTags as tag (tag)}
            <span class="recipe-tag">{tag}</span>
          {/each}
          {#if compact && displayTags.length > 3}
            <span class="tag-more">+{displayTags.length - 3}</span>
          {/if}
        </div>
      {/if}
    </div>
  </a>
</article>

<style>
  .recipe-card-modern {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    box-shadow: var(--shadow-soft);
    position: relative;
  }

  .recipe-card-modern.is-compact {
    border-radius: 12px;
  }

  .recipe-card-modern:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: var(--shadow-strong);
  }

  .recipe-card-modern.is-compact:hover {
    transform: translateY(-2px);
  }

  .recipe-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    padding: 1rem;
    padding-top: 1.75rem;
    gap: 0.75rem;
  }

  .is-compact .recipe-link {
    padding: 0.5rem 0.85rem;
    padding-top: 1rem;
    gap: 0.35rem;
  }

  .title-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .language-indicator {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0.35rem;
    background: rgba(255, 255, 255, 0.1);
    border-bottom-right-radius: 8px;
    z-index: 5;
  }

  .is-compact .language-indicator {
    padding: 0.2rem;
  }

  .tested-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #e6fcf5;
    color: #087f5b;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 0.15rem 0.5rem;
    border-bottom-left-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    z-index: 5;
  }

  .is-compact .tested-badge {
    padding: 0.1rem 0.35rem;
    font-size: 0.6rem;
  }

  :root[data-theme='dark'] .tested-badge {
    background: #087f5b22;
    color: #63e6be;
  }

  .recipe-title {
    font-family: var(--font-heading);
    font-size: 1.15rem;
    color: var(--ink-strong);
    margin: 0;
    line-height: 1.3;
  }

  .is-compact .recipe-title {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .tag-container.is-compact {
    margin-top: 0.15rem;
    gap: 0.3rem;
  }

  .recipe-tag {
    background: var(--surface-alt);
    color: var(--muted);
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    border: 1px solid var(--line);
  }

  .is-compact .recipe-tag {
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
  }

  .tag-more {
    font-size: 0.65rem;
    color: var(--muted);
    font-weight: 600;
  }
</style>
