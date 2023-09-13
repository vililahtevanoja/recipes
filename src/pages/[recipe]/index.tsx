import { getRecipeMarkdown, readRecipes } from '@/recipe-data/recipe-reader'
import { Recipe, RecipeContentFormat } from '@/recipe-data/recipe-model'
import { GetStaticPaths, GetStaticProps } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkFrontmatter from 'remark-frontmatter'
import RecipeHeader from './recipe-header'

type Props = {
  recipe: Recipe
}

export const getStaticPaths: GetStaticPaths = async () => {
  const recipes = await readRecipes('recipes')
  return {
    paths: recipes.map(({ id }) => ({ params: { recipe: id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{ recipe: Recipe }> = async ({
  params,
}) => {
  const id = params?.recipe
  const recipes = await readRecipes('recipes')
  const recipe = recipes.find((post) => post.id === id)!
  return {
    props: {
      recipe,
    },
  }
}

export default function Recipe({ recipe }: Props) {
  const content =
    recipe.format === RecipeContentFormat.Markdown ? (
      <ReactMarkdown remarkPlugins={[remarkFrontmatter]}>
        {getRecipeMarkdown(recipe)}
      </ReactMarkdown>
    ) : (
      <div>{getRecipeMarkdown(recipe)}</div>
    )
  return (
    <div>
      <RecipeHeader />
      <div>{content}</div>
    </div>
  )
}
