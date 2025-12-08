'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

interface CompanyFormData {
  name: string
  description: string
  gstNumber: string
  panNumber: string
  tanNumber: string
  cinNumber: string
  pfNumber: string
  esiNumber: string
  ptNumber: string
  address: string
  phone: string
  email: string
  website: string
}

const initialFormData: CompanyFormData = {
  name: '',
  description: '',
  gstNumber: '',
  panNumber: '',
  tanNumber: '',
  cinNumber: '',
  pfNumber: '',
  esiNumber: '',
  ptNumber: '',
  address: '',
  phone: '',
  email: '',
  website: ''
}

export default function CompanyForm() {
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<CompanyFormData>>({})
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof CompanyFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<CompanyFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create company')
      }

      router.push('/dashboard/companies')
      router.refresh()
    } catch (error) {
      console.error('Error creating company:', error)
      alert('Failed to create company. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/companies')
  }

  const inputClassName = "w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
  const textareaClassName = "w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm resize-none"

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`text-2xl font-semibold ${inputClassName} ${errors.name ? 'border-red-300' : ''}`}
              placeholder="Company name"
              autoFocus
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className={textareaClassName}
              placeholder="Add a description..."
            />
          </div>
        </div>

        {/* Tax Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Tax Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="GST Number"
              />
            </div>

            <div>
              <input
                type="text"
                id="panNumber"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="PAN Number"
              />
            </div>

            <div>
              <input
                type="text"
                id="tanNumber"
                name="tanNumber"
                value={formData.tanNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="TAN Number"
              />
            </div>

            <div>
              <input
                type="text"
                id="cinNumber"
                name="cinNumber"
                value={formData.cinNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="CIN Number"
              />
            </div>
          </div>
        </div>

        {/* Labor Compliance */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Labor Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <input
                type="text"
                id="pfNumber"
                name="pfNumber"
                value={formData.pfNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="PF Number"
              />
            </div>

            <div>
              <input
                type="text"
                id="esiNumber"
                name="esiNumber"
                value={formData.esiNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="ESI Number"
              />
            </div>

            <div>
              <input
                type="text"
                id="ptNumber"
                name="ptNumber"
                value={formData.ptNumber}
                onChange={handleChange}
                className={inputClassName}
                placeholder="PT Number"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
          
          <div className="space-y-4">
            <div>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className={textareaClassName}
                placeholder="Address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Phone"
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClassName} ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="Email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Website"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="w-4 h-4" />
          {isLoading ? 'Creating...' : 'Create company'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-medium rounded-md hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
