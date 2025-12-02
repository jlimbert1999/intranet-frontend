export interface DocSectionWithCategoriesResponse {
  id: number;
  name: string;
  categories: CategoryItem[];
}

interface CategoryItem {
  id: number;
  name: string;
}
