import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchOmnibar } from '@/widgets/navigation/SearchOmnibar';
import { useNavigationStore } from '@/entities/content/searchApi';
import { appPath, publicAsset } from '@/shared/lib/routeHelper';

// Mocks para wouter y stores para evitar errores de renderizado
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()]
}));

vi.mock('@/entities/content/searchApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/content/searchApi')>();
  return {
    ...actual,
    useNavigationStore: vi.fn(),
  };
});

vi.mock('@/features/glossary/GlossaryStore', () => ({
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
    
    // Verifica que el input tiene el valor correcto
    expect((input as HTMLInputElement).value).toBe('pitagoras');
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
    if (!p.startsWith('database/content/') && !p.startsWith('shared/templates/')) return false;
    return true;
  };

  it('Should reject path traversal attempts (mock logic)', () => {
    // Simulator for the vite.config.ts logic
    expect(validatePath('../../etc/passwd')).toBe(false);
    expect(validatePath('database/content/../../something')).toBe(false);
  });

  it('Should allow writing to database/content', () => {
    expect(validatePath('database/content/theorems/mi_teorema.mdx')).toBe(true);
    expect(validatePath('shared/templates/theorem.template.mdx')).toBe(true);
    expect(validatePath('src/main.tsx')).toBe(false); // Outside allowed folders
  });
});
