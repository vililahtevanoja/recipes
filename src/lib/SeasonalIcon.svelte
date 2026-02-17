<script lang="ts">
  import type { SeasonKey } from '$lib/seasonal'

  let { season, class: className = '' }: { season: SeasonKey; class?: string } = $props()
</script>

<span class={`seasonal-icon ${className}`.trim()} aria-hidden="true">
  {#if season === 'winter'}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <path d="M12 3.5v17M5 7.5l14 9M19 7.5l-14 9" stroke="currentColor" stroke-width="1.8" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.22" />
    </svg>
  {:else if season === 'spring'}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <path d="M12 20v-8.5" stroke="currentColor" stroke-width="1.8" />
      <path d="M12 11.5c0-4 3.2-6.4 6.2-6.4 0 4.2-2.5 6.9-6.2 6.9Z" fill="currentColor" opacity="0.3" />
      <path d="M12 13.5c0-3.5-2.8-5.7-5.7-5.7 0 3.8 2.1 6.2 5.7 6.2Z" fill="currentColor" />
    </svg>
  {:else if season === 'summer'}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <circle cx="12" cy="12" r="3.8" fill="currentColor" opacity="0.28" />
      <path
        d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1"
        stroke="currentColor"
        stroke-width="1.8"
      />
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <path
        d="M18.6 6.4c-6.3-.8-10.8 2.3-11.7 8 .8 2.9 3.2 4.9 6.1 5.2 5.1-.8 8-4.9 8.2-11-.8-.9-1.7-1.7-2.6-2.2Z"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M8.2 16.5c3.3-2.7 6.2-5.8 8.9-9.2M10.5 20c.2-1.5.8-2.7 1.8-3.8"
        stroke="currentColor"
        stroke-width="1.8"
      />
    </svg>
  {/if}
</span>

<style>
  .seasonal-icon {
    display: inline-flex;
    inline-size: 1.1em;
    block-size: 1.1em;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transform: translateY(-0.04em);
  }

  .seasonal-icon svg {
    inline-size: 100%;
    block-size: 100%;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
