import { ImageResponse } from 'next/og';
import { site } from './site';

/**
 * Shared OG card generator (NIM-057). Each route segment ships a tiny
 * opengraph-image.tsx that calls this — the file convention gives every
 * page a unique card at a clean path (/route/opengraph-image), which
 * matters because robots.txt disallows query-string URLs and Twitterbot
 * honors robots.txt.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function ogImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#08090a',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#5e6ad2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              color: '#ffffff',
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 32, maxWidth: 940, lineHeight: 1.4 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 26 }}>
            {site.tagline}
          </div>
          <div style={{ color: '#5e6ad2', fontSize: 26, fontWeight: 600 }}>nimikh.tech</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
