<script lang="ts">
  import { marked } from 'marked'
  import type { PageServerData } from './$types'
  import { base } from '$app/paths'

  export let data: PageServerData
  export let markdownHtml = marked.parse(data.content)
</script>

<nav>
  <a href={`${base}/`}>Home</a>
</nav>

<!-- Safe @html as we are rendering static content from our own Markdown files -->
<div>{@html markdownHtml}</div>
