import { Link } from 'wouter';

interface GraphExplorerLinkProps {
  href: '/grafo' | '/axiomas';
  children: React.ReactNode;
  direction: 'back' | 'forward';
}

/** Enlace recíproco entre las dos vistas complementarias del grafo. */
export function GraphExplorerLink({ href, children, direction }: GraphExplorerLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-2 py-2 ac-label ac-label--xs ac-label--terracota transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
      style={{ textDecoration: 'none' }}
    >
      {direction === 'back' && <span aria-hidden="true">&larr;</span>}
      <span>{children}</span>
      {direction === 'forward' && <span aria-hidden="true">&rarr;</span>}
    </Link>
  );
}
