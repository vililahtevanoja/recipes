import { z } from 'zod'

export enum RecipeContentFormat {
  Markdown,
  Unknown,
}

export type RecipeLanguage = 'fi' | 'en'

// Nutritional information per 100g of the finished dish
export const RecipeNutritionalInfoSchema = z.object({
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
})
export type RecipeNutritionalInfo = z.infer<typeof RecipeNutritionalInfoSchema>

export const RecipeNutritionalInfoWithCaloriesSchema = RecipeNutritionalInfoSchema.extend({
  calories: z.number(),
})

export type RecipeNutritionalInfoWithCalories = z.infer<typeof RecipeNutritionalInfoWithCaloriesSchema>

export const calculateCalories = (nutritionalInfo: RecipeNutritionalInfo): number => {
  const caloriesFromProtein = nutritionalInfo.protein * 4
  const caloriesFromCarbs = nutritionalInfo.carbs * 4
  const caloriesFromFat = nutritionalInfo.fat * 9
  return caloriesFromProtein + caloriesFromCarbs + caloriesFromFat
}

export const getNutritionalInfoWithCalories = (
  nutritionalInfo: RecipeNutritionalInfo,
): RecipeNutritionalInfoWithCalories => {
  const calories = calculateCalories(nutritionalInfo)
  return { ...nutritionalInfo, calories }
}

export const RecipeMetaDataSchema = z.object({
  title: z.string(),
  servings: z.coerce.string().optional(),
  lang: z.enum(['fi', 'en']),
  tags: z.string().transform((value) =>
    value
      .split(',')
      .map((s) => s.trim())
      .map(String),
  ),
  nutrition: RecipeNutritionalInfoSchema.optional(),
})

export type RecipeMetadata = z.infer<typeof RecipeMetaDataSchema>

export type RecipeBase = {
  id: string
  title: string
  path: string
  metadata: RecipeMetadata
  format: RecipeContentFormat
}

export type MarkdownRecipe = RecipeBase & {
  content: string
}

export type Recipe = MarkdownRecipe
