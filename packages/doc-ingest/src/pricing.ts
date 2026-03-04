import type { ExtractionUsage } from './types'

type OpenAIUsageShape = {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
}

type ModelPricing = {
  inputPer1M: number
  outputPer1M: number
  note: string
}

function getUsdToInrRate(): number {
  const raw = process.env.OPENAI_USD_INR_RATE
  const parsed = raw ? Number(raw) : NaN
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  return 83.0
}

function getModelPricing(model: string): ModelPricing | null {
  const m = model.toLowerCase()

  // OpenAI pricing reference: https://openai.com/api/pricing/
  if (m.includes('gpt-4o-mini')) {
    return {
      inputPer1M: 0.15,
      outputPer1M: 0.60,
      note: 'Estimated from OpenAI API pricing for gpt-4o-mini.',
    }
  }

  return null
}

export function buildOpenAIUsage(
  usage: OpenAIUsageShape | undefined,
  model: string
): ExtractionUsage | undefined {
  if (!usage) return undefined

  const inputTokens = usage.prompt_tokens ?? 0
  const outputTokens = usage.completion_tokens ?? 0
  const totalTokens = usage.total_tokens ?? inputTokens + outputTokens
  const pricing = getModelPricing(model)
  const usdToInr = getUsdToInrRate()

  let usdCost: number | undefined
  let inrCost: number | undefined
  let pricingNote = 'Token usage captured; model pricing unavailable for cost estimate.'

  if (pricing) {
    usdCost =
      (inputTokens / 1_000_000) * pricing.inputPer1M +
      (outputTokens / 1_000_000) * pricing.outputPer1M
    inrCost = usdCost * usdToInr
    pricingNote = pricing.note
  }

  return {
    provider: 'openai',
    model,
    inputTokens,
    outputTokens,
    totalTokens,
    usdCost,
    inrCost,
    usdToInrRate: usdToInr,
    pricingNote,
  }
}

export function mergeUsage(
  first?: ExtractionUsage,
  second?: ExtractionUsage
): ExtractionUsage | undefined {
  if (!first && !second) return undefined
  if (!first) return second
  if (!second) return first

  return {
    provider:
      first.provider === second.provider ? first.provider : 'unknown',
    model:
      first.model === second.model
        ? first.model
        : `${first.model || 'unknown'} + ${second.model || 'unknown'}`,
    inputTokens: (first.inputTokens || 0) + (second.inputTokens || 0),
    outputTokens: (first.outputTokens || 0) + (second.outputTokens || 0),
    totalTokens: (first.totalTokens || 0) + (second.totalTokens || 0),
    usdCost:
      first.usdCost !== undefined || second.usdCost !== undefined
        ? (first.usdCost || 0) + (second.usdCost || 0)
        : undefined,
    inrCost:
      first.inrCost !== undefined || second.inrCost !== undefined
        ? (first.inrCost || 0) + (second.inrCost || 0)
        : undefined,
    usdToInrRate: second.usdToInrRate || first.usdToInrRate,
    pricingNote:
      first.pricingNote === second.pricingNote
        ? first.pricingNote
        : 'Aggregated usage across multiple AI calls.',
  }
}
