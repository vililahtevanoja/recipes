export type SeasonalCategory =
  | 'highlights'
  | 'fruitsAndBerries'
  | 'vegetables'
  | 'rootVegetables'
  | 'naturalPlants'
  | 'herbs'
  | 'mushrooms'

export type SeasonalIngredient = {
  labelFi: string
  slug: string
  domestic: boolean
}

export type SeasonalMonthData = {
  month: number
  monthNameFi: string
  categories: Record<SeasonalCategory, SeasonalIngredient[]>
}

export type IngredientSeasonality = {
  slug: string
  labelFi: string
  months: number[]
  domesticMonths: number[]
}

export type SeasonKey = 'winter' | 'spring' | 'summer' | 'autumn'

const monthNameFiByNumber: Record<number, string> = {
  1: 'Tammikuu',
  2: 'Helmikuu',
  3: 'Maaliskuu',
  4: 'Huhtikuu',
  5: 'Toukokuu',
  6: 'Kesäkuu',
  7: 'Heinäkuu',
  8: 'Elokuu',
  9: 'Syyskuu',
  10: 'Lokakuu',
  11: 'Marraskuu',
  12: 'Joulukuu',
}

type IngredientInput = readonly [labelFi: string, domestic?: boolean]
type SeasonalCategoryInput = Record<SeasonalCategory, IngredientInput[]>

const toSlug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const dedupeIngredients = (items: SeasonalIngredient[]): SeasonalIngredient[] => {
  const bySlug = new Map<string, SeasonalIngredient>()

  for (const item of items) {
    const existing = bySlug.get(item.slug)
    if (!existing) {
      bySlug.set(item.slug, item)
      continue
    }

    if (item.domestic && !existing.domestic) {
      bySlug.set(item.slug, { ...existing, domestic: true })
    }
  }

  return [...bySlug.values()]
}

const prioritizeDomesticIngredients = (items: SeasonalIngredient[]): SeasonalIngredient[] => {
  const domestic = items.filter((item) => item.domestic)
  const nonDomestic = items.filter((item) => !item.domestic)

  return [...domestic, ...nonDomestic]
}

const mapIngredients = (items: IngredientInput[]): SeasonalIngredient[] =>
  prioritizeDomesticIngredients(
    dedupeIngredients(
      items.map(([labelFi, domestic = false]) => ({
        labelFi,
        slug: toSlug(labelFi),
        domestic,
      })),
    ),
  )

const createMonthData = (month: number, categories: SeasonalCategoryInput): SeasonalMonthData => ({
  month,
  monthNameFi: monthNameFiByNumber[month] ?? `Kuukausi ${month}`,
  categories: {
    highlights: mapIngredients(categories.highlights),
    fruitsAndBerries: mapIngredients(categories.fruitsAndBerries),
    vegetables: mapIngredients(categories.vegetables),
    rootVegetables: mapIngredients(categories.rootVegetables),
    naturalPlants: mapIngredients(categories.naturalPlants),
    herbs: mapIngredients(categories.herbs),
    mushrooms: mapIngredients(categories.mushrooms),
  },
})

