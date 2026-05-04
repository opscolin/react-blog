export interface User {
  id: number;
  username: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  article_count?: number;
  created_at?: string;
}

export interface Tag {
  id: number;
  name: string;
  article_count?: number;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: Category | null;
  tags: Tag[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

export interface Archive {
  [year: string]: {
    [month: string]: Article[];
  };
}

export interface Quote {
  id: number;
  content: string;
  created_at?: string;
}

export interface BannerCategory {
  id: number;
  name: string;
  slug: string;
  cover: string;
  is_banner?: boolean;
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
  } | null;
}

export interface NavigationMenu {
  [key: string]: {
    path: string | null;
    visible: boolean;
    children?: Array<{
      name: string;
      path: string;
      cover?: string;
    }>;
  };
}

export interface Settings {
  blogTitle: string;
  blogLogo: string;
  paginationSize: number;
  aboutContent: string;
  menuVisibility: {
    categories: boolean;
    tags: boolean;
    archives: boolean;
    about: boolean;
  };
  navigation_menus?: NavigationMenu;
  enable_quote_cache?: boolean;
}
