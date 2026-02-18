import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'utexas.network';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* SVG Icon Background */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: -100,
            opacity: 0.15,
            display: 'flex',
          }}
        >
          <svg width="500" height="500" viewBox="0 0 331.62189 168.97772">
            <path
              d="m194.33 31.45c-11.855 3.223-26.211 0.831-37.755-2.705-22.049-7.074-40.873-22.049-61.362-32.761-10.818-4.576-25.693-5.512-35.677 0.729-2.391 1.697-6.725 0.484-6.725 0.484-1.386 1.039-2.94 1.435-4.82 0.764-4.993-3.643-10.194 1.975-15.496-0.936-5.302 2.911-10.502-2.707-15.495 0.936-1.881 0.671-3.434 0.275-4.821-0.764 0 0-4.335 1.213-6.726-0.484-9.983-6.241-24.858-5.305-35.674-0.729-20.49 10.712-39.314 25.687-61.364 32.761-11.545 3.536-25.9 5.928-37.756 2.705-1.56-1.039-3.33-2.911-2.914-5.198 0.833-1.352 1.666-3.223 3.435-3.536 42.438 6.345 65.317-35.779 100.89-46.908 0.069-0.451-2.011-2.184-4.266-3.397-5.027-2.775-12.48-1.699-13-8.564 1.351-4.266 6.551-5.825 10.296-7.488 8.841-4.996 19.453-0.836 27.46 3.223 0.936 0.939 2.496 0.418 3.223-0.52-0.623-19.242 14.042-32.038 16.748-49.928 1.56-8.321-3.64-14.457-4.264-22.259-0.069-2.878 2.185-0.972 3.396-10.505 0.521-1.734 4.857-6.589 8.772-8.632 3.615-1.426 7.808-1.841 12.065-1.729 4.255-0.112 8.448 0.303 12.063 1.729 3.918 2.043 8.253 6.898 8.77 8.632 1.217 9.533 3.469 7.627 3.4 10.505-0.625 7.802-5.826 13.938-4.266 22.259 2.705 17.89 17.371 30.686 16.746 49.928 0.73 0.938 2.29 1.459 3.226 0.52 8.006-4.059 18.617-8.219 27.459-3.223 3.744 1.663 8.944 3.222 10.296 7.488-0.521 6.865-7.974 5.789-13 8.564-2.257 1.213-4.337 2.946-4.269 3.397 35.576 11.129 58.457 53.253 100.893 46.908 1.767 0.313 2.6 2.184 3.43 3.536 0.406 2.285-1.362 4.157-2.922 5.196"
              fill="#ffffff"
              fillRule="nonzero"
            />
          </svg>
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
