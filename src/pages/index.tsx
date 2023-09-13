import { readRecipes } from '@/recipe-data/recipe-reader'
import { Recipe } from '@/recipe-data/recipe-model'
import Link from 'next/link'

type Props = {
  recipes: Recipe[]
}

export const getStaticProps = async () => {
  return {
    props: {
      recipes: await readRecipes('recipes'),
    },
  }
}

export default function Home({ recipes }: Props) {
  return (
    <div>
      {recipes.map(({ id, title, metadata }) => (
        <Link
          key={id}
          href={`/${id}`}
          className="no-underline content-center align-middle"
        >
          <div className={`flex mb-4`}>
            <div className="w-1/12 text-xl content-top">
              {metadata.lang?.toLowerCase() === 'fi' ? '🇫🇮' : '🇬🇧'}
            </div>
            <div className="w-6/12 grow align-middle">{title}</div>
            <div className="w-4/12 align-middle">{metadata.tags}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
