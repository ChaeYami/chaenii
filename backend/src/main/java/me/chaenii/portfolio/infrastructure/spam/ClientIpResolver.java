package me.chaenii.portfolio.infrastructure.spam;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 프록시/CDN(Cloudflare 등) 뒤에 있을 때 실제 클라이언트 IP를 추출한다.
 */
public final class ClientIpResolver {

    private ClientIpResolver() {}

    public static String resolve(HttpServletRequest request) {
        String cf = request.getHeader("CF-Connecting-IP");
        if (cf != null && !cf.isBlank()) {
            return cf.trim();
        }
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            // "client, proxy1, proxy2" 형태 → 첫 번째가 원 클라이언트
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
