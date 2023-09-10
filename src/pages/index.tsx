import { readRecipes } from "@/recipe-data/recipe-reader";
import { Recipe } from "@/recipe-data/recipe-model";
import Link from "next/link";

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
        {recipes.map(({ id, title, metadata }) => (
          <li key={id}>
            <Link href={`/${id}`}>{metadata.lang?.toLowerCase() === "fi" ? "🇫🇮" : "🇬🇧" }{title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
