<script lang="ts">
 import { resolve } from '$app/paths'
  export let recipeId: string
  export let lang: string
  export let title: string
  export let tags: string[]
</script>

<div class="recipe-list-item-container">
  <a href={resolve(`/recipes/${recipeId}`)} class="no-underline content-center align-middle text-blue-300 hover:text-sky-700">
    <div class="flex mb-4">
      <div class="w-1/12 text-xl content-top">{lang.toLowerCase() === 'fi' ? '🇫🇮' : '🇬🇧'}</div>
      <div class="w-6/12 grow align-middle">{title}</div>
      <div class="w-4/12 align-middle">{tags.join(', ')}</div>
    </div>
  </a>
</div>
