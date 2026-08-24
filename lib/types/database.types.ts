export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  full_intro: string;
  avatar_url: string;
  experience_years: string;
  projects_count: string;
  clients_count: string;
  instagram_url?: string;
  github_url?: string;
  linkedin_url?: string;
  email: string;
  updated_at?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  url: string;
  image_url: string;
  initially_hidden: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: "Web Design" | "Frontend Engineering" | "UI/UX Systems" | "AI & Tech" | string;
  read_time: string;
  date: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
  sections: {
    heading?: string;
    paragraphs: string[];
    quote?: string;
    keyTakeaways?: string[];
  }[];
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
