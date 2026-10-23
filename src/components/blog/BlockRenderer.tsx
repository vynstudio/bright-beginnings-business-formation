import { ContentBlock } from "@/types/blog";

interface BlockRendererProps {
  blocks: ContentBlock[];
}

const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockItem key={block.id} block={block} />
      ))}
    </div>
  );
};

const BlockItem = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-muted-foreground leading-relaxed text-lg">
          {block.data.text}
        </p>
      );

    case 'heading':
      const HeadingTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
      const headingStyles = {
        1: 'text-3xl md:text-4xl font-bold text-foreground mt-10 mb-4',
        2: 'text-2xl md:text-3xl font-bold text-foreground mt-8 mb-4',
        3: 'text-xl md:text-2xl font-semibold text-foreground mt-6 mb-3',
      };
      return (
        <HeadingTag id={block.id} className={headingStyles[block.data.level]}>
          {block.data.text}
        </HeadingTag>
      );

    case 'image':
      return (
        <figure className="my-8">
          <div className="rounded-xl overflow-hidden">
            <img
              src={block.data.url}
              alt={block.data.alt || ''}
              className="w-full h-auto object-cover"
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <figure className="my-8">
          <div className="rounded-xl overflow-hidden aspect-video bg-muted">
            <iframe
              src={block.data.url}
              title="Video"
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          {block.data.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="my-8 border-l-4 border-lime pl-6 py-4 bg-muted/30 rounded-r-xl">
          <p className="text-xl italic text-foreground mb-2">
            "{block.data.text}"
          </p>
          {block.data.author && (
            <cite className="text-muted-foreground not-italic">
              — {block.data.author}
            </cite>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <div className="my-6">
          {block.data.language && (
            <div className="bg-foreground text-background px-4 py-2 text-sm rounded-t-lg font-mono">
              {block.data.language}
            </div>
          )}
          <pre className={`bg-foreground text-background p-4 overflow-x-auto font-mono text-sm ${block.data.language ? 'rounded-b-lg' : 'rounded-lg'}`}>
            <code>{block.data.code}</code>
          </pre>
        </div>
      );

    case 'divider':
      return (
        <hr className="my-10 border-t border-border" />
      );

    default:
      return null;
  }
};

export default BlockRenderer;
