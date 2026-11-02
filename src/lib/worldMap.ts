// Turns real lat/lng from Sanity into positions on public/images/world-map.jpg.
//
// The image is a stylised stock outline, not an equirectangular map: it has side margins
// and uneven latitude spacing. Longitude is linear, but latitude has no clean formula, so
// it is interpolated between these points, measured off the image's own coastlines.
// [latitude, top %], north to south.
const LATITUDE_STOPS: [number, number][] = [
  [59.8, 34.52],  // Cape Farewell
  [51, 41.41],    // Kamchatka
  [47.5, 42.91],  // Newfoundland
  [40.4, 46.56],  // Cape Mendocino
  [34.3, 51.51],  // Southern Korea
  [31, 53.14],    // Kyushu
  [18.6, 58.64],  // Northern Luzon
  [5.9, 64.61],   // Sri Lanka
  [-26.1, 76.83], // Steep Point, Australia
  [-28.6, 78.43], // Cape Byron
  [-43.6, 85.78], // Tasmania
  [-55, 94.2],    // Cape Horn
]

function latToTop(lat: number) {
  const stops = LATITUDE_STOPS
  // Beyond either end, carry on along the nearest segment
  const below = stops.findIndex(([stopLat]) => stopLat <= lat)
  const seg = below === -1 ? stops.length - 2 : Math.max(below - 1, 0)
  const [lat0, top0] = stops[seg]
  const [lat1, top1] = stops[seg + 1]
  return top0 + ((lat - lat0) / (lat1 - lat0)) * (top1 - top0)
}

export function toMapPosition({ lat, lng }: { lat: number; lng: number }) {
  return { left: 0.2427 * lng + 46.615, top: latToTop(lat) }
}

export type MapPin = { label: string; left: number; top: number; side: 'l' | 'r'; key: string }

function pin(place: string, name: string, coordinates: { lat: number; lng: number }, key: string): MapPin {
  const { left, top } = toMapPosition(coordinates)
  // Labels open toward the middle of the map so they stay inside the canvas
  return { label: `${place} — ${name}`, left, top, side: left > 60 ? 'l' : 'r', key }
}

// One pin per origin. A brand with a secondary origin (SportsArt, Spirit) gets two, and
// the primary one is the brand's headquarters.
export function mapPinsFrom(brands: any[]): MapPin[] {
  return brands.flatMap((brand) => {
    const place = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(', ')
    const second = brand.secondaryOrigin
    const pins: MapPin[] = []
    if (brand.coordinates) {
      const name = second?.coordinates ? `${brand.name} HQ` : brand.name
      pins.push(pin(place(brand.originCity, brand.originCountry), name, brand.coordinates, brand.slug))
    }
    if (second?.coordinates) {
      const name = [brand.name, second.label].filter(Boolean).join(' ')
      pins.push(pin(place(second.city, second.country), name, second.coordinates, brand.slug))
    }
    return pins
  })
}
