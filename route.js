import * as data from '@/lib/data';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request) {
  try {
    const categories = data.get_categories();
    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
