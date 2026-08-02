package com.erebix.core.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static class RequestCounter {
        long windowStartEpochSec;
        int count;

        RequestCounter(long windowStartEpochSec, int count) {
            this.windowStartEpochSec = windowStartEpochSec;
            this.count = count;
        }
    }

    private final Map<String, RequestCounter> clientCounters = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 60;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = getClientIp(request);
        long currentWindow = Instant.now().getEpochSecond() / 60;

        RequestCounter counter = clientCounters.compute(clientIp, (key, existing) -> {
            if (existing == null || existing.windowStartEpochSec != currentWindow) {
                return new RequestCounter(currentWindow, 1);
            } else {
                existing.count++;
                return existing;
            }
        });

        if (counter.count > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too Many Requests - Institutional Rate Limit Exceeded. Max " + MAX_REQUESTS_PER_MINUTE + " requests per minute.\"}");
            return false;
        }

        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
