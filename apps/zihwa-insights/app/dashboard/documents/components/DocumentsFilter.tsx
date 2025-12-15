'use client'

import { Search, Building2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Company {
  id: string
  name: string
}

interface DocumentsFilterProps {
  companies: Company[]
}

export default function DocumentsFilter({ companies }: DocumentsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [companyOptions, setCompanyOptions] = useState<Company[]>(companies)
  const selectedCompanyId = searchParams.get('company') || ''

  useEffect(() => {
    setCompanyOptions(companies)
  }, [companies])

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch('/api/companies')
        if (!response.ok) return
        const data = (await response.json()) as Company[]
        setCompanyOptions(
          data.map((company) => ({
            id: company.id,
            name: company.name,
          }))
        )
      } catch (error) {
        console.error('Failed to load companies for filter', error)
      }
    }

    if (companies.length === 0) {
      fetchCompanies()
    }
  }, [companies.length])

  const handleCompanyChange = (companyId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (companyId) {
      params.set('company', companyId)
    } else {
      params.delete('company')
    }
    const query = params.toString()
    router.push(query ? `/dashboard/documents?${query}` : '/dashboard/documents')
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
        <Building2 className="h-4 w-4 text-gray-500" />
        <label htmlFor="documents-company-filter" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Companies
        </label>
        <select
          id="documents-company-filter"
          className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
          value={selectedCompanyId}
          onChange={(e) => handleCompanyChange(e.target.value)}
        >
          <option value="">All</option>
          {companyOptions.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <Link
        href="/dashboard/companies?action=add"
        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Building2 className="h-4 w-4 text-gray-500" />
        New company
      </Link>
    </div>
  )
}
