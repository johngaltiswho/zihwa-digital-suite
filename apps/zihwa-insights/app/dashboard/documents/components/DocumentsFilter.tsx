'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

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
  const selectedCompanyId = searchParams.get('company') || ''

  const handleCompanyChange = (companyId: string) => {
    const url = new URL(window.location.href)
    if (companyId) {
      url.searchParams.set('company', companyId)
    } else {
      url.searchParams.delete('company')
    }
    router.push(url.toString())
  }

  return (
    <div className="flex items-center gap-4">
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
      
      <select 
        className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-300"
        value={selectedCompanyId}
        onChange={(e) => handleCompanyChange(e.target.value)}
      >
        <option value="">All companies</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  )
}