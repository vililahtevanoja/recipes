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
  const toggleWakeLock = async () => {
    const wakeLockAvailable = 'wakeLock' in navigator
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
   export let wakeLockEnabled = wakeLock !== undefined
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<nav>
  <a href={resolve('/')}>Home</a>
</nav>

<!-- Safe @html as we are rendering static content from our own Markdown files -->
<div>{@html marked.parse(data.content)}</div>
