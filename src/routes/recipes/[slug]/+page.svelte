<script lang="ts">
  import { asset, resolve } from '$app/paths'
  import { marked } from 'marked'
  import { onMount } from 'svelte'
  import type { PageServerData } from './$types'

  let { data } = $props<{ data: PageServerData }>()

  marked.use({
    extensions: [
      {
        name: 'link',
        renderer({ href, text }) {
          return `<a data-sveltekit-reload href="${href}">${text}</a>`
        },
      },
    ],
  })

  let wakeLock = $state<WakeLockSentinel | undefined>(undefined)
  let wakeLockAvailable = $state(false)

  onMount(() => {
    wakeLockAvailable = typeof navigator !== 'undefined' && 'wakeLock' in navigator
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {})
        wakeLock = undefined
      }
    }
  })

  const toggleWakeLock = async () => {
    if (typeof navigator === 'undefined' || !wakeLockAvailable) {
      return
    }

    if (wakeLock === undefined) {
      wakeLock = await navigator.wakeLock.request('screen')
    } else {
      await wakeLock.release()
      wakeLock = undefined
    }
  }

  const markdownHtml = $derived(marked.parse(data.content))
  const title = $derived(data.title)
  const wakeLockEnabled = $derived(wakeLock !== undefined)
  const lockIcon = $derived(wakeLockEnabled ? asset('/toggle_on.svg') : asset('/toggle_off.svg'))
  const wakeLockLabel = $derived(wakeLockEnabled ? 'Screen awake' : 'Keep screen awake')
</script>

<svelte:head>
  <title>{title} | Personal Recipes</title>
</svelte:head>

<div class="page-wrap recipe-page">
  <header class="recipe-header">
    <a href={resolve('/')} class="back-link">Back to all recipes</a>

    <div class="recipe-toolbar">
      <h1>{title}</h1>

      {#if wakeLockAvailable}
        <button
          type="button"
          class="wake-lock-button"
          class:is-active={wakeLockEnabled}
          aria-pressed={wakeLockEnabled}
          title={wakeLockLabel}
          onclick={toggleWakeLock}
        >
          <img src={lockIcon} alt="" width="24" height="24" aria-hidden="true" />
          <span>{wakeLockLabel}</span>
        </button>
      {/if}
    </div>
  </header>

  <!-- Safe @html as we are rendering static content from our own Markdown files -->
  <article class="recipe-content">{@html markdownHtml}</article>
</div>
