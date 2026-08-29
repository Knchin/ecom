'use client'

import Link from 'next/link'
import { Menu, X, Search, ShoppingBag, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="flex items-center space-x-2" aria-label="Local Shop Home">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Local Shop</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link href="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Categories
            </Link>
            <Link href="/promotions" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Promotions
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/admin" className="hidden md:flex">
            <Button variant="outline" size="sm">Admin</Button>
          </Link>

          <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="right">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-72">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-2 p-4">
                <Link href="/products" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Products</Link>
                <Link href="/categories" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
                <Link href="/promotions" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Promotions</Link>
                <Link href="/about" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link href="/contact" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                <Link href="/admin" className="px-3 py-2 text-sm font-medium text-primary hover:text-primary/80" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>

      {searchOpen && (
        <SearchDrawer onClose={() => setSearchOpen(false)} />
      )}
    </header>
  )
}

function SearchDrawer({ onClose }: { onClose: () => void }) {
  return (
    <Drawer open={true} onOpenChange={onClose} direction="down">
      <DrawerContent className="h-auto max-h-[60vh]">
        <DrawerHeader>
          <DrawerTitle>Search Products</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <form action="/products" method="get">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                placeholder="Search products..."
                className="w-full h-12 pl-10 pr-4 text-base border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}