export const seasonalByMonth: SeasonalMonthData[] = [
  createMonthData(1, {
    highlights: [],
    fruitsAndBerries: [
      ['Appelsiini'],
      ['Feijoa'],
      ['Greippi'],
      ['Hunajapomelo'],
      ['Keltainen kiivi'],
      ['Klementiini'],
      ['Kookospähkinä'],
      ['Kumkvat'],
      ['Omena', true],
      ['Suklaa-appelsiini'],
      ['Sweetie'],
      ['Veriappelsiini'],
      ['Verigreippi'],
    ],
    vegetables: [
      ['Inkivääri'],
      ['Keltasipuli', true],
      ['Lehtikaali', true],
      ['Punakaali', true],
      ['Salottisipuli', true],
    ],
    rootVegetables: [['Bataatti'], ['Maa-artisokka', true], ['Mustajuuri', true], ['Porkkana', true]],
    naturalPlants: [],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(2, {
    highlights: [],
    fruitsAndBerries: [
      ['Annoona'],
      ['Appelsiini'],
      ['Avokado'],
      ['Greippi'],
      ['Guava'],
      ['Hunajapomelo'],
      ['Kiivi'],
      ['Limetti'],
      ['Sharon'],
      ['Sweetie'],
      ['Ugli'],
      ['Veriappelsiini'],
      ['Verigreippi'],
    ],
    vegetables: [['Kurkuma'], ['Salaattifenkoli'], ['Valkokaali', true], ['Valkosipuli', true]],
    rootVegetables: [['Bataatti'], ['Juuripersilja', true], ['Lanttu', true], ['Mustajuuri', true]],
    naturalPlants: [],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(3, {
    highlights: [],
    fruitsAndBerries: [
      ['Avokado'],
      ['Banaani'],
      ['Greippi'],
      ['Kookospähkinä'],
      ['Limetti'],
      ['Mandariini'],
      ['Mango'],
      ['Papaija'],
      ['Passiohedelmä'],
      ['Puoliveriappelsiini'],
      ['Ruokabanaani'],
      ['Veriappelsiini'],
    ],
    vegetables: [],
    rootVegetables: [
      ['Bataatti'],
      ['Maa-artisokka', true],
      ['Maniokki'],
      ['Peruna', true],
      ['Palsternakka', true],
      ['Piparjuuri', true],
      ['Purppurabataatti'],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(4, {
    highlights: [],
    fruitsAndBerries: [
      ['Ananas'],
      ['Karambola'],
      ['Mandariini'],
      ['Sitruuna'],
      ['Miniananas'],
      ['Passiohedelmä'],
      ['Pitaija'],
      ['Pepino'],
      ['Puoliveriappelsiini'],
      ['Rambutan'],
      ['Verigreippi'],
    ],
    vegetables: [['Mangoldi'], ['Parsa'], ['Pimientos de padron -paprikat'], ['Varsikukkakaali'], ['Varsiparsakaali']],
    rootVegetables: [['Bataatti']],
    naturalPlants: [
      ['Huhtasieni', true],
      ['Maitohorsma', true],
      ['Nokkonen', true],
      ['Voikukka', true],
      ['Vuohenputki', true],
    ],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(5, {
    highlights: [],
    fruitsAndBerries: [
      ['Hunajameloni'],
      ['Litsi'],
      ['Litteä persikka'],
      ['Mandariini'],
      ['Mangostani'],
      ['Papaija'],
      ['Tamarillo'],
    ],
    vegetables: [
      ['Kirsikkatomaatti'],
      ['Raparperi', true],
      ['Ruohosipuli', true],
      ['Varsiselleri'],
      ['Varsiparsakaali'],
      ['Varsikukkakaali', true],
      ['Vihanneskrassi', true],
    ],
    rootVegetables: [['Retiisi', true]],
    naturalPlants: [
      ['Ketunleipä', true],
      ['Kuusenkerkkä', true],
      ['Nokkonen', true],
      ['Voikukka', true],
    ],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(6, {
    highlights: [],
    fruitsAndBerries: [
      ['Aprikoosi'],
      ['Cantaloupemeloni'],
      ['Kirsikka'],
      ['Nektariini'],
      ['Paraguayos-persikka'],
      ['Persikka'],
      ['Verkkomeloni'],
      ['Vesimeloni'],
    ],
    vegetables: [
      ['Jääsalaatti', true],
      ['Herne', true],
      ['Keräsalaatti', true],
      ['Kevätsipuli', true],
      ['Kurkku', true],
      ['Luumutomaatti', true],
      ['Pihvitomaatti', true],
      ['Purjosipuli', true],
      ['Rukola', true],
      ['Varhaiskaali', true],
      ['Varsiparsakaali', true],
    ],
    rootVegetables: [
      ['Nauris', true],
      ['Porkkana', true],
      ['Retiisi', true],
      ['Retikka', true],
      ['Varhaisperuna', true],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(7, {
    highlights: [],
    fruitsAndBerries: [
      ['Ahomansikka', true],
      ['Herukat', true],
      ['Mansikka', true],
      ['Mesimarja', true],
      ['Vadelma', true],
      ['Viinirypäleet'],
    ],
    vegetables: [
      ['Avomaankurkku', true],
      ['Chilit', true],
      ['Endiivi', true],
      ['Kesäkurpitsa', true],
      ['Kukkakaali', true],
      ['Kyssäkaali', true],
      ['Lehtiselleri', true],
      ['Mangoldi', true],
      ['Parsakaali', true],
      ['Pinaatti', true],
      ['Romanescokukkakaali', true],
      ['Sipulit', true],
      ['Tomaatit', true],
      ['Tarhapavut', true],
      ['Vahapapu', true],
      ['Vuonankaali', true],
    ],
    rootVegetables: [],
    naturalPlants: [],
    herbs: [
      ['Basilika', true],
      ['Lehtipersilja', true],
      ['Tilli', true],
    ],
    mushrooms: [],
  }),
  createMonthData(8, {
    highlights: [],
    fruitsAndBerries: [
      ['Karhunvatukka', true],
      ['Karviainen'],
      ['Lakka', true],
      ['Luumu', true],
      ['Mustikka', true],
      ['Omenat (kesälajikkeet)', true],
      ['Saskatoon', true],
      ['Viikuna'],
    ],
    vegetables: [
      ['Chilit', true],
      ['Fenkoli', true],
      ['Härkäpapu', true],
      ['Keräsalaatti', true],
      ['Kurkku', true],
      ['Latva-artisokka', true],
      ['Lehtisalaatit', true],
      ['Maissi', true],
      ['Munakoiso', true],
      ['Paprikat', true],
      ['Pihvitomaatit', true],
      ['Sipulit', true],
      ['Suippokaalit', true],
    ],
    rootVegetables: [
      ['Punajuuri', true],
      ['Raitajuuri', true],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [
      ['Herkkutatti', true],
      ['Kantarelli', true],
      ['Lampaankääpä', true],
    ],
  }),
  createMonthData(9, {
    highlights: [],
    fruitsAndBerries: [
      ['Juolukka', true],
      ['Kiwano'],
      ['Kriikunat', true],
      ['Marja-aronia', true],
      ['Omenat (syyslajikkeet)', true],
      ['Puolukka', true],
    ],
    vegetables: [
      ['Fenkoli', true],
      ['Härkäpapu', true],
      ['Kiinankaali', true],
      ['Latva-artisokka', true],
      ['Lehtikaali', true],
      ['Maissi', true],
      ['Pinaattikiinankaali', true],
      ['Savoijinkaali', true],
      ['Suippopaprika', true],
      ['Taitepapu', true],
    ],
    rootVegetables: [
      ['Kaurajuuri', true],
      ['Keltajuuri', true],
      ['Palsternakka', true],
      ['Retikka', true],
      ['Valkojuuri', true],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [
      ['Mustatorvisieni', true],
      ['Suppilovahvero', true],
      ['Tatit', true],
    ],
  }),
  createMonthData(10, {
    highlights: [],
    fruitsAndBerries: [
      ['Katajanmarja', true],
      ['Karpalo', true],
      ['Mango'],
      ['Omenat (talvilajikkeet)', true],
      ['Pihlajanmarja', true],
      ['Puolukka', true],
      ['Päärynät', true],
      ['Satsuma'],
    ],
    vegetables: [
      ['Hokkaidokurpitsa', true],
      ['Jättikurpitsa', true],
      ['Kyssäkaali', true],
      ['Lehtikaali', true],
      ['Mustakaali', true],
      ['Myskikurpitsa', true],
      ['Salaattisikuri', true],
      ['Savoijinkaali', true],
      ['Sipulit', true],
      ['Spagettikurpitsa', true],
      ['Ruusukaali', true],
      ['Valkokaali', true],
    ],
    rootVegetables: [
      ['Juuripersilja', true],
      ['Mukulaselleri', true],
      ['Raitajuuri', true],
      ['Sokerijuurikas', true],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [['Suppilovahvero', true]],
  }),
  createMonthData(11, {
    highlights: [],
    fruitsAndBerries: [
      ['Granaattiomena'],
      ['Guava'],
      ['Karpalo', true],
      ['Kastanja'],
      ['Omenapäärynä'],
      ['Omenat (talvilajikkeet)', true],
      ['Persimoni'],
      ['Satsuma'],
    ],
    vegetables: [
      ['Jättikurpitsa', true],
      ['Kajottikurpitsa'],
      ['Kyssäkaali', true],
      ['Lehtikaali', true],
      ['Mustakaali', true],
      ['Purjosipuli', true],
      ['Ruusukaali', true],
      ['Salottisipuli', true],
      ['Suppokaali', true],
    ],
    rootVegetables: [
      ['Keltajuuri', true],
      ['Maa-artisokka', true],
      ['Mukulaselleri', true],
      ['Nauris', true],
      ['Palsternakka', true],
      ['Raitajuuri', true],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [],
  }),
  createMonthData(12, {
    highlights: [],
    fruitsAndBerries: [
      ['Bergamotti'],
      ['Kastanja'],
      ['Klementiini'],
      ['Omenat', true],
      ['Persimoni'],
      ['Päärynät', true],
      ['Satsuma'],
      ['Sweetie'],
      ['Taateli'],
    ],
    vegetables: [
      ['Kiinankaali', true],
      ['Myskikurpitsa', true],
      ['Punakaali', true],
      ['Punasipuli', true],
      ['Ruusukaali', true],
    ],
    rootVegetables: [
      ['Bataatti'],
      ['Kaurajuuri', true],
      ['Keltajuuri', true],
      ['Lanttu', true],
      ['Punajuuri', true],
      ['Porkkana', true],
      ['Raitajuuri', true],
      ['Väriporkkanat', true],
    ],
    naturalPlants: [],
    herbs: [],
    mushrooms: [],
  }),
]

const validateSeasonalData = (data: SeasonalMonthData[]): void => {
  if (data.length !== 12) {
    throw new Error(`Expected 12 months of seasonal data, got ${data.length}`)
  }

  const monthSet = new Set<number>(data.map((entry) => entry.month))
  for (let month = 1; month <= 12; month += 1) {
    if (!monthSet.has(month)) {
      throw new Error(`Missing seasonal data for month ${month}`)
    }
  }

  for (const entry of data) {
    for (const category of Object.keys(entry.categories) as SeasonalCategory[]) {
      for (const ingredient of entry.categories[category]) {
        if (!ingredient.slug) {
          throw new Error(`Ingredient slug cannot be empty (month ${entry.month}, ingredient "${ingredient.labelFi}")`)
        }
      }
    }
    const highlights = entry.categories.highlights
    const allEntries: Set<SeasonalIngredient> = new Set(
      [
        ...data.map(({ categories: cs }): SeasonalIngredient[] =>
          [
            ...cs.fruitsAndBerries,
            ...cs.herbs,
            ...cs.mushrooms,
            ...cs.naturalPlants,
            ...cs.rootVegetables,
            ...cs.vegetables,
          ].flat(),
        ),
      ].flat(),
    )
    const highlightsNotInCategories = highlights.filter((highlight) => !allEntries.has(highlight))
    if (highlightsNotInCategories.length > 0) {
      throw new Error(
        `Highlight(s) not in months seasonal ingredients list: ${JSON.stringify(highlightsNotInCategories)}`,
      )
    }
  }
}

validateSeasonalData(seasonalByMonth)

export const getSeasonalMonth = (month: number): SeasonalMonthData | undefined =>
  seasonalByMonth.find((entry) => entry.month === month)

export const getSeasonForMonth = (month: number): SeasonKey => {
  if (month >= 6 && month <= 8) {
    return 'summer'
  }

  if (month >= 9 && month <= 11) {
    return 'autumn'
  }

  if (month >= 4 && month <= 5) {
    return 'spring'
  }

  return 'winter'
}

export const getIngredientSeasonality = (slug: string): IngredientSeasonality | undefined => {
  const normalizedSlug = toSlug(slug)
  let labelFi: string | undefined
  const months = new Set<number>()
  const domesticMonths = new Set<number>()

  for (const monthEntry of seasonalByMonth) {
    for (const categoryIngredients of Object.values(monthEntry.categories)) {
      for (const ingredient of categoryIngredients) {
        if (ingredient.slug !== normalizedSlug) {
          continue
        }

        labelFi ??= ingredient.labelFi
        months.add(monthEntry.month)

        if (ingredient.domestic) {
          domesticMonths.add(monthEntry.month)
        }
      }
    }
  }

  if (!labelFi) {
    return undefined
  }

  return {
    slug: normalizedSlug,
    labelFi,
    months: [...months].sort((a, b) => a - b),
    domesticMonths: [...domesticMonths].sort((a, b) => a - b),
  }
}
