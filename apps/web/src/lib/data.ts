import { createClient } from '@/lib/supabase/server'
import type {
  Category,
  Product,
  ProductImage,
  Promotion,
  ShopSettings,
  OpeningHours,
  ProductWithRelations,
  CategoryWithProducts,
} from '@/types/database'

export async function getCategories(activeOnly = true): Promise<Category[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (activeOnly) {
    query = query.eq('active', true)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getCategoryWithProducts(slug: string): Promise<CategoryWithProducts | null> {
  const supabase = await createClient()
  
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (catError) {
    if (catError.code === 'PGRST116') return null
    throw catError
  }

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (prodError) throw prodError

  return {
    ...category,
    products: products ?? [],
    product_count: products?.length ?? 0,
  }
}

export async function getProducts(params: {
  categorySlug?: string
  featured?: boolean
  newArrival?: boolean
  promotionId?: string
  search?: string
  availability?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'price_cents' | 'title'
  sortOrder?: 'asc' | 'desc'
}): Promise<{ products: ProductWithRelations[]; total: number }> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      promotions:promotion_products(promotion:promotions(*))
    `, { count: 'exact' })
    .is('deleted_at', null)

  if (params.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.categorySlug)
      .single()
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  if (params.featured) {
    query = query.eq('is_featured', true)
  }

  if (params.newArrival) {
    query = query.eq('is_new_arrival', true)
  }

  if (params.availability) {
    query = query.eq('availability', params.availability)
  }

  if (params.minPrice !== undefined) {
    query = query.gte('price_cents', params.minPrice)
  }

  if (params.maxPrice !== undefined) {
    query = query.lte('price_cents', params.maxPrice)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%,brand.ilike.%${params.search}%,sku.ilike.%${params.search}%`)
  }

  if (params.promotionId) {
    const { data: promoProducts } = await supabase
      .from('promotion_products')
      .select('product_id')
      .eq('promotion_id', params.promotionId)
    const productIds = promoProducts?.map(p => p.product_id) ?? []
    if (productIds.length > 0) {
      query = query.in('id', productIds)
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000')
    }
  }

  const sortBy = params.sortBy ?? 'created_at'
  const sortOrder = params.sortOrder ?? 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit ?? 20) - 1)
  }

  const { data, error, count } = await query
  if (error) throw error

  return {
    products: (data ?? []) as ProductWithRelations[],
    total: count ?? 0,
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      promotions:promotion_products(promotion:promotions(*))
    `)
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as ProductWithRelations
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithRelations[]> {
  const { products } = await getProducts({ featured: true, limit })
  return products
}

export async function getNewArrivals(limit = 8): Promise<ProductWithRelations[]> {
  const { products } = await getProducts({ newArrival: true, limit })
  return products
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('start_date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getPromotionWithProducts(promotionId: string): Promise<{ promotion: Promotion; products: ProductWithRelations[] } | null> {
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

  const { data: promoProducts } = await supabase
      .from('promotion_products')
      .select('product_id')
      .eq('promotion_id', promotionId)
    const productIds = promoProducts?.map(p => p.product_id) ?? []

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .in('id', productIds.length > 0 ? productIds : ['00000000-0000-0000-0000-000000000000'])
      .is('deleted_at', null)

  if (prodError) throw prodError

  return {
    promotion,
    products: (products ?? []) as ProductWithRelations[],
  }
}

export async function getShopSettings(): Promise<ShopSettings | null> {
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

export async function getOpeningHours(): Promise<OpeningHours[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('opening_hours')
    .select('*')
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function searchProducts(query: string, limit = 20): Promise<ProductWithRelations[]> {
  const { products } = await getProducts({ search: query, limit })
  return products
}