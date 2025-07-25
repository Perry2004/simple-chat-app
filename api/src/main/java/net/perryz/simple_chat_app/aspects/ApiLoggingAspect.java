package net.perryz.simple_chat_app.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Aspect
@Component
public class ApiLoggingAspect {

    @Around("within(@org.springframework.web.bind.annotation.RestController *)")
    public Object logApiCall(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;

        String endpoint = request != null ? request.getRequestURI() : "N/A";
        String method = request != null ? request.getMethod() : "N/A";
        String timestamp = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                .withZone(ZoneId.systemDefault()).format(Instant.now());
        String remoteAddr = getClientIpAddress(request);

        Map<String, String> requestHeaders = extractSafeHeaders(request);
        Map<String, String[]> requestParams = request != null ? request.getParameterMap() : Map.of();

        Object requestBody = Arrays.stream(joinPoint.getArgs())
                .filter(arg -> arg != null && !isServletType(arg))
                .findFirst().orElse(null);

        log.info("[API Request] {} {} from {} | Method: {} | Headers: {} | Params: {} | Body: {} | Timestamp: {}",
                method, endpoint, remoteAddr, joinPoint.getSignature().getName(),
                requestHeaders, requestParams, requestBody != null ? requestBody : "", timestamp);

        long startTime = System.currentTimeMillis();
        Object response = null;
        Exception exception = null;

        try {
            response = joinPoint.proceed();
            return response;
        } catch (Exception e) {
            exception = e;
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            if (exception != null) {
                log.error("[API Error] {} {} | Duration: {}ms | Error: {} | Timestamp: {}",
                        method, endpoint, duration, exception.getMessage(), timestamp);
            } else {
                String responseStatus = getResponseStatus(response);
                log.info("[API Response] {} {} | Duration: {}ms | Status: {} | Response: {} | Timestamp: {}",
                        method, endpoint, duration, responseStatus,
                        response != null ? response : "", timestamp);
            }
        }
    }

    private boolean isServletType(Object arg) {
        return arg instanceof jakarta.servlet.http.HttpServletRequest
                || arg instanceof jakarta.servlet.http.HttpServletResponse;
    }

    /**
     * Extract client IP address, handling proxy headers
     */
    private String getClientIpAddress(HttpServletRequest request) {
        if (request == null)
            return "N/A";

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    /**
     * Extract safe headers (excluding sensitive information)
     */
    private Map<String, String> extractSafeHeaders(HttpServletRequest request) {
        Map<String, String> safeHeaders = new HashMap<>();
        if (request == null)
            return safeHeaders;

        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String lowerHeaderName = headerName.toLowerCase();

            if (lowerHeaderName.contains("authorization") ||
                    lowerHeaderName.contains("cookie") ||
                    lowerHeaderName.contains("session") ||
                    lowerHeaderName.contains("token")) {
                continue;
            }

            if (lowerHeaderName.equals("content-type") ||
                    lowerHeaderName.equals("accept") ||
                    lowerHeaderName.equals("user-agent") ||
                    lowerHeaderName.equals("content-length") ||
                    lowerHeaderName.equals("x-forwarded-for") ||
                    lowerHeaderName.equals("x-real-ip")) {
                safeHeaders.put(headerName, request.getHeader(headerName));
            }
        }

        return safeHeaders;
    }

    /**
     * Extract response status from different response types
     */
    private String getResponseStatus(Object response) {
        if (response instanceof ResponseEntity) {
            ResponseEntity<?> responseEntity = (ResponseEntity<?>) response;
            return responseEntity.getStatusCode().toString();
        }

        return "200 OK";
    }
}