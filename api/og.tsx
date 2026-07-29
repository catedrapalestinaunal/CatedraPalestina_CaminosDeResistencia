import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Cátedra Caminos de Resistencia';
  const sub = searchParams.get('sub') || undefined;

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
            fontFamily: '"Georgia", "Times New Roman", serif',
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
                fontFamily: '"Courier New", "Consolas", monospace',
                fontSize: 13,
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
            fontFamily: '"Georgia", serif',
            fontSize: 15,
            color: 'rgba(241,237,228,0.5)',
            letterSpacing: '-0.01em',
          }}
        >
          <span>Cátedra Caminos de Resistencia · UNAL</span>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 18, color: 'rgba(241,237,228,0.25)' }}>+</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  );
}
