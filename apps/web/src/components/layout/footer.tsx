import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, WhatsApp } from 'lucide-react'
import { getDayName } from '@shop-platform/ui'
import type { ShopSettings, OpeningHours } from '@/types/database'

interface FooterProps {
  shop: ShopSettings | null
  hours: OpeningHours[]
}

export function Footer({ shop, hours }: FooterProps) {
  const currentDay = new Date().getDay()
  const todayHours = hours.find(h => h.day_of_week === currentDay)

  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2" aria-label="Local Shop Home">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99-.9-1.99-2S5.9 14 7 14s2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99-.9-1.99-2s.89-2 1.99-2 2 .9 2 2-.89 2-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">Local Shop</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Your neighborhood shop for everyday household essentials. Quality products at fair prices.
            </p>
            <div className="mt-6 flex gap-4">
              {shop?.facebook_url && (
                <a href={shop.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {shop?.instagram_url && (
                <a href={shop.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <address className="mt-4 space-y-3 text-sm text-muted-foreground not-italic">
              {shop?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p>{shop.address}</p>
                </div>
              )}
              {shop?.phone && (
                <a href={`tel:${shop.phone}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>{shop.phone}</span>
                </a>
              )}
              {shop?.email && (
                <a href={`mailto:${shop.email}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>{shop.email}</span>
                </a>
              )}
              {shop?.whatsapp && (
                <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <WhatsApp className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              )}
            </address>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Opening Hours</h3>
            <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
              {hours.map(hour => (
                <div key={hour.day_of_week} className="flex justify-between gap-4" aria-label={`${getDayName(hour.day_of_week)}: ${hour.is_open ? `${hour.open_time} - ${hour.close_time}` : 'Closed'}`}>
                  <dt className={cn('font-medium', todayHours?.day_of_week === hour.day_of_week && 'text-foreground')}>
                    {getDayName(hour.day_of_week)}
                  </dt>
                  <dd className={cn('text-right', todayHours?.day_of_week === hour.day_of_week && 'text-foreground')}>
                    {hour.is_open && hour.open_time && hour.close_time
                      ? `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`
                      : 'Closed'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <nav className="mt-4 space-y-2" aria-label="Quick links">
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
              <Link href="/categories" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
              <Link href="/promotions" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Promotions</Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Local Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
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