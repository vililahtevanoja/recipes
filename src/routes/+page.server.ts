import { readRecipes } from '#lib/server/readRecipes.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const recipes = await readRecipes('recipes')
  return { recipes }
}
