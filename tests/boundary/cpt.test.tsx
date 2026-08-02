import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchOmnibar } from '@/components/navigation/SearchOmnibar';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import { appPath, publicAsset } from '@/lib/routes';

// Mocks para wouter y stores para evitar errores de renderizado
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()]
}));

vi.mock('@/lib/stores/NavigationStore', () => ({
  useNavigationStore: vi.fn(),
}));

vi.mock('@/lib/stores/GlossaryStore', () => ({
  useGlossaryStore: () => ({
    openTerm: vi.fn()
  }),
  dictionary: {
    'axioma': { title: 'Axioma', definition: 'Proposición evidente.' }
  }
}));

describe('UC-1: Buscar Nodo (Omnibar)', () => {
  beforeEach(() => {
    vi.mocked(useNavigationStore).mockReturnValue({
      isSearchOpen: true,
      closeSearch: vi.fn(),
      toggleSearch: vi.fn()
    } as unknown as ReturnType<typeof useNavigationStore>);
  });

  it('TC-1.1: Query normal válida -> Muestra resultados', async () => {
    render(<SearchOmnibar />);
    const input = screen.getByRole('searchbox', { name: 'Buscar contenido matemático' });
    fireEvent.change(input, { target: { value: 'pitagoras' } });

    await waitFor(() => {
      const results = screen.getAllByRole('option').filter(option => option.closest('#search-results'));
      const theorem = results.find(
        option => option.getAttribute('data-result-type') === 'teorema'
          && /pitágoras/i.test(option.textContent ?? ''),
      );
      expect(theorem).toBeDefined();
    });
  });

  it('TC-1.3: Query inválida / Inexistente -> Lista vacía', () => {
    render(<SearchOmnibar />);
    const input = screen.getByRole('searchbox', { name: 'Buscar contenido matemático' });
    fireEvent.change(input, { target: { value: 'xxyyzz_inexistente' } });
    
    expect(screen.getByText('No se encontraron resultados')).toBeDefined();
  });
});

describe('Route Helpers (appPath & publicAsset)', () => {
  it('appPath should normalize routes correctly', () => {
    expect(appPath('/')).toBe(import.meta.env.BASE_URL === '/' ? '/' : `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`);
    expect(appPath('teorema')).toMatch(/\/teorema$/);
    expect(appPath('/teorema')).toMatch(/\/teorema$/);
  });

  it('publicAsset should normalize assets correctly', () => {
    expect(publicAsset('/images/logo.png')).toMatch(/\/images\/logo\.png$/);
    expect(publicAsset('images/logo.png')).toMatch(/\/images\/logo\.png$/);
  });
});

describe('ContentStore Rules', () => {
  it('Future concept links should not break loading (mocked rule check)', () => {
    // According to content rules, linking to missing pages triggers a warning, not a fatal error
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mockContentLoader = (id: string) => {
      if (id === 'future_theorem') {
        console.warn(`Link to missing theorem: ${id}`);
        return null; // Return null instead of throwing error
      }
      return { id, title: 'Valid' };
    };

    const result = mockContentLoader('future_theorem');
    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Link to missing theorem: future_theorem');
    consoleWarnSpy.mockRestore();
  });
});

describe('Editor API Security Rules', () => {
  const validatePath = (p: string) => {
    if (p.includes('..')) return false;
    if (!p.startsWith('content/mdx/') && !p.startsWith('src/content-pages/shared/templates/')) return false;
    return true;
  };

  it('Should reject path traversal attempts (mock logic)', () => {
    // Simulator for the vite.config.ts logic
    expect(validatePath('../../etc/passwd')).toBe(false);
    expect(validatePath('content/mdx/../../something')).toBe(false);
  });

  it('Should allow writing to database/content', () => {
    expect(validatePath('content/mdx/theorems/mi_teorema.mdx')).toBe(true);
    expect(validatePath('src/content-pages/shared/templates/theorem.template.mdx')).toBe(true);
    expect(validatePath('src/main.tsx')).toBe(false); // Outside allowed folders
  });
});
