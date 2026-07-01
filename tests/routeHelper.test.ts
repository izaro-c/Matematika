import { describe, it, expect, vi } from 'vitest';
import { appPath, publicAsset, routePath } from '../src/shared/lib/routeHelper';

describe('routeHelper', () => {
  it('routePath returns path with leading slash', () => {
    expect(routePath('teorema/x')).toBe('/teorema/x');
    expect(routePath('/teorema/x')).toBe('/teorema/x');
  });

  it('appPath adds BASE_URL', () => {
    vi.stubEnv('BASE_URL', '/Matematika/');
    expect(appPath('/teorema/x')).toBe('/Matematika/teorema/x');
    expect(appPath('teorema/x')).toBe('/Matematika/teorema/x');
    
    vi.stubEnv('BASE_URL', '/');
    expect(appPath('/teorema/x')).toBe('/teorema/x');
    expect(appPath('teorema/x')).toBe('/teorema/x');
  });

  it('publicAsset adds BASE_URL to assets correctly', () => {
    vi.stubEnv('BASE_URL', '/Matematika/');
    expect(publicAsset('/images/a.png')).toBe('/Matematika/images/a.png');
    expect(publicAsset('images/a.png')).toBe('/Matematika/images/a.png');
    
    vi.stubEnv('BASE_URL', '/');
    expect(publicAsset('/images/a.png')).toBe('/images/a.png');
    expect(publicAsset('images/a.png')).toBe('/images/a.png');
  });
});
