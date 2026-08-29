export const APP_CONFIG = {
  name: 'Local Shop',
  description: 'Your neighborhood store for everyday essentials',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  defaultCurrency: 'USD',
  defaultLocale: 'en-US',
  productsPerPage: 20,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxImagesPerProduct: 10,
} as const

export const AVAILABILITY_LABELS = {
  AVAILABLE: { label: 'In Stock', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  UNAVAILABLE: { label: 'Out of Stock', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  ASK_IN_STORE: { label: 'Ask in Store', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
} as const

export const USER_ROLES = ['ADMIN', 'MANAGER', 'STAFF'] as const

export const ANALYTICS_EVENTS = [
  'PRODUCT_VIEW',
  'PRODUCT_SEARCH',
  'CONTACT_CLICK',
  'PHONE_CLICK',
  'WHATSAPP_CLICK',
  'DIRECTION_CLICK',
] as const