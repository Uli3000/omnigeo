'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Country } from '@/types/country'
import { CONTINENTS } from '@/lib/constants'
import Link from 'next/link'
import MapPreviewModal from './MapPreviewModal'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  countries: Country[]
  continent: string
}

export default function CountryTable({ countries, continent }: Props) {
  const router = useRouter()
  const { t, language } = useLanguage()
  const currentContinent = CONTINENTS.find((c) => c.key === continent)
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<{code: string; name: string; latlng: [number, number]; area: number; subregion: string; nameEs?: string} | null>(null)

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.capital.toLowerCase().includes(search.toLowerCase()) ||
    c.subregion.toLowerCase().includes(search.toLowerCase())
    )
    
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginatedCountries = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

  return (
    <div className="min-h-screen bg-[#11131B] text-white px-12 py-16">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
                {currentContinent?.label} {t('study.title')}
            </h1>
            <div className="flex gap-2">
                {CONTINENTS.map((c) => (
                <Link
                    href={`/study/${c.key}`}
                    key={c.key}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    c.key === continent
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                    }`}
                >
                    {t(`continent.${c.key}`)}
                </Link>
                ))}
            </div>
            </div>

            <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1 text-center">Total</p>
            <p className="text-3xl font-semibold">{countries.length} <span className="text-sm text-white/30 font-normal">{t('study.countries').charAt(0).toUpperCase() + t('study.countries').slice(1,t('study.countries').length)}.</span></p>
            </div>
        </div>

        <div className="mb-4 flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus-within:border-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
                type="text"
                placeholder={t('study.search')}
                value={search}
                onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
                }}
                className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
            />
            {search && (
                <button
                onClick={() => { setSearch(''); setCurrentPage(1) }}
                className="text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
                >
                ×
                </button>
            )}
        </div>
      
        <div className="rounded-lg border border-white/10 overflow-hidden">        
        <div className="grid grid-cols-[60px_1fr_1fr_160px_80px] bg-white/5 px-6 py-3 border-b border-white/10 gap-6">
            <span className="text-xs text-white/40 uppercase tracking-widest">{t('study.flag')}</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">{t('study.country')}</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">{t('study.capital')}</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">{t('study.region')}</span>
            <span className="text-xs text-white/40 uppercase tracking-widest text-center">{t('study.interactive')}</span>
        </div>

        {paginatedCountries.map((country, index) => (
            <div
            key={country.cca2}
            onClick={() => router.push(`/study/${continent}/${country.cca2.toLowerCase()}`)}
            className={`grid grid-cols-[60px_1fr_1fr_160px_80px] px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer gap-6 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-white/2'
            }`}
            >
                {country.flag ? (
                    <img
                        src={country.flag}
                        alt={`Bandera de ${country.name}`}
                        className="w-8 h-5 object-cover rounded-sm"
                    />
                ) : (
                    <div className="w-8 h-5 rounded-sm bg-white/10" />
                )}
                <span className="text-sm font-medium">{language === 'es' && country.nameEs ? country.nameEs : country.name}</span>
                <span className="text-sm text-white/60">{country.capital}</span>
                <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/60 w-fit uppercase tracking-wide">{country.subregion}</span>
                <div className="flex justify-center">
                    <button onClick={(e) => {e.stopPropagation(); setSelectedCountry({ code: country.cca3, name: country.name,latlng: country.latlng, area: country.area, subregion: country.subregion, nameEs: country.nameEs, })}} className="p-2 rounded hover:bg-white/10 transition-colors text-white/40 hover:text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                        <line x1="9" y1="3" x2="9" y2="18"/>
                        <line x1="15" y1="6" x2="15" y2="21"/>
                    </svg>
                    </button>
                </div>
            </div>
        ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <span className="text-xs text-white/40">
                {t('study.showing')} {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} {t('study.of')} {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} {t('study.of')} {filtered.length} {t('study.countries')}
                {search && ` · ${t('study.filtered')} ${countries.length}`}
            </span>

            <div className="flex items-center gap-1">
                <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-white/10 transition-colors text-white/40 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-xs transition-colors ${
                        page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-white/40 hover:bg-white/10 hover:text-white/80'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-white/10 transition-colors text-white/40 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                ›
                </button>
            </div>
        </div>

        <MapPreviewModal
            isOpen={selectedCountry !== null}
            onClose={() => setSelectedCountry(null)}
            countryCode={selectedCountry?.code ?? ''}
            countryName={selectedCountry?.name ?? ''}
            continent={continent}
            latlng={selectedCountry?.latlng ?? [0, 0]}
            area={selectedCountry?.area ?? 0}
            subregion={selectedCountry?.subregion ?? ''}
            nameEs={selectedCountry?.nameEs}
        />

    </div>
  )
}