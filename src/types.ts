export interface Platform {
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Writeup {
  id: string;
  slug: string;
  title: string;
  date: string;
  platform: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  tags?: string[];
  description: string;
  content: string;
}

export interface ContentData {
  platforms: Platform[];
  writeups: Writeup[];
}
