export function diffObjects(
  before: Record<string, unknown>,
  after: Record<string, unknown>
) {
  const changes: Array<{ field: string; before: unknown; after: unknown }> = []
  const keys = new Set([...Object.keys(before), ...Object.keys(after)])

  for (const key of keys) {
    const a = before[key]
    const b = after[key]
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changes.push({ field: key, before: a, after: b })
    }
  }

  return {
    changed: changes.length > 0,
    changes,
  }
}
