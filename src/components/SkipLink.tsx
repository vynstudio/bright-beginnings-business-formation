/**
 * Keyboard-only shortcut that jumps straight past the navigation to the page
 * content. It stays hidden until it receives focus, and sits inside its own
 * landmark so screen readers treat it as a proper region.
 */
const SkipLink = () => (
  <div role="navigation" aria-label="Skip links">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
    >
      Skip to content
    </a>
  </div>
);

export default SkipLink;
