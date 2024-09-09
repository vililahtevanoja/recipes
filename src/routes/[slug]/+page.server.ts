import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { readRecipes } from '$lib/server/readRecipes'

export const load: PageServerLoad = async ({ params }) => {
  const recipes = await readRecipes('recipes')
  const recipe = recipes.find((r) => r.id === params.slug)
  if (!recipe) {
    error(404, 'Not found')
  }
  return recipe
}
