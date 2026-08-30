import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, MessageCircle, Share2, Truck, Tag, ChevronLeft, ChevronRight, X, Star, MapPin as MapPinIcon, Phone as PhoneIcon, MessageSquare, Navigation } from 'lucide-react'
import { Button } from '@shop-platform/ui'
import { Card, CardContent } from '@shop-platform/ui'
import { Separator } from '@shop-platform/ui'
import { getProductBySlug, getCategories, getShopSettings, getOpeningHours } from '@/lib/data'
import { formatPriceFromCents } from '@shop-platform/ui'
import type { ProductWithRelations } from '@/types/database'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  const hasPromotion = product.promotions.length > 0
  const currentPromotion = product.promotions[0]
  const displayPrice = hasPromotion && currentPromotion?.promotional_price_cents
    ? currentPromotion.promotional_price_cents
    : product.price_cents

  return {
    title: product.title,
    description: product.description ?? `View ${product.title} at Local Shop. ${formatPriceFromCents(displayPrice)}`,
    openGraph: {
      title: product.title,
      description: product.description ?? `View ${product.title} at Local Shop`,
      type: 'website',
      images: product.images[0] ? [`/api/images/${product.images[0].storage_path}`] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description ?? `View ${product.title} at Local Shop`,
      images: product.images[0] ? [`/api/images/${product.images[0].storage_path}`] : [],
    },
    other: {
      'product:price:amount': String(displayPrice / 100),
      'product:price:currency': 'USD',
      'product:availability': product.availability === 'AVAILABLE' ? 'in stock' : product.availability === 'UNAVAILABLE' ? 'out of stock' : 'available for order',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const [categories, shop, hours] = await Promise.all([
    getCategories(),
    getShopSettings(),
    getOpeningHours(),
  ])

  const hasPromotion = product.promotions.length > 0
  const currentPromotion = product.promotions[0]
  const displayPrice = hasPromotion && currentPromotion?.promotional_price_cents
    ? currentPromotion.promotional_price_cents
    : product.price_cents
  const originalPrice = hasPromotion ? product.price_cents : null

  const availabilityLabels: Record<string, { label: string; className: string }> = {
    AVAILABLE: { label: 'In Stock', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    UNAVAILABLE: { label: 'Out of Stock', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    ASK_IN_STORE: { label: 'Ask in Store', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  }

  const availability = availabilityLabels[product.availability] ?? availabilityLabels.AVAILABLE

  const todayHours = hours.find(h => h.day_of_week === new Date().getDay())
  const isOpen = todayHours?.is_open && todayHours?.open_time && todayHours?.close_time

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    image: product.images.map(img => `/api/images/${img.storage_path}`),
    offers: {
      '@type': 'Offer',
      price: displayPrice / 100,
      priceCurrency: 'USD',
      availability: product.availability === 'AVAILABLE' ? 'https://schema.org/InStock' : product.availability === 'UNAVAILABLE' ? 'https://schema.org/OutOfStock' : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Store',
        name: shop?.name ?? 'Local Shop',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {product.category && (
              <>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground transition-colors">{product.category.name}</Link>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
            <span className="text-foreground truncate max-w-xs" aria-current="page">{product.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {product.images.length > 0 ? (
                  <>
                    <Image
                      src={`/api/images/${product.images[0].storage_path}`}
                      alt={product.images[0].alt_text ?? product.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                        {product.images.map((img, idx) => (
                          <button
                            key={img.id}
                            className={cn('h-2 w-2 rounded-full transition-all', idx === 0 ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75')}
                            aria-label={`View image ${idx + 1}`}
                            aria-current={idx === 0 ? 'true' : 'false'}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Truck className="h-16 w-16" />
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-4" role="list" aria-label="Product images">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      className={cn('relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all', idx === 0 ? 'border-primary' : 'border-transparent hover:border-muted')}
                      aria-label={`View image ${idx + 1}`}
                      role="listitem"
                    >
                      <Image
                        src={`/api/images/${img.storage_path}`}
                        alt={img.alt_text ?? `${product.title} - Image ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                {product.category && (
                  <Link href={`/categories/${product.category.slug}`} className="text-sm text-primary hover:underline">
                    {product.category.name}
                  </Link>
                )}
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{product.title}</h1>
                {product.brand && (
                  <p className="mt-1 text-sm text-muted-foreground">Brand: {product.brand}</p>
                )}
                {product.sku && (
                  <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
                )}
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-foreground">{formatPriceFromCents(displayPrice)}</span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{formatPriceFromCents(originalPrice)}</span>
                )}
                {hasPromotion && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                    Sale
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', availability.className)}>
                  {availability.label}
                </span>
                {product.is_featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white">
                    Featured
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                    New Arrival
                  </span>
                )}
              </div>

              {product.description && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{product.description}</p>
                </div>
              )}

              {product.dimensions && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Dimensions
                  </h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-muted-foreground">Width</dt>
                    <dd>{product.dimensions.width} {product.dimensions.unit}</dd>
                    <dt className="text-muted-foreground">Height</dt>
                    <dd>{product.dimensions.height} {product.dimensions.unit}</dd>
                    <dt className="text-muted-foreground">Depth</dt>
                    <dd>{product.dimensions.depth} {product.dimensions.unit}</dd>
                  </dl>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Buy In-Store
                </h3>
                <p className="text-sm text-muted-foreground">
                  This product is available at our physical shop. Visit us or contact us to reserve.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`tel:${shop?.phone ?? '+15551234567'}`} className="flex-1 min-w-[140px]">
                    <Button className="w-full justify-center gap-2" size="lg">
                      <PhoneIcon className="h-5 w-5" />
                      Call Shop
                    </Button>
                  </Link>
                  <Link href={`https://wa.me/${shop?.whatsapp?.replace(/\D/g, '') ?? '15551234567'}`} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px]">
                    <Button variant="outline" className="w-full justify-center gap-2" size="lg">
                      <MessageSquare className="h-5 w-5" />
                      WhatsApp
                    </Button>
                  </Link>
                  <Link href={`https://maps.google.com/?q=${encodeURIComponent(shop?.address ?? '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px]">
                    <Button variant="outline" className="w-full justify-center gap-2" size="lg">
                      <Navigation className="h-5 w-5" />
                      Directions
                    </Button>
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="rounded-full" aria-label="Share product">
                  <Share2 className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">Share this product</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Separator className="my-8" />
            
            <section aria-labelledby="shop-info-heading">
              <h2 id="shop-info-heading" className="text-2xl font-bold mb-6">Visit Our Shop</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <address className="mt-1 text-sm text-muted-foreground not-italic">
                          {shop?.address ?? '123 Main Street, Downtown, City 12345'}
                        </address>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Opening Hours</h3>
                        <dl className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {hours.map(hour => (
                            <div key={hour.day_of_week} className="flex justify-between gap-4">
                              <dt>{hour.day_of_week === new Date().getDay() ? (
                                <span className="font-medium text-foreground">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][hour.day_of_week]}</span>
                              ) : (
                                ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][hour.day_of_week]
                              )}</dt>
                              <dd className={hour.day_of_week === new Date().getDay() ? 'font-medium text-foreground' : ''}>
                                {hour.is_open && hour.open_time && hour.close_time
                                  ? `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`
                                  : 'Closed'}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Contact</h3>
                        <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {shop?.phone && (
                            <a href={`tel:${shop.phone}`} className="hover:text-foreground transition-colors">{shop.phone}</a>
                          )}
                          {shop?.email && (
                            <a href={`mailto:${shop.email}`} className="hover:text-foreground transition-colors">{shop.email}</a>
                          )}
                          {shop?.whatsapp && (
                            <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">WhatsApp</a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

import { cn } from '@shop-platform/ui'
import { Clock } from 'lucide-react'
import { Package } from 'lucide-react'
