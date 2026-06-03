package me.chaenii.portfolio.infrastructure;

import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.chaenii.portfolio.domain.DomainException;
import me.chaenii.portfolio.infrastructure.spam.ClientIpResolver;
import me.chaenii.portfolio.presentation.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(RateLimitInterceptor.class);

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String ip = ClientIpResolver.resolve(request);
        Bucket bucket = buckets.computeIfAbsent(ip, k -> createBucket());

        if (!bucket.tryConsume(1)) {
            log.warn("Rate limit exceeded ip={} path={}", ip, request.getRequestURI());
            throw new DomainException(ErrorCode.G004);
        }
        return true;
    }

    private Bucket createBucket() {
        return Bucket.builder()
                .addLimit(limit -> limit.capacity(5).refillGreedy(5, Duration.ofMinutes(1)))
                .build();
    }
}
