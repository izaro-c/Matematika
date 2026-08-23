import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const PUBLIC_DIR = path.resolve('./public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const LOGO_SVG_PATH = path.join(PUBLIC_DIR, 'icons', 'matematika-logo.svg');

async function generateSeoAssets() {
  console.log('Generando assets de SEO y favicons con Puppeteer...');

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const logoSvg = fs.readFileSync(LOGO_SVG_PATH, 'utf-8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. Generar og-default.png (1200x630 px)
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    const ogHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Source+Sans+3:wght@400;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1200px;
            height: 630px;
            background-color: #fafaf9;
            background-image: radial-gradient(#e7e5e4 1px, transparent 1px);
            background-size: 24px 24px;
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: #1c1917;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
          }
          .card {
            width: 100%;
            height: 100%;
            background: #ffffff;
            border: 2px solid #e7e5e4;
            border-top: 8px solid #c86450;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 56px 64px;
            position: relative;
            overflow: hidden;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .logo {
            width: 96px;
            height: 96px;
          }
          .brand-title {
            font-size: 64px;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #1c1917;
            line-height: 1;
          }
          .brand-tagline {
            font-family: 'Source Sans 3', sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: #c86450;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 6px;
          }
          .main-content {
            margin-top: 24px;
          }
          .title {
            font-size: 48px;
            font-weight: 600;
            line-height: 1.15;
            color: #292524;
            max-width: 900px;
          }
          .subtitle {
            font-family: 'Source Sans 3', sans-serif;
            font-size: 24px;
            color: #57534e;
            margin-top: 16px;
            max-width: 850px;
            line-height: 1.4;
          }
          .footer {
            display: flex;
            gap: 12px;
            margin-top: 32px;
          }
          .pill {
            font-family: 'Source Sans 3', sans-serif;
            font-size: 16px;
            font-weight: 600;
            padding: 8px 16px;
            background: #f5f5f4;
            color: #44403c;
            border-radius: 9999px;
            border: 1px solid #e7e5e4;
          }
          .accent-pill {
            background: #fdf2f0;
            color: #c86450;
            border-color: #f87171;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="logo">${logoSvg}</div>
            <div>
              <div class="brand-title">Matematika</div>
              <div class="brand-tagline">Códice & Enciclopedia Interactiva</div>
            </div>
          </div>
          <div class="main-content">
            <div class="title">La Enciclopedia Interactiva, Visual y Formal de la Matemática</div>
            <div class="subtitle">Explora teoremas, demostraciones rigurosas, axiomas y modelos geométricos interactivos.</div>
          </div>
          <div class="footer">
            <div class="pill accent-pill">Biblioteca MSC2020</div>
            <div class="pill">Teoremas</div>
            <div class="pill">Demostraciones</div>
            <div class="pill">Axiomas</div>
            <div class="pill">Modelos Visuales</div>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(ogHtml, { waitUntil: 'domcontentloaded' });
    const ogPath = path.join(IMAGES_DIR, 'og-default.png');
    await page.screenshot({ path: ogPath, type: 'png' });
    console.log(`  ✓ Generado ${ogPath}`);

    // 2. Generar Favicons en distintas resoluciones
    const favicons = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
    ];

    for (const icon of favicons) {
      await page.setViewport({ width: icon.size, height: icon.size, deviceScaleFactor: 1 });
      const iconHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              width: ${icon.size}px;
              height: ${icon.size}px;
              background: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            svg {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          ${logoSvg}
        </body>
        </html>
      `;
      await page.setContent(iconHtml, { waitUntil: 'domcontentloaded' });
      const iconPath = path.join(PUBLIC_DIR, icon.name);
      await page.screenshot({ path: iconPath, type: 'png', omitBackground: true });
      console.log(`  ✓ Generado ${iconPath}`);
    }

    // Copy favicon-32x32.png as favicon.ico for legacy browser support
    const faviconIcoPath = path.join(PUBLIC_DIR, 'favicon.ico');
    fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), faviconIcoPath);
    console.log(`  ✓ Copiado ${faviconIcoPath}`);

  } finally {
    await browser.close();
  }

  console.log('✅ Todos los assets visuales de SEO generados con éxito.');
}

generateSeoAssets().catch((err) => {
  console.error('❌ Error generando assets de SEO:', err);
  process.exit(1);
});
