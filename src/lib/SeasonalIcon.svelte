<script lang="ts">
  import type { SeasonKey } from '$lib/seasonal'

  let { season, class: className = '' }: { season: SeasonKey; class?: string } = $props()
</script>

<span class={`seasonal-icon ${className}`.trim()} aria-hidden="true">
  {#if season === 'winter'}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.2" opacity="0.26" />
      <path d="M12 4.3v15.4M4.3 12h15.4M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.6" />
      <path
        d="M12 4.3l-1 1M12 4.3l1 1M19.7 12l-1-1M19.7 12l-1 1M12 19.7l-1-1M12 19.7l1-1M4.3 12l1-1M4.3 12l1 1"
        stroke="currentColor"
        stroke-width="1.3"
      />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" opacity="0.22" />
    </svg>
  {:else if season === 'spring'}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <circle cx="12" cy="8.4" r="2.6" fill="currentColor" opacity="0.18" />
      <circle cx="8.6" cy="11.3" r="2.5" fill="currentColor" opacity="0.16" />
      <circle cx="15.4" cy="11.3" r="2.5" fill="currentColor" opacity="0.16" />
      <circle cx="12" cy="14.2" r="2.2" fill="currentColor" opacity="0.2" />
      <circle cx="12" cy="11.2" r="1.5" fill="currentColor" />
      <path d="M12 12.6v7.2" stroke="currentColor" stroke-width="1.6" />
      <path d="M12 16.8c-2.7-.2-3.9 1-4.8 2.7 2.5.3 4-.4 4.8-1.5Z" fill="currentColor" opacity="0.28" />
      <path d="M12 16.9c2.6-.2 3.9 1 4.7 2.6-2.5.4-4-.4-4.7-1.4Z" fill="currentColor" opacity="0.18" />
    </svg>
  {:else if season === 'summer'}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <circle cx="12" cy="11.6" r="4.1" fill="currentColor" opacity="0.28" />
      <circle cx="12" cy="11.6" r="6.2" stroke="currentColor" stroke-width="1.1" opacity="0.3" />
      <path
        d="M12 2.7v3M12 18.1v3M2.7 11.6h3M18.3 11.6h3M5.3 4.9l2.1 2.1M16.6 16.2l2.1 2.1M18.7 4.9L16.6 7M7.4 16.2l-2.1 2.1"
        stroke="currentColor"
        stroke-width="1.6"
      />
      <path
        d="M5.8 19.4c1.4-.9 2.6-.9 4 0 1.4.9 2.7.9 4 0 1.3-.9 2.6-.9 4 0"
        stroke="currentColor"
        stroke-width="1.2"
        opacity="0.45"
      />
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" fill="none" role="presentation">
      <path
        d="M19 5.9c-6.7-.9-11.6 2.5-12.4 8.5.8 3 3.3 5.1 6.4 5.5 5.4-.8 8.4-5.1 8.6-11.4-.7-1-1.6-1.9-2.6-2.6Z"
        fill="currentColor"
        opacity="0.24"
      />
      <path
        d="M8.1 16.8c3.5-2.9 6.5-6 9.4-9.5M10.6 20.1c.1-1.6.8-2.9 2-4M15.5 18.2c1.2-.2 2.1-.7 2.9-1.5"
        stroke="currentColor"
        stroke-width="1.6"
      />
      <circle cx="6.2" cy="6.6" r="1.1" fill="currentColor" opacity="0.34" />
      <circle cx="4.4" cy="8.6" r="0.8" fill="currentColor" opacity="0.25" />
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
