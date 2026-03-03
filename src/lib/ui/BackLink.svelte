<script lang="ts">
  import type { Pathname } from '$app/types'
  import { resolve } from '$app/paths'
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  let {
    href,
    class: className = '',
    children,
    ...props
  }: {
    href: Pathname
    class?: string
    children?: Snippet
  } & Omit<HTMLAnchorAttributes, 'href' | 'class'> = $props()
</script>

<a href={resolve(href)} class={`back-link ${className}`.trim()} {...props}>
  {@render children?.()}
</a>
