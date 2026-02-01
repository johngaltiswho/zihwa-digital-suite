export type Coordinate = {
  latitude: number
  longitude: number
}

export type TimeWindow = {
  start: string // ISO 8601 time
  end: string // ISO 8601 time
}

export type Stop = {
  id: string
  coordinate: Coordinate
  serviceMinutes: number
  demand?: {
    volume?: number
    weight?: number
    pallets?: number
    temperatureZone?: 'ambient' | 'chilled' | 'frozen'
  }
  timeWindows?: TimeWindow[]
  priority?: 'high' | 'normal' | 'low'
  tags?: string[]
}

export type Depot = {
  id: string
  coordinate: Coordinate
  timeWindow?: TimeWindow
}

export type Vehicle = {
  id: string
  name?: string
  startDepot: Depot
  endDepot?: Depot
  capacity?: {
    volume?: number
    weight?: number
    pallets?: number
  }
  shiftMinutes?: number
  maxDistanceKm?: number
  attributes?: string[]
}

export type RoutingConstraint = {
  attribute?: string
  forbiddenPairings?: string[]
  requiredAttributes?: string[]
}

export type PlanningConfig = {
  constraints?: RoutingConstraint[]
  allowUnassignedStops?: boolean
  maxIterations?: number
  objectiveWeights?: {
    distance?: number
    time?: number
    priority?: number
    missedTimeWindowPenalty?: number
  }
}

export type PlannedStop = {
  stopId: string
  eta: string
  serviceStart: string
  serviceEnd: string
  distanceFromPreviousKm: number
  travelMinutes: number
}

export type RoutePlan = {
  vehicleId: string
  stops: PlannedStop[]
  totalDistanceKm: number
  totalMinutes: number
  utilization: {
    volume?: number
    weight?: number
    pallets?: number
  }
}

export type RoutePlanResult = {
  plans: RoutePlan[]
  unassignedStops: Stop[]
  kpis: {
    totalDistanceKm: number
    totalMinutes: number
    averageUtilization: number
  }
  metadata?: {
    iterations?: number
    solver?: string
  }
}
