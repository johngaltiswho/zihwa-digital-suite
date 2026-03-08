'use client'

import { FormEvent, useState } from 'react'
import DraftCard from './DraftCard'

type Message = {
  id: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  metadata?: Record<string, unknown> | null
}

type DraftPreview = {
  id: string
  status?: string
  payload?: {
    type?: string
    vendorName?: string
    merchant?: string
    amount?: number
    currency?: string
    date?: string
    billNumber?: string
  }
}

function getDraftFromMetadata(metadata: Record<string, unknown> | null | undefined) {
  const result = metadata?.result
  if (!result || typeof result !== 'object') return null
  const withId = result as { id?: unknown }
  return typeof withId.id === 'string' ? (result as DraftPreview) : null
}

const tools = [
  'search_vendors',
  'create_expense_draft',
  'ingest_expense_list',
  'attach_document_to_draft',
  'validate_draft',
  'submit_for_approval',
  'approve_and_post',
  'get_company_summary',
] as const

export default function ChatThread({ companyId }: { companyId: string }) {
  const [threadId, setThreadId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [toolName, setToolName] = useState<(typeof tools)[number] | ''>('')
  const [argsText, setArgsText] = useState('{}')
  const [messages, setMessages] = useState<Message[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [expenseListText, setExpenseListText] = useState('')

  const onSend = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      const args = JSON.parse(argsText || '{}')
      const res = await fetch(`/api/companies/${companyId}/copilot/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          message,
          toolName: toolName || undefined,
          args,
        }),
      })

      const json = await res.json()

      if (!json.success && !json.data) {
        throw new Error(json.error || 'Copilot action failed')
      }

      if (json.data?.threadId) setThreadId(json.data.threadId)
      if (Array.isArray(json.data?.messages)) {
        setMessages(json.data.messages)
      }
      setMessage('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Copilot action failed')
    } finally {
      setBusy(false)
    }
  }

  const onIngestExpenseList = async (event: FormEvent) => {
    event.preventDefault()
    if (!expenseListText.trim()) {
      setError('Paste expense rows first.')
      return
    }

    setError('')
    setBusy(true)

    try {
      const res = await fetch(`/api/companies/${companyId}/copilot/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          message: expenseListText,
        }),
      })

      const json = await res.json()
      if (json.data?.threadId) setThreadId(json.data.threadId)
      if (Array.isArray(json.data?.messages)) {
        setMessages(json.data.messages)
      }
      if (!json.success) {
        throw new Error(json.error || 'Expense import failed')
      }
      setExpenseListText('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Expense import failed')
    } finally {
      setBusy(false)
    }
  }

  const onApproveAll = async () => {
    setError('')
    setBusy(true)
    try {
      const res = await fetch(`/api/companies/${companyId}/copilot/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          message: 'approve all',
        }),
      })
      const json = await res.json()
      if (!json.success && !json.data) {
        throw new Error(json.error || 'Approve all failed')
      }
      if (json.data?.threadId) setThreadId(json.data.threadId)
      if (Array.isArray(json.data?.messages)) {
        setMessages(json.data.messages)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Approve all failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">
              Start with plain text or choose a tool call to create and move drafts through approval.
            </p>
          )}
          {messages.map((msg) => {
            const draft = getDraftFromMetadata(msg.metadata)
            return (
              <div key={msg.id} className={`rounded-lg px-3 py-2 text-sm ${msg.role === 'USER' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
                <p className="mb-1 text-xs opacity-70">{msg.role}</p>
                <p>{msg.content}</p>
                {draft && (
                  <div className="mt-2">
                    <DraftCard draft={draft} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <form className="mt-4 space-y-3 border-t border-slate-200 pt-4" onSubmit={onSend}>
          <label className="block text-sm">
            <span className="text-slate-700">Message</span>
            <textarea
              className="mt-1 h-24 w-full rounded-md border border-slate-200 p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Ask follow-ups like "show me the entries" or "approve all"'
            />
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Running…' : 'Send'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Batch actions</h3>
        <form className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3" onSubmit={onIngestExpenseList}>
          <label className="block text-sm">
            <span className="text-slate-700">Paste expense list (CSV or tab-separated)</span>
            <textarea
              className="mt-1 h-28 w-full rounded-md border border-slate-200 p-2 font-mono text-xs"
              value={expenseListText}
              onChange={(e) => setExpenseListText(e.target.value)}
              placeholder={`date,vendor,amount,description,billNumber\n2026-03-01,Indian Oil,2350,Fuel expense,FUEL-001\n2026-03-02,Uber,890,Local travel,TRAVEL-221`}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Analyzing…' : 'Analyze pasted expenses'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onApproveAll}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Approve all and post drafts
          </button>
        </form>

        <form className="mt-3 space-y-3">
          <label className="block text-sm">
            <span className="text-slate-700">Tool (optional)</span>
            <select
              className="mt-1 w-full rounded-md border border-slate-200 p-2"
              value={toolName}
              onChange={(e) => setToolName(e.target.value as (typeof tools)[number] | '')}
            >
              <option value="">No tool (assistant reply only)</option>
              {tools.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-700">Tool args (JSON)</span>
            <textarea
              className="mt-1 h-20 w-full rounded-md border border-slate-200 p-2 font-mono text-xs"
              value={argsText}
              onChange={(e) => setArgsText(e.target.value)}
            />
          </label>
        </form>
      </section>
    </div>
  )
}
