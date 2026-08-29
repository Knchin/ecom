'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@shop-platform/ui'
import type { Category } from '@/types/database'

interface CategoryCardProps {
  category: Category
  productCount?: number
}

export function CategoryCard({ category, productCount = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
      aria-label={`${category.name} - ${productCount} products`}
    >
      <div className="aspect-square relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden="true" />
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <svg className="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="text-lg font-semibold text-white drop-shadow-lg">{category.name}</h3>
        <p className="text-sm text-white/80 drop-shadow">{productCount} products</p>
      </div>
    </Link>
  )
}

export function CategoryGrid({ categories, loading = false }: { categories: Category[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-foreground">No categories available</h3>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="mt-2 h-4 w-1/4 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}