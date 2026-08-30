import { Metadata } from 'next'
import { CategoryGrid } from '@/components/categories/category-card'
import { getCategories } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse our product categories including kitchen, cleaning, bathroom, laundry, home decor, storage, and personal care.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Categories</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our range of household essentials organized by category. 
            From kitchen and cleaning to bathroom and storage solutions.
          </p>
        </div>

        <CategoryGrid categories={categories} />
      </div>
    </div>
  )
}
