import CategoryPageClient from '../../../client';
import { get_categories } from '../../../data';

export default function CategoryPage({ params }) {
  return <CategoryPageClient params={params} />;
}

// This function generates all possible category IDs at build time
export async function generateStaticParams() {
  const categories = get_categories();
  
  return categories.map((category) => ({
    id: category.id.toString(),
  }));
} 