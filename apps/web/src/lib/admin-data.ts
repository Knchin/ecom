import { createClient } from '@/lib/supabase/server'
import type {
  Category,
  Product,
  ProductImage,
  Promotion,
  ShopSettings,
  OpeningHours,
  AdminProfile,
} from '@/types/database'

// Admin-only data functions (require admin role)

export async function adminGetCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function adminGetProducts(params: {
  search?: string
  categoryId?: string
  availability?: string
  featured?: boolean
  newArrival?: boolean
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} = {}): Promise<{ products: Product[]; total: number }> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(*)
    `, { count: 'exact' })
    .is('deleted_at', null)

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%,brand.ilike.%${params.search}%,sku.ilike.%${params.search}%`)
  }

  if (params.categoryId) {
    query = query.eq('category_id', params.categoryId)
  }

  if (params.availability) {
    query = query.eq('availability', params.availability)
  }

  if (params.featured !== undefined) {
    query = query.eq('is_featured', params.featured)
  }

  if (params.newArrival !== undefined) {
    query = query.eq('is_new_arrival', params.newArrival)
  }

  const sortBy = params.sortBy ?? 'created_at'
  const sortOrder = params.sortOrder ?? 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset !== undefined) {
    query = query.range(params.offset, params.offset + (params.limit ?? 20) - 1)
  }

  const { data, error, count } = await query
  if (error) throw error

  return {
    products: data ?? [],
    total: count ?? 0,
  }
}

export async function adminGetProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function adminCreateProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Product> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminDeleteProduct(id: string, soft = true): Promise<void> {
  const supabase = await createClient()
  
  if (soft) {
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

export async function adminCreateCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function adminReorderCategories(updates: { id: string; sort_order: number }[]): Promise<void> {
  const supabase = await createClient()
  
  for (const update of updates) {
    const { error } = await supabase
      .from('categories')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id)
    if (error) throw error
  }
}

export async function adminGetPromotions(): Promise<Promotion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function adminGetPromotionWithProducts(promotionId: string): Promise<{ promotion: Promotion; products: Product[] } | null> {
  const supabase = await createClient()
  
  const { data: promotion, error: promoError } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', promotionId)
    .single()

  if (promoError) {
    if (promoError.code === 'PGRST116') return null
    throw promoError
  }

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .in('id', supabase
      .from('promotion_products')
      .select('product_id')
      .eq('promotion_id', promotionId))

  if (prodError) throw prodError

  return {
    promotion,
    products: products ?? [],
  }
}

export async function adminCreatePromotion(promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>): Promise<Promotion> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('promotions')
    .insert(promotion)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminUpdatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('promotions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminDeletePromotion(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function adminSetPromotionProducts(promotionId: string, productIds: string[]): Promise<void> {
  const supabase = await createClient()
  
  // Delete existing
  const { error: delError } = await supabase
    .from('promotion_products')
    .delete()
    .eq('promotion_id', promotionId)
  if (delError) throw delError

  // Insert new
  if (productIds.length > 0) {
    const { error: insError } = await supabase
      .from('promotion_products')
      .insert(productIds.map(product_id => ({ promotion_id: promotionId, product_id })))
    if (insError) throw insError
  }
}

export async function adminGetShopSettings(): Promise<ShopSettings | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('shop_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function adminUpdateShopSettings(updates: Partial<ShopSettings>): Promise<ShopSettings> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('shop_settings')
    .update(updates)
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminGetOpeningHours(): Promise<OpeningHours[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('opening_hours')
    .select('*')
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function adminUpdateOpeningHours(updates: { day_of_week: number; is_open: boolean; open_time?: string | null; close_time?: string | null }[]): Promise<void> {
  const supabase = await createClient()
  
  for (const update of updates) {
    const { error } = await supabase
      .from('opening_hours')
      .upsert({
        day_of_week: update.day_of_week,
        is_open: update.is_open,
        open_time: update.open_time,
        close_time: update.close_time,
      })
    if (error) throw error
  }
}

export async function adminGetAnalytics(params: {
  eventType?: string
  startDate?: string
  endDate?: string
  limit?: number
} = {}): Promise<{ events: any[]; total: number }> {
  const supabase = await createClient()
  
  let query = supabase
    .from('analytics_events')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (params.eventType) {
    query = query.eq('event_type', params.eventType)
  }

  if (params.startDate) {
    query = query.gte('created_at', params.startDate)
  }

  if (params.endDate) {
    query = query.lte('created_at', params.endDate)
  }

  if (params.limit) {
    query = query.limit(params.limit)
  }

  const { data, error, count } = await query
  if (error) throw error

  return {
    events: data ?? [],
    total: count ?? 0,
  }
}