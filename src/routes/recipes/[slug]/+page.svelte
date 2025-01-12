<script lang="ts">
  import { marked } from 'marked'
  import type { PageServerData } from './$types'
  import { base } from '$app/paths'

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
  export let markdownHtml = marked.parse(data.content)
  export let title = data.title
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<nav>
  <a href={`${base}/`}>Home</a>
</nav>

<!-- Safe @html as we are rendering static content from our own Markdown files -->
<div>{@html markdownHtml}</div>
