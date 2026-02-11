<script lang="ts">
  import { marked } from 'marked'
  import type { PageServerData } from './$types'
  import { asset, resolve } from '$app/paths'
  import { onMount } from 'svelte'
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
      console.log('Wake Lock activated')
    } else {
      await wakeLock.release()
      wakeLock = undefined
      console.log('Wake Lock deactivated')
    }
  }

  const markdownHtml = $derived(marked.parse(data.content))
  const title = $derived(data.title)
  const lockIcon = $derived(wakeLock === undefined ? asset('/toggle_off.svg') : asset('/toggle_on.svg'))
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<nav>
  <a href={resolve('/')}>Home</a>
  {#if wakeLockAvailable}
    <button id="lockButton" onclick={toggleWakeLock}>
      <img src={lockIcon} alt="Wake Lock Toggle" width="24" height="24" />
    </button>
  {/if}
</nav>

<!-- Safe @html as we are rendering static content from our own Markdown files -->
<div>{@html markdownHtml}</div>

<style>
  nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  nav a {
    font-size: 32px;
    text-decoration: none;
    outline: none;
  }
  #lockButton {
    background-color: transparent;
    border: none;
  }
</style>
