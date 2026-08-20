import { Country } from '@/types/country'
import { RESTCOUNTRIES_FIELDS } from './constants'

const BASE_URL = 'https://api.restcountries.com/countries/v5'

const authHeaders = {
  Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`,
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function normalize(raw: any, region: string): Country {
  const languages = (raw.languages ?? []).map((l: any) => l.name)
  const currencies = (raw.currencies ?? []).map(
    (c: any) => `${c.name} (${c.symbol})`
  )

  return {
    cca2:         raw.codes?.alpha_2,
    cca3:         raw.codes?.alpha_3,
    name:         raw.names?.common,
    officialName: raw.names?.official,
    capital:      raw.capitals?.[0]?.name ?? 'N/A',
    flag:         raw.flag?.url_svg ?? raw.flag?.url_png ?? '',
    coatOfArms:   undefined, // v5 ya no incluye escudo de armas en la respuesta
    subregion:    raw.subregion ?? '',
    region,
    population:   raw.population,
    area:         raw.area?.kilometers,
    languages,
    currencies,
    latlng:       raw.coordinates ? [raw.coordinates.lat, raw.coordinates.lng] : [0, 0],
    nameEs:       raw.names?.translations?.spa?.common,
  }
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
  const res = await fetch(
    `${BASE_URL}?region=${capitalize(region)}&limit=100&response_fields=${RESTCOUNTRIES_FIELDS}`,
    { next: { revalidate: 86400 }, headers: authHeaders }
  )

  if (!res.ok) throw new Error(`Error fetching countries for region: ${region}`)

  const json = await res.json()
  const data = json.data ?? json
  const raw: any[] = data.objects ?? []

  return raw
    .filter((c) => c.classification?.sovereign === true && c.classification?.un_member === true)
    .map((c) => normalize(c, region))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getCountryByCode(code: string): Promise<Country> {
  const res = await fetch(
    `${BASE_URL}/codes.alpha_2/${code}?response_fields=${RESTCOUNTRIES_FIELDS}`,
    { next: { revalidate: 86400 }, headers: authHeaders }
  )

  if (!res.ok) throw new Error(`Error fetching country: ${code}`)

  const json = await res.json()
  const data = json.data ?? json
  const raw = data.objects?.[0]
  if (!raw) throw new Error(`Country not found: ${code}`)

  return normalize(raw, raw.region?.toLowerCase() ?? '')
}