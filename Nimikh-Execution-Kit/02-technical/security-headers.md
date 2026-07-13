# Security Response Headers

Set these headers on all responses from nimikh.com. In Next.js, add to `next.config.js` under `async headers()`. Verify via securityheaders.com after deploy.

## Required

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-Frame-Options: SAMEORIGIN
```

## Content-Security-Policy (starter — refine to your actual origins)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com https://plausible.io https://api.nimikh.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

## Next.js config snippet

```js
// next.config.js
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }
];

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  }
};
```

## HSTS Preload

After confirming HSTS works, submit https://nimikh.com to https://hstspreload.org/ for browser-level HTTPS enforcement.
