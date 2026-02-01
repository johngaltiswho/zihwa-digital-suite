# @repo/route-planner

Route optimization utilities for the Pars Optima operations stack. This package
ingests stops, vehicle constraints, and configuration to generate optimized route
plans tailored to our Bangalore, Hosur, and Hyderabad fleet footprint.

## Features (in progress)

- Type-safe input contracts for stops, vehicles, depots, and planning constraints
- Distance matrix utilities (Haversine with future adapters for road networks)
- Extensible solver abstraction allowing heuristic and external solvers
- KPI reporting hooks for downstream dashboards

## Usage

```ts
import { createHeuristicSolver } from '@repo/route-planner'

const solver = createHeuristicSolver()

const result = solver.plan({
  stops,
  vehicles,
  config: {
    allowUnassignedStops: true,
  },
})
```

## Development

```
pnpm --filter @repo/route-planner lint
pnpm --filter @repo/route-planner check-types
```
