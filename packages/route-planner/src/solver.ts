import type {
  PlanningConfig,
  RoutePlanResult,
  Stop,
  Vehicle,
} from './types'

export type RouteSolver = {
  name: string
  plan: (input: {
    stops: Stop[]
    vehicles: Vehicle[]
    config?: PlanningConfig
  }) => RoutePlanResult
}

export function createHeuristicSolver(): RouteSolver {
  return {
    name: 'heuristic:v0',
    plan: ({ stops, vehicles }) => ({
      plans: vehicles.map((vehicle) => ({
        vehicleId: vehicle.id,
        stops: [],
        totalDistanceKm: 0,
        totalMinutes: 0,
        utilization: {},
      })),
      unassignedStops: stops,
      kpis: {
        totalDistanceKm: 0,
        totalMinutes: 0,
        averageUtilization: 0,
      },
      metadata: {
        iterations: 0,
        solver: 'heuristic:v0',
      },
    }),
  }
}
