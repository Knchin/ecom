import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, Phone, Mail, MessageCircle, Truck, Sparkles, Tag, Package, ArrowRight } from 'lucide-react'
import { Button } from '@shop-platform/ui'
import { Card, CardContent } from '@shop-platform/ui'
import { Separator } from '@shop-platform/ui'
import { ProductGrid } from '@/components/products/product-grid'
import { CategoryGrid } from '@/components/categories/category-card'
import { getCategories, getFeaturedProducts, getNewArrivals, getActivePromotions, getShopSettings, getOpeningHours } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Local Shop - Your neighborhood store for everyday household essentials. Discover quality products at fair prices.',
}

export default async function HomePage() {
  const [categories, featuredProducts, newArrivals, promotions, shop, hours] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getNewArrivals(8),
    getActivePromotions(),
    getShopSettings(),
    getOpeningHours(),
  ])

  const todayHours = hours.find(h => h.day_of_week === new Date().getDay())
  const isOpen = todayHours?.is_open && todayHours?.open_time && todayHours?.close_time

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 id="hero-heading" className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Neighborhood <span className="text-primary">Shop</span> for Everyday Essentials
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              {shop?.description ?? 'Quality household products at fair prices. From kitchen essentials to cleaning supplies, bathroom products, and storage solutions.'}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto gap-2" aria-label="Browse all products">
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Visit Us</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-foreground">Why Shop With Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">We&apos;re committed to making your shopping experience simple and pleasant.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="pt-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-center text-lg font-semibold">Local Delivery</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">Free delivery within 5km radius for orders over $50</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="pt-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-center text-lg font-semibold">Quality Guaranteed</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">Carefully selected products from trusted brands</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="pt-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-center text-lg font-semibold">Easy Returns</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">30-day return policy on all unused items</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="bg-muted/30 py-16 lg:py-24" aria-labelledby="promotions-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="promotions-heading" className="text-3xl font-bold tracking-tight text-foreground">Current Promotions</h2>
                <p className="mt-2 text-muted-foreground">Limited time offers on selected products</p>
              </div>
              <Link href="/promotions">
                <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {promotions.slice(0, 6).map(promo => (
                <Link key={promo.id} href={`/promotions/${promo.id}`} className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-amber-500/5" aria-hidden="true" />
                  <Tag className="h-5 w-5 text-primary mb-3" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{promo.title}</h3>
                  {promo.description && <p className="mt-2 text-sm text-muted-foreground">{promo.description}</p>}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Shop Now
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-16 lg:py-24" aria-labelledby="categories-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="categories-heading" className="text-3xl font-bold tracking-tight text-foreground">Shop by Category</h2>
                <p className="mt-2 text-muted-foreground">Browse our product categories</p>
              </div>
              <Link href="/categories">
                <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <CategoryGrid categories={categories.slice(0, 8)} />
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="bg-muted/30 py-16 lg:py-24" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="featured-heading" className="text-3xl font-bold tracking-tight text-foreground">Featured Products</h2>
                <p className="mt-2 text-muted-foreground">Our hand-picked favorites</p>
              </div>
              <Link href="/products?featured=true">
                <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="py-16 lg:py-24" aria-labelledby="new-arrivals-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="new-arrivals-heading" className="text-3xl font-bold tracking-tight text-foreground">New Arrivals</h2>
                <p className="mt-2 text-muted-foreground">Fresh stock just arrived</p>
              </div>
              <Link href="/products?new=true">
                <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      <section className="bg-muted/30 py-16 lg:py-24" aria-labelledby="visit-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 id="visit-heading" className="text-3xl font-bold tracking-tight text-foreground">Visit Our Shop</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Come see our products in person. Our friendly staff is ready to help you find exactly what you need.
              </p>
              <div className="mt-8 space-y-4">
                {shop?.address && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">{shop.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Today's Hours</h3>
                    <p className={cn('font-medium', isOpen ? 'text-green-600' : 'text-red-600')}>
                      {isOpen
                        ? `Open ${formatTime(todayHours!.open_time!)} - ${formatTime(todayHours!.close_time!)}`
                        : 'Closed today'}
                    </p>
                  </div>
                </div>
                {shop?.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-start gap-4 hover:text-foreground transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-muted-foreground">{shop.phone}</p>
                    </div>
                  </a>
                )}
                {shop?.whatsapp && (
                  <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:text-foreground transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">WhatsApp</h3>
                      <p className="text-muted-foreground">Chat with us</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold mb-4">Get Directions</h3>
              {shop?.google_maps_url ? (
                <a href={shop.google_maps_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full justify-center gap-2" size="lg">
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </Button>
                </a>
              ) : (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  Map unavailable
                </div>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {shop?.email && (
                  <a href={`mailto:${shop.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>{shop.email}</span>
                  </a>
                )}
                {shop?.facebook_url && (
                  <a href={shop.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    <span>Facebook</span>
                  </a>
                )}
                {shop?.instagram_url && (
                  <a href={shop.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-.128-1.283-.072-1.687.072-4.948zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.78-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-.128-1.283-.072-1.687.072-4.948C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 1 0 12.324 6.162 6.162 0 0 1 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
