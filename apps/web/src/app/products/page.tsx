import { Metadata } from 'next'
import { ChevronDown, Filter, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@shop-platform/ui'
import { Input } from '@shop-platform/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shop-platform/ui'
import { Separator } from '@shop-platform/ui'
import { cn } from '@shop-platform/ui'
import { ProductGrid } from '@/components/products/product-grid'
import { CategoryGrid } from '@/components/categories/category-card'
import { getCategories, getProducts } from '@/lib/data'
import type { ProductAvailability } from '@/types/database'

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    availability?: string
    featured?: string
    new?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full range of household products including kitchen essentials, cleaning supplies, bathroom products, and storage solutions.',
}

const availabilityOptions: { value: ProductAvailability; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'UNAVAILABLE', label: 'Unavailable' },
  { value: 'ASK_IN_STORE', label: 'Ask in Store' },
]

const sortOptions = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'price_cents_asc', label: 'Price: Low to High' },
  { value: 'price_cents_desc', label: 'Price: High to Low' },
  { value: 'title_asc', label: 'Name: A to Z' },
  { value: 'title_desc', label: 'Name: Z to A' },
]

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1', 10)
  const limit = 20
  const offset = (page - 1) * limit

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: params.category,
      search: params.q,
      availability: params.availability as ProductAvailability,
      featured: params.featured === 'true',
      newArrival: params.new === 'true',
      minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
      sortBy: (params.sort?.split('_')[0] as 'created_at' | 'price_cents' | 'title') ?? 'created_at',
      sortOrder: (params.sort?.split('_')[1] as 'asc' | 'desc') ?? 'desc',
      limit,
      offset,
    }),
  ])

  const totalPages = Math.ceil(total / limit)
  const hasActiveFilters = params.q || params.category || params.availability || params.featured === 'true' || params.new === 'true' || params.minPrice || params.maxPrice

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            {total} product{total !== 1 ? 's' : ''} found
            {params.q && <span className="ml-2">for "{params.q}"</span>}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Search</h2>
                <form method="get" className="space-y-3">
                  <Input
                    name="q"
                    placeholder="Search products..."
                    value={params.q ?? ''}
                    className="w-full"
                  />
                  <Button type="submit" className="w-full">Search</Button>
                  {params.q && (
                    <a href="/products" className="block text-center text-sm text-muted-foreground hover:text-foreground">
                      Clear search
                    </a>
                  )}
                </form>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Categories</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => window.location.href = '/products'}
                    className={cn('w-full text-left text-sm transition-colors', !params.category ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground')}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        const url = new URL(window.location.href)
                        url.searchParams.set('category', category.slug)
                        url.searchParams.delete('page')
                        window.location.href = url.toString()
                      }}
                      className={cn('w-full text-left text-sm transition-colors', params.category === category.slug ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground')}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Availability</h2>
                <Select
                  value={params.availability ?? 'all'}
                  onValueChange={(value: string) => {
                    const url = new URL(window.location.href)
                    if (value === 'all') url.searchParams.delete('availability')
                    else url.searchParams.set('availability', value)
                    url.searchParams.delete('page')
                    window.location.href = url.toString()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {availabilityOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Special</h2>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.featured === 'true'}
                    onChange={e => {
                      const url = new URL(window.location.href)
                      if (e.target.checked) url.searchParams.set('featured', 'true')
                      else url.searchParams.delete('featured')
                      url.searchParams.delete('page')
                      window.location.href = url.toString()
                    }}
                    className="rounded border-input"
                  />
                  <span>Featured Products</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={params.new === 'true'}
                    onChange={e => {
                      const url = new URL(window.location.href)
                      if (e.target.checked) url.searchParams.set('new', 'true')
                      else url.searchParams.delete('new')
                      url.searchParams.delete('page')
                      window.location.href = url.toString()
                    }}
                    className="rounded border-input"
                  />
                  <span>New Arrivals</span>
                </label>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Price Range</h2>
                <form method="get" className="space-y-2">
                  {Object.entries(params).filter(([k]) => !['minPrice', 'maxPrice', 'page'].includes(k)).map(([k, v]) => (
                    <input key={k} type="hidden" name={k} value={v as string} />
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="minPrice"
                      type="number"
                      placeholder="Min"
                      value={params.minPrice ?? ''}
                      min="0"
                      step="100"
                      className="text-sm"
                    />
                    <Input
                      name="maxPrice"
                      type="number"
                      placeholder="Max"
                      value={params.maxPrice ?? ''}
                      min="0"
                      step="100"
                      className="text-sm"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="sm">Apply</Button>
                  {(params.minPrice || params.maxPrice) && (
                    <a href="/products" className="block text-center text-sm text-muted-foreground hover:text-foreground">Clear</a>
                  )}
                </form>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Sort By</h2>
                <Select
                  value={params.sort ?? 'created_at_desc'}
                  onValueChange={(value: string) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('sort', value)
                    url.searchParams.delete('page')
                    window.location.href = url.toString()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" className="w-full gap-2" onClick={() => window.location.href = '/products'}>
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {hasActiveFilters ? 'Filters active' : 'No filters applied'}
                </span>
              </div>
            </div>

            <ProductGrid products={products} />

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                {page > 1 && (
                  <a href={`/products?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-md transition-colors">
                    Previous
                  </a>
                )}
                <span className="px-3 py-2 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <a href={`/products?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-md transition-colors">
                    Next
                  </a>
                )}
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
