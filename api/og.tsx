import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: 'normal';
}

async function loadFont(weight: number): Promise<FontData> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36' } },
  ).then(r => r.text());
  const match = css.match(/url\(([^)]+?)\)/);
  if (!match) throw new Error('Font URL not found');
  const fontUrl = match[1].replace(/['"]/g, '');
  const data = await fetch(fontUrl).then(r => r.arrayBuffer());
  return { name: 'Inter', data, weight, style: 'normal' as const };
}

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Cátedra Caminos de Resistencia';
  const sub = searchParams.get('sub') || undefined;

  let fonts: FontData[];
  try {
    fonts = await Promise.all([loadFont(600), loadFont(400)]);
  } catch {
    fonts = [];
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          background: 'linear-gradient(135deg, #1d2f1f 0%, #0b0c0a 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(46,71,49,0.25) 0%, rgba(139,29,34,0.08) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 8,
            height: 630,
            background: '#8B1D22',
          }}
        />

        <div
          style={{
            fontFamily: 'Inter',
            fontSize: sub ? 56 : 72,
            fontWeight: 600,
            color: '#f1ede4',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            maxWidth: 800,
          }}
        >
          {title}
        </div>

        {sub && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 28,
            }}
          >
            <div style={{ width: 36, height: 2, background: '#d45a5e' }} />
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#d45a5e',
              }}
            >
              {sub}
            </span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 24,
            borderTop: '1px solid rgba(241,237,228,0.1)',
            fontFamily: 'Inter',
            fontSize: 15,
            fontWeight: 400,
            color: 'rgba(241,237,228,0.5)',
            letterSpacing: '-0.01em',
          }}
        >
          <span>Cátedra Caminos de Resistencia · UNAL</span>
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 400,
              color: 'rgba(241,237,228,0.25)',
            }}
          >
            +
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  );
}
