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
  export let data: PageServerData
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<nav>
  <a href={resolve('/')}>Home</a>
</nav>

<!-- Safe @html as we are rendering static content from our own Markdown files -->
<div>{@html marked.parse(data.content)}</div>
