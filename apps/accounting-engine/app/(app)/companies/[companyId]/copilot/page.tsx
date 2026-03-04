import ChatThread from '@/components/copilot/ChatThread'

export default async function CopilotPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-sky-700">Conversation mode</p>
        <h1 className="text-2xl font-semibold text-slate-900">Accounting copilot</h1>
        <p className="text-sm text-slate-600">Create drafts, validate and move to approval without leaving chat.</p>
      </div>
      <ChatThread companyId={companyId} />
    </div>
  )
}
