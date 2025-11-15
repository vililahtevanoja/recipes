<script lang="ts">
  import { marked } from 'marked'
  import type { PageServerData } from './$types'
  import { asset, resolve } from '$app/paths'
  import { onMount } from 'svelte'
  export let data: PageServerData

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
  let wakeLock: WakeLockSentinel | undefined
  let wakeLockAvailable = 'wakeLock' in navigator

  onMount(() => {
    wakeLockAvailable = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  })
  const toggleWakeLock = async () => {
    if (!wakeLockAvailable) {
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

  $: markdownHtml = marked.parse(data.content)
  $: title = data.title
  $: lockIcon = wakeLock === undefined ? asset('/toggle_off.svg') : asset('/toggle_on.svg')
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<nav>
  <a href={resolve('/')}>Home</a>
  {#if wakeLockAvailable}
    <button id="lockButton" on:click={toggleWakeLock}>
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
