'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Tag, Truck, MapPin, Phone, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatPriceFromCents } from '@/lib/utils'
import type { ProductWithRelations } from '@/types/database'

interface ProductCardProps {
  product: ProductWithRelations
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const primaryImage = product.images.find(img => img.is_primary) ?? product.images[0]
  const hasPromotion = product.promotions.length > 0
  const currentPromotion = product.promotions[0]
  const displayPrice = hasPromotion && currentPromotion?.promotional_price_cents
    ? currentPromotion.promotional_price_cents
    : product.price_cents
  const originalPrice = hasPromotion ? product.price_cents : null

  const availabilityLabels: Record<string, { label: string; className: string }> = {
    AVAILABLE: { label: 'Available', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    UNAVAILABLE: { label: 'Unavailable', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    ASK_IN_STORE: { label: 'Ask in Store', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  }

  const availability = availabilityLabels[product.availability] ?? availabilityLabels.AVAILABLE

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.slug}`} className="group flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {primaryImage ? (
            <Image
              src={`/api/images/${primaryImage.storage_path}`}
              alt={primaryImage.alt_text ?? product.title}
              fill
              sizes="80px"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Truck className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{formatPriceFromCents(displayPrice)}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{formatPriceFromCents(originalPrice)}</span>
              )}
            </div>
          </div>
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', availability.className)}>
            {availability.label}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <article className="group flex flex-col border bg-card rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden" aria-label={`${product.title} - ${formatPriceFromCents(displayPrice)}`}>
        <div className="absolute inset-0 bg-muted" aria-hidden="true" />
        {primaryImage ? (
          <Image
            src={`/api/images/${primaryImage.storage_path}`}
            alt={primaryImage.alt_text ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Truck className="h-12 w-12" />
          </div>
        )}
        {(product.is_featured || product.is_new_arrival) && (
          <div className="absolute top-2 left-2 flex gap-1">
            {product.is_new_arrival && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                New
              </span>
            )}
            {product.is_featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                Featured
              </span>
            )}
          </div>
        )}
        {hasPromotion && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
              Sale
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur" aria-label="Share product">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>
          {product.category && (
            <Link href={`/categories/${product.category.slug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              {product.category.name}
            </Link>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">{formatPriceFromCents(displayPrice)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPriceFromCents(originalPrice)}</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', availability.className)}>
            {availability.label}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {product.brand && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {product.brand}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`tel:${shopPhone}`} className="flex-1" aria-label="Call shop">
            <Button variant="outline" className="w-full justify-center gap-2" size="sm">
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </Link>
          <Link href={`https://wa.me/${shopWhatsApp}`} target="_blank" rel="noopener noreferrer" className="flex-1" aria-label="WhatsApp">
            <Button variant="outline" className="w-full justify-center gap-2" size="sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.48-1.653-1.68-.173-.2-.017-.427.13-.644.149-.198.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378 9.86 9.86 0 0 1-.399-.445l-.97-.894-3.722.36a.507.507 0 0 1-.455-.353l-.36-2.036a.516.516 0 0 1 .17-.585l1.513-3.257a9.877 9.877 0 0 1 2.243-5.421c1.562-1.378 3.656-2.067 5.824-2.067 2.256 0 4.372.73 5.94 2.156a9.87 9.87 0 0 1 2.248 5.485c-.04.83-.14 1.623-.247 2.416-.217 1.575-.736 3.105-1.707 4.49a9.86 9.86 0 0 1-4.612 3.23" /></svg>
            </Button>
          </Link>
          <Link href={`https://maps.google.com/?q=${encodeURIComponent(shopAddress)}`} target="_blank" rel="noopener noreferrer" className="flex-1" aria-label="Get directions">
            <Button variant="outline" className="w-full justify-center gap-2" size="sm">
              <MapPin className="h-4 w-4" />
              Directions
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}

const shopPhone = '+1 (555) 123-4567'
const shopWhatsApp = '+15551234567'
const shopAddress = '123 Main Street, Downtown, City 12345'