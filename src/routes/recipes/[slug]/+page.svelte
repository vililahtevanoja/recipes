<script lang="ts">
  import { asset, resolve } from '$app/paths'
  import { marked } from 'marked'
  import { onMount } from 'svelte'
  import type { PageServerData } from './$types'

  let { data } = $props<{ data: PageServerData }>()

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

  let wakeLock = $state<WakeLockSentinel | undefined>(undefined)
  let wakeLockAvailable = $state(false)

  onMount(() => {
    wakeLockAvailable = typeof navigator !== 'undefined' && 'wakeLock' in navigator
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {})
        wakeLock = undefined
      }
    }
  })

  const toggleWakeLock = async () => {
    if (typeof navigator === 'undefined' || !wakeLockAvailable) {
      return
    }

    if (wakeLock === undefined) {
      wakeLock = await navigator.wakeLock.request('screen')
    } else {
      await wakeLock.release()
      wakeLock = undefined
    }
  }

  const markdownHtml = $derived(marked.parse(data.content))
  const title = $derived(data.title)
  const nutrition = $derived(data.metadata.nutrition)
  const wakeLockEnabled = $derived(wakeLock !== undefined)
  const lockIcon = $derived(wakeLockEnabled ? asset('/toggle_on.svg') : asset('/toggle_off.svg'))
  const wakeLockLabel = $derived(wakeLockEnabled ? 'Screen awake' : 'Keep screen awake')
  const nutritionWithCalories = $derived.by(() => {
    if (!nutrition) {
      return undefined
    }
    return {
      ...nutrition,
      calories: nutrition.protein * 4 + nutrition.carbs * 4 + nutrition.fat * 9,
    }
  })

  const formatNutritionValue = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)

  const navigateBackToRecipes = (event: MouseEvent) => {
    if (window.history.length <= 1) {
      return
    }
    event.preventDefault()
    window.history.back()
  }
</script>

<svelte:head>
  <title>{title} | Personal Recipes</title>
</svelte:head>

<div class="page-wrap recipe-page">
  <header class="recipe-header">
    <a href={resolve('/')} class="back-link" onclick={navigateBackToRecipes}>Back to all recipes</a>

    <div class="recipe-toolbar">
      <h1>{title}</h1>

      {#if wakeLockAvailable}
        <button
          type="button"
          class="wake-lock-button"
          class:is-active={wakeLockEnabled}
          aria-pressed={wakeLockEnabled}
          title={wakeLockLabel}
          onclick={toggleWakeLock}
        >
          <img src={lockIcon} alt="" width="24" height="24" aria-hidden="true" />
          <span>{wakeLockLabel}</span>
        </button>
      {/if}
    </div>
  </header>

  {#if nutritionWithCalories}
    <section
      class="grid animate-[rise-in_0.5s_ease_both] gap-2 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-alt)] p-[clamp(0.9rem,2.2vw,1.2rem)] shadow-[var(--shadow-soft)] max-[800px]:rounded-[14px]"
      aria-labelledby="nutrition-heading"
    >
      <h2
        id="nutrition-heading"
        class="m-0 font-[var(--font-heading)] text-[clamp(1.1rem,1.8vw,1.35rem)] text-[var(--ink-strong)]"
      >
        Nutrition
      </h2>
      <p class="m-0 text-[0.9rem] text-[var(--muted)]">Per 100g of finished dish.</p>

      <dl class="m-0 grid gap-[0.55rem] p-0 [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
        <div class="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-[0.65rem] py-[0.5rem]">
          <dt class="text-[0.78rem] font-semibold uppercase tracking-[0.02em] text-[var(--muted)]">Calories</dt>
          <dd class="m-0 mt-[0.2rem] text-[1rem] font-semibold text-[var(--ink-strong)]">
            {formatNutritionValue(nutritionWithCalories.calories)} kcal
          </dd>
        </div>
        <div class="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-[0.65rem] py-[0.5rem]">
          <dt class="text-[0.78rem] font-semibold uppercase tracking-[0.02em] text-[var(--muted)]">Protein</dt>
          <dd class="m-0 mt-[0.2rem] text-[1rem] font-semibold text-[var(--ink-strong)]">
            {formatNutritionValue(nutritionWithCalories.protein)} g
          </dd>
        </div>
        <div class="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-[0.65rem] py-[0.5rem]">
          <dt class="text-[0.78rem] font-semibold uppercase tracking-[0.02em] text-[var(--muted)]">Carbs</dt>
          <dd class="m-0 mt-[0.2rem] text-[1rem] font-semibold text-[var(--ink-strong)]">
            {formatNutritionValue(nutritionWithCalories.carbs)} g
          </dd>
        </div>
        <div class="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-[0.65rem] py-[0.5rem]">
          <dt class="text-[0.78rem] font-semibold uppercase tracking-[0.02em] text-[var(--muted)]">Fat</dt>
          <dd class="m-0 mt-[0.2rem] text-[1rem] font-semibold text-[var(--ink-strong)]">
            {formatNutritionValue(nutritionWithCalories.fat)} g
          </dd>
        </div>
      </dl>
    </section>
  {/if}

  <!-- Safe @html as we are rendering static content from our own Markdown files -->
  <article class="recipe-content">{@html markdownHtml}</article>
</div>
