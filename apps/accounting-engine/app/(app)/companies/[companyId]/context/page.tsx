import ContextWizard from '@/components/context/ContextWizard'

export default async function CompanyContextPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-sky-700">Company setup</p>
        <h1 className="text-2xl font-semibold text-slate-900">Accounting context wizard</h1>
        <p className="text-sm text-slate-600">Define posting defaults, rules and risk controls for this company.</p>
      </div>
      <ContextWizard companyId={companyId} />
    </div>
  )
}
