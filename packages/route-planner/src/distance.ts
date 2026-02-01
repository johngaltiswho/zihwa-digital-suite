import type { Coordinate } from './types'

const EARTH_RADIUS_KM = 6371

export function haversineDistance(a: Coordinate, b: Coordinate) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const dLat = lat2 - lat1
  const dLon = toRad(b.longitude - a.longitude)

  const sinLat = Math.sin(dLat / 2)
  const sinLon = Math.sin(dLon / 2)

  const h =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function buildDistanceMatrix(points: Coordinate[]) {
  return points.map((from, i) =>
    points.map((to, j) => (i === j ? 0 : haversineDistance(from, to)))
  )
}
