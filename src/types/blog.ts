export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'image' 
  | 'video' 
  | 'quote' 
  | 'code' 
  | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  data: {
    text: string;
  };
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  data: {
    text: string;
    level: 1 | 2 | 3;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: {
    url: string;
    caption?: string;
    alt?: string;
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  data: {
    url: string;
    caption?: string;
  };
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  data: {
    text: string;
    author?: string;
  };
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  data: {
    code: string;
    language?: string;
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  data: Record<string, never>;
}

export type ContentBlock = 
  | ParagraphBlock 
  | HeadingBlock 
  | ImageBlock 
  | VideoBlock 
  | QuoteBlock 
  | CodeBlock 
  | DividerBlock;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  content_blocks: ContentBlock[];
  featured_image_url: string | null;
  category_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blog_categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}
