import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'utexas.network';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const iconUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://utexas.network'}/iconwhite.svg`;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* White icon background */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: -100,
            opacity: 0.15,
            display: 'flex',
          }}
        >
          <img
            src={iconUrl}
            width="860"
            height="500"
            style={{ width: '860px', height: '500px' }}
          />
        </div>
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 1,
            padding: '0 80px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: -2 }}>
            utexas.network
          </div>
          <div style={{ fontSize: 28, color: '#888888', marginTop: 16 }}>
            a webring for ut austin students
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
