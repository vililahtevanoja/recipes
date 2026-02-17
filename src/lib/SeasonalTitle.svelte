<script lang="ts">
  import type { Snippet } from 'svelte'
  import SeasonalIcon from '$lib/SeasonalIcon.svelte'
  import type { SeasonKey } from '$lib/seasonal'

  let { season, children, class: className = '' }: { season: SeasonKey; children?: Snippet; class?: string } = $props()
</script>

<span class={`seasonal-title-lockup ${className}`.trim()}>
  <span class="seasonal-title-text">{@render children?.()}</span>
  <SeasonalIcon {season} class="seasonal-title-icon" />
</span>
