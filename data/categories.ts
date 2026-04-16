import { Category } from './types'

// Real Nyirangarama product categories from sinarwanda.rw
export const categories: Category[] = [
  {
    id: 'juices',
    name: 'Agashya Juices',
    description: 'Pure fruit juices including passion, pineapple, and strawberry flavors in 1L and 500ml sizes',
    image: '/images/categories/juices.png',
    productCount: 5,
  },
  {
    id: 'chili',
    name: 'Akabanga Chili Oil',
    description: 'Rwanda\'s famous spicy chili oil in various sizes and olive oil blends',
    image: '/images/categories/chili.png',
    productCount: 4,
  },
  {
    id: 'spreads',
    name: 'Bread Spreads',
    description: 'Natural honey and strawberry jam, perfect for breakfast and snacks',
    image: '/images/categories/spreads.jpg',
    productCount: 2,
  },
  {
    id: 'water',
    name: 'Natural Water',
    description: 'Pure spring water from the mountains of Rulindo in 500ml and 1L bottles',
    image: '/images/categories/water.jpg',
    productCount: 2,
  },
  {
    id: 'flour',
    name: 'Akanozo Flour',
    description: 'Premium quality wheat flour for all your baking needs',
    image: '/images/categories/flour.png',
    productCount: 1,
  },
  {
    id: 'alcoholic',
    name: 'Akarusho Wine',
    description: 'Traditional Rwandan banana wine with authentic flavor',
    image: '/images/categories/alcoholic.jpg',
    productCount: 1,
  },
]

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id)
}
