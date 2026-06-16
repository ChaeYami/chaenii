/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

// 로컬 dev에서 붙을 백엔드 (기본: 운영 백엔드)
const DEV_API_PROXY_TARGET =
  process.env.DEV_API_PROXY_TARGET ?? "https://api.chaenii.me";

const nextConfig = {
  // 정적 export는 rewrites(프록시)를 지원하지 않으므로 dev에서는 끈다.
  // 빌드/배포(production)에서는 기존대로 정적 export.
  output: isDev ? undefined : "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // dev에서만 /api/* 를 운영 백엔드로 프록시한다.
  // 브라우저는 같은 출처(localhost)로 요청 → CORS 우회.
  ...(isDev && {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `${DEV_API_PROXY_TARGET}/api/:path*`,
        },
      ];
    },
  }),
};

export default nextConfig;
