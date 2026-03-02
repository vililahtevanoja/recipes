---
name: recipe-importer
description: Use when asked to extract or import recipes from webpages, documents, images and text. Detect language, suggest tags and save the recipe in the appropriate location in the given form.
---

# Recipe Importer

## When to use this skill

Use this skill when the user wants to import a recipe from a webpage, image, document or text.

## Steps

1. Extract the recipe content
1. Transform the recipe to the given Markdown format.
1. Review the resulting recipe and raise any issues.

## What to pay attention when extracting

- Recipe name
- Serving count
- source (where the recipe is from)
- language (english or finnish)
- nutrition
  - protein, fat and carbs. grams per 100g of finished dish
- ingredients and their amounts
- Step-by-step instructions
- Any additional tips or variations

## Tags

- should be lowercase camel-case, e.g. `pot-roast`
- when referring to cuisines, refer only to the country/area, e.g. `french`

## Format

### Finnish language recipes

```markdown
--
title: <Reseptin nimi>
servings: <Kuinka monta annosta reseptistä tulee>
tags: <Reseptille sopivat tagit englanniksi, pilkuin eroteltuna ilman hakasulkuja>
source: <Mistä resepti on>
lang: fi
nutrition:
protein: <estimated grams of protein in 100g of finished dish>
fat: <estimated grams of fat in 100g of finished dish>
carbs: <estimated grams of carbohydrates in 100g of finished dish>

---

# <Reseptin nimi>

## Ainekset

- <ainesosa 1 muodossa esim: '`1 kg` perunoita'>
- <ainesosa 2 muodossa esim: '`1 l` maitoa'>
- <ainesosa 3 muoossa esim: '`2 tl` mustapippuria'>
- <jne>

## Valmistusohjeet

1. <Reseptin askel 1>
1. <Reseptin askel 2>
1. <Reseptin askel 3>
1. <jne>

<Loppuun voi lisätä vinkkejä ja muita hyödyllisiä asioita>
```

### English recipes

Use this format for English language recipes.

```markdown
---
title: <Recipe name>
servings: <How many servings does the recipe make>
tags: <Appropriate tags for the recipe>
source: <Where the recipe is from>
lang: en
nutrition:
  protein: <estimated grams of protein in 100g of finished dish>
  fat: <estimated grams of fat in 100g of finished dish>
  carbs: <estimated grams of carbohydrates in 100g of finished dish>
---

# <Recipe name>

## Ingredients

- <ingredient 1 in metric units (except for tablespoons and teaspoons), e.g.: '`1 kg` potatoes'>
- <ingredient 2 in metric units (except for tablespoons and teaspoons), e.g. '`1 tbsp` honey'>
- <ingredient 3 in metric units (except for tablespoons and teaspoons), e.g. '`1 tsp` salt'>
- <jne>

## Instructions

1. <Instruction step 1>
1. <Instruction step 2>
1. <etc.>

<At the end you can add tips and other useful additions from the recipe>
```

## Notes

- _IMPORTANT_: Do not take creative license on the ingredients or steps, but rather follow them _exactly_.
- _IMPORTANT_: If you notice any discrepancies, things that do not make sense, or information missing from the recipe, raise those up for review and deciding on.
- If there is no nutritional information present, you can deduce them from the recipe contents.

## Post-run operations

Run `pnpm format` to enforce formatting, and `pnpm verify` to verify everything still works as expected.
