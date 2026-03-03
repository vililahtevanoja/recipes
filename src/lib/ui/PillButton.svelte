<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  let {
    type = 'button',
    active = false,
    class: className = '',
    children,
    ...props
  }: {
    type?: 'button' | 'submit' | 'reset'
    active?: boolean
    class?: string
    children?: Snippet
  } & Omit<HTMLButtonAttributes, 'type' | 'class'> = $props()

  const resolvedClass = $derived(`${className}${active ? ' is-active' : ''}`.trim())
</script>

<button {type} class={resolvedClass} {...props}>
  {@render children?.()}
</button>
