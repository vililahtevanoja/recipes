<script lang="ts">
  import { marked } from 'marked'
  import type { PageServerData } from './$types'
  import { resolve } from '$app/paths'

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
  export const wakeLockAvailable = 'wakeLock' in navigator

  const toggleWakeLock = async () => {
    if (!wakeLockAvailable) {
      return
    }
    if (wakeLock === undefined) {
      wakeLock = await navigator.wakeLock.request('screen')
    } else {
      await wakeLock.release()
      wakeLock = undefined
    }
  }
  export let data: PageServerData
  export let markdownHtml = marked.parse(data.content)
  export let title = data.title
  export let lockButtonText = wakeLock?.released ? '🔒' : '🔓'
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<nav>
  <a href={resolve('/')}>Home</a>
  {#if wakeLockAvailable}
    <button id={'lockButton'} on:click={toggleWakeLock}>{lockButtonText}</button>
  {/if}
</nav>

<!-- Safe @html as we are rendering static content from our own Markdown files -->
<div>{@html markdownHtml}</div>

<style>
  #lockButton {
    background-color: transparent;
    border: none;
  }
</style>
