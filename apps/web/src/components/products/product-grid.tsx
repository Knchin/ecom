'use client'

import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProductWithRelations } from '@/types/database'

interface ProductGridProps {
  products: ProductWithRelations[]
  loading?: boolean
  skeletonCount?: number
  variant?: 'default' | 'compact'
}

export function ProductGrid({ products, loading = false, skeletonCount = 8, variant = 'default' }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-foreground">No products found</h3>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  )
}

function ProductCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-3 rounded-lg border bg-card">
        <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/4" />
          </div>
          <Skeleton className="mt-4 h-5 w-1/3 rounded" />
        </div>
      </div>
    )
  }

  return (
    <article className="flex flex-col border bg-card rounded-lg overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-5 w-1/3 rounded-full" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="flex-1 h-10" />
        </div>
      </div>
    </article>
  )
}