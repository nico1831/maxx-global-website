import crypto from 'node:crypto'

const ENTITY_MAP = {
  amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'",
  nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  ndash: '–', mdash: '—', hellip: '…',
}

function decodeEntities(str) {
  return str.replace(/&(#\d+|[a-zA-Z]+);/g, (m, code) => {
    if (code.startsWith('#')) return String.fromCharCode(Number(code.slice(1)))
    return ENTITY_MAP[code] ?? m
  })
}

export function htmlToParagraphs(html) {
  if (!html) return []
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|div|h[1-6])>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
  return decodeEntities(text)
    .split(/\n+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

// Heading-ish lines: short, no terminal punctuation, often a label like
// "Description:" or "KEY FEATURES:" — filtered out of body copy.
function isHeading(p) {
  return p.length < 40 && /:$/.test(p)
}

export function toShortDescription(paragraphs) {
  const first = paragraphs.find((p) => !p.startsWith('•') && !isHeading(p))
  if (!first) return undefined
  if (first.length <= 160) return first
  return first.slice(0, 157).replace(/\s+\S*$/, '') + '…'
}

export function toKeyFeatures(paragraphs) {
  return paragraphs
    .filter((p) => p.startsWith('• '))
    .map((p) => p.slice(2).trim())
    .filter(Boolean)
    .slice(0, 6)
}

export function toDescriptionBlocks(paragraphs) {
  return paragraphs
    .filter((p) => !p.startsWith('•') && !isHeading(p))
    .slice(0, 6)
    .map((text) => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: crypto.randomUUID(), text, marks: [] }],
    }))
}
