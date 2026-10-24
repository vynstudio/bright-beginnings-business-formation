import { useLang } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

// Licensed Envato photos (license: agenteregistradofl.com), pre-sized as WebP.
// Each entry lists its available widths; the browser downloads only the size it needs.
const files = import.meta.glob("@/assets/photos/*.webp", { eager: true, import: "default" }) as Record<string, string>;

const PHOTOS = {
  "miami-skyline": { widths: [768, 1280, 1920], ratio: 1080 / 1920, alt: "Aerial view of the Miami skyline over Biscayne Bay" },
  "tropical-sunset-palms": { widths: [768, 1280, 1920], ratio: 755 / 1920, alt: "Florida skyline with palm trees at sunset" },
  "signing-contract": { widths: [640, 1280], ratio: 853 / 1280, alt: "Business owners signing company formation documents" },
  "man-signing-documents": { widths: [640, 1280], ratio: 854 / 1280, alt: "Business owner signing an application at his desk" },
  "woman-at-desk": { widths: [640, 1280], ratio: 1686 / 1280, alt: "Smiling businesswoman at her desk" },
  "colleagues-discussing": { widths: [640, 1280], ratio: 853 / 1280, alt: "Business partners discussing plans in an office" },
  "man-leading-team": { widths: [640, 1280], ratio: 847 / 1280, alt: "Business owner leading a meeting with his team" },
  "man-on-laptop": { widths: [640, 1280], ratio: 720 / 1280, alt: "Entrepreneur working on a laptop in a modern office" },
} as const;

export type PhotoName = keyof typeof PHOTOS;

const url = (name: PhotoName, w: number) => {
  const key = Object.keys(files).find((k) => k.endsWith(`/${name}-${w}.webp`));
  return key ? files[key] : "";
};

interface PhotoProps {
  name: PhotoName;
  className?: string;
  /** How wide the image is shown, for picking the right file (CSS sizes syntax). */
  sizes?: string;
  /** Set on the first image in view (the hero) so it loads before everything else. */
  priority?: boolean;
}

const Photo = ({ name, className, sizes = "(min-width: 1280px) 1280px, 100vw", priority = false }: PhotoProps) => {
  const { t } = useLang();
  const { widths, ratio, alt } = PHOTOS[name];
  const largest = widths[widths.length - 1];
  return (
    <img
      src={url(name, largest)}
      srcSet={widths.map((w) => `${url(name, w)} ${w}w`).join(", ")}
      sizes={sizes}
      width={largest}
      height={Math.round(largest * ratio)}
      alt={t(alt)}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      // Lowercase attribute: React 18 doesn't know the camelCase fetchPriority prop.
      {...{ fetchpriority: priority ? "high" : "auto" }}
      className={cn("object-cover", className)}
    />
  );
};

export default Photo;
