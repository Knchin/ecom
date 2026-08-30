export type ProductAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'ASK_IN_STORE'
export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  price_cents: number
  promotional_price_cents: number | null
  availability: ProductAvailability
  category_id: string | null
  brand: string | null
  sku: string | null
  dimensions: ProductDimensions | null
  is_featured: boolean
  is_new_arrival: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ProductDimensions {
  width: number
  height: number
  depth: number
  unit: 'cm' | 'mm' | 'in'
}

export interface ProductImage {
  id: string
  product_id: string
  storage_path: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface Promotion {
  id: string
  title: string
  description: string | null
  promotional_price_cents: number
  start_date: string
  end_date: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface PromotionProduct {
  promotion_id: string
  product_id: string
}

export interface ShopSettings {
  id: number
  name: string
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  address: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  created_at: string
  updated_at: string
}

export interface OpeningHours {
  id: string
  day_of_week: number
  is_open: boolean
  open_time: string | null
  close_time: string | null
  created_at: string
  updated_at: string
}

export interface AdminProfile {
  user_id: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  product_id: string | null
  category_id: string | null
  session_id: string | null
  user_agent: string | null
  referrer: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type AnalyticsEventType =
  | 'PRODUCT_VIEW'
  | 'PRODUCT_SEARCH'
  | 'CONTACT_CLICK'
  | 'PHONE_CLICK'
  | 'WHATSAPP_CLICK'
  | 'DIRECTION_CLICK'

export interface ProductWithRelations extends Product {
  category: Category | null
  images: ProductImage[]
  promotions: Promotion[]
}

export interface CategoryWithProducts extends Category {
  products: Product[]
  product_count: number
}