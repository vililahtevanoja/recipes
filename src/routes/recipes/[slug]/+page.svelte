<script lang="ts">
  import { marked } from 'marked'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  export let markdownHtml = marked.parse(data.content)
</script>

<nav>
  <a href="/">Home</a>
</nav>

<div>{@html markdownHtml}</div>
