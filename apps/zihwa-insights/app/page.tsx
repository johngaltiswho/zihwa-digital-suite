'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [pos, setPos] = useState(0)

  useEffect(() => {
    let frame: number
    let start: number | null = null

    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      setPos((Math.sin(elapsed / 3000) + 1) / 2) // 0 to 1 oscillating
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const r1 = Math.round(224 + pos * 10)  // #e0f5f1 → slightly lighter teal
  const g1 = Math.round(245 - pos * 10)
  const b1 = Math.round(241 + pos * 14)

  const bg = `linear-gradient(${135 + pos * 30}deg, rgb(${r1},${g1},${b1}) 0%, #e0f9f5 40%, #ffffff 100%)`

  return (
    <div className="min-h-screen flex flex-col transition-all duration-1000" style={{ background: bg }}>

      {/* ── Navbar ── */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            ZI
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-gray-900">Zihwa</span>
            <span className="text-sm font-bold text-gray-900">Insights</span>
          </div>
        </div>
        <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Sign In
        </Link>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 px-8 py-4 max-w-5xl w-full mx-auto">

        <div className="inline-block px-3 py-1 border border-gray-300 rounded-full text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">
          Zihwa Insights
        </div>

        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-2 max-w-xl">
          Digital Operations for<br />
          HR, Finance, and<br />
          Compliance
        </h1>

        <p className="text-base text-gray-600 leading-relaxed max-w-xl mb-6">
          We build focused internal products that reduce manual work, improve control, and give
          teams better visibility across critical workflows.
        </p>

        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="inline-block px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-block px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold rounded-lg transition-colors duration-200 bg-white"
          >
            Sign Up
          </Link>
        </div>

        {/* ── App Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Subdomain App
            </p>
            <h2 className="text-lg font-bold text-gray-900 mb-3">HR Operations</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Candidate tracking, employee records, document collection,
              and deadline visibility for fast hiring and cleaner HR operations.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Subdomain App
            </p>
            <h2 className="text-lg font-bold text-gray-900 mb-3">AI Accounting Engine</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-assisted accounting workflows to process documents,
              improve data quality, and generate actionable financial insights.
            </p>
          </div>
        </div>

        {/* Divider + What We Do section — matches landing page */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">What We Do</h2>
          <p className="text-sm text-gray-600">
            Zihwa Insights delivers practical software for business teams. Instead of one bloated platform, we build purpose-fit applications connected by shared standards and secure access.
          </p>
        </div>


      </main>

      {/* ── Footer ── */}
      <footer className="px-8 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Zihwa Insights. All rights reserved.
        </p>
      </footer>

    </div>
  )
}