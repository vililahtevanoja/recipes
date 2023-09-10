import { readRecipes } from "@/recipe-data/recipe-reader";
import { Recipe } from "@/recipe-data/recipe-model";

type Props = {
  recipes: Recipe[];
};

export const getStaticProps = async () => {
  return {
    props: {
      recipes: await readRecipes("recipes"),
    },
  };
};

export default function Home({ recipes }: Props) {
  return (
    <main className={`flex`}>
      <ul>
        {recipes.map(({ id, title }) => (
          <li key={id}>
            <a href={`/personal-recipes/${id}`}>{title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
