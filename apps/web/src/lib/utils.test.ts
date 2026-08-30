import { describe, expect, it } from 'vitest'
import { cn, formatPriceFromCents, getDayName, getDayShortName, isPromotionActive, slugify } from '@shop-platform/ui'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('filters falsy values', () => {
    expect(cn('a', null, undefined, false, 'b')).toBe('a b')
  })
})

describe('formatPriceFromCents', () => {
  it('formats cents as dollars', () => {
    expect(formatPriceFromCents(123456)).toBe('$1234.56')
  })

  it('formats zero and small values', () => {
    expect(formatPriceFromCents(0)).toBe('$0.00')
    expect(formatPriceFromCents(99)).toBe('$0.99')
  })
})

describe('getDayName / getDayShortName', () => {
  it('maps day indexes to names', () => {
    expect(getDayName(0)).toBe('Sunday')
    expect(getDayName(6)).toBe('Saturday')
    expect(getDayName(7)).toBe('')
  })

  it('maps day indexes to short names', () => {
    expect(getDayShortName(0)).toBe('Sun')
    expect(getDayShortName(6)).toBe('Sat')
    expect(getDayShortName(-1)).toBe('')
  })
})

describe('isPromotionActive', () => {
  const base = { start_date: '2020-01-01', end_date: '2999-01-01', active: true }

  it('returns true for active promotions in range', () => {
    expect(isPromotionActive(base)).toBe(true)
  })

  it('returns false when inactive', () => {
    expect(isPromotionActive({ ...base, active: false })).toBe(false)
  })

  it('returns false when out of range', () => {
    expect(
      isPromotionActive({ start_date: '2000-01-01', end_date: '2000-01-02', active: true }),
    ).toBe(false)
  })
})

describe('slugify', () => {
  it('generates slugs from text', () => {
    expect(slugify('Fresh Bread & Pastries')).toBe('fresh-bread-pastries')
    expect(slugify('  Hello   World  ')).toBe('hello-world')
  })
})