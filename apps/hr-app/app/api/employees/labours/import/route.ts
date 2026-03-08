// apps/hr-app/app/api/employees/labours/import/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { csvData } = await request.json()
    // Split by any newline format and remove empty lines
    const lines = csvData.split(/\r?\n/).filter((line: string) => line.trim() !== '')
    // Change this line to ensure dataRows is string[]
const dataRows: string[] = lines.slice(1) // Skip headers
    
    // Get all companies once for efficient matching
    const companies = await prisma.company.findMany()
    let count = 0

    for (const row of dataRows) {
      // Split by comma
      const rawCols = row.split(',')
      
      // Clean data: trim everything
      const cols = rawCols.map((s: string) => s.trim())

      const labourId = cols[0]
      const name = cols[1]
      const dobStr = cols[2]
      const mobile = cols[3]
      const designation = cols[4]
      
      // IMPROVED: Handle company names that might have commas or trailing empty columns
      // Filter out empty strings from the remaining columns before joining
      const companyNamePart = cols.slice(5).filter(val => val !== '').join(', ')

      // Basic validation: skip if crucial info is missing
      if (!labourId || !name || !companyNamePart) continue

      // Find company using flexible matching
      const company = companies.find(c => 
        companyNamePart.toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(companyNamePart.toLowerCase())
      )

      if (!company) {
        console.error(`Row Error: Company "${companyNamePart}" not found for ID ${labourId}`)
        continue
      }

      // Handle names with multiple spaces
      const nameParts = name.trim().split(/\s+/)
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ' '

      // SAFE DATE PARSING
      let parsedDob = null
      if (dobStr && dobStr !== '') {
        const d = new Date(dobStr)
        // Only use if it's a valid date object
        if (!isNaN(d.getTime())) {
          parsedDob = d
        }
      }

      await prisma.labour.upsert({
        where: { 
          companyId_labourId: { companyId: company.id, labourId } 
        },
        update: {
          firstName,
          lastName,
          phone: mobile,
          dob: parsedDob,
          designation
        },
        create: {
          labourId,
          companyId: company.id,
          firstName,
          lastName,
          phone: mobile,
          dob: parsedDob,
          designation,
          status: 'ACTIVE'
        }
      })
      count++
    }
    
    return NextResponse.json({ success: true, count })
  } catch (error: unknown) {                                              // ✅ unknown
    console.error('CRITICAL_IMPORT_ERROR:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    )
  }
}
