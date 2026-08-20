export const REGIONS: Record<string, string> = {
  europe:   'europe',
  asia:     'asia',
  africa:   'africa',
  americas: 'americas',
  oceania:  'oceania',
}

export const CONTINENTS = [
  { key: 'europe',   label: 'Europa',   countries: 44 },
  { key: 'asia',     label: 'Asia',     countries: 49 },
  { key: 'africa',   label: 'África',   countries: 54 },
  { key: 'americas', label: 'Américas', countries: 35 },
  { key: 'oceania',  label: 'Oceanía',  countries: 14 },
]

export const QUIZ_CONFIG = {
  maxAttempts: 4,
  hints: [
    { attemptTrigger: 1, type: 'letters' as const },
    { attemptTrigger: 2, type: 'firstLetter' as const },
    { attemptTrigger: 3, type: 'contains' as const },
  ],
}

// v5 usa "response_fields" (no "fields") y nombres de campo nuevos
export const RESTCOUNTRIES_FIELDS = [
  'names', 'codes', 'capitals', 'flag',
  'subregion', 'region', 'population', 'area',
  'languages', 'currencies', 'coordinates', 'classification'
].join(',')