package net.perryz.simple_chat_app.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;

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
        // String timestamp = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd
        // HH:mm:ss")
        // .withZone(java.time.ZoneId.systemDefault()).format(Instant.now());

        Object requestBody = Arrays.stream(joinPoint.getArgs())
                .filter(arg -> arg != null && !isServletType(arg))
                .findFirst().orElse(null);

        // log.info("[API Request] {}: {} {} [{}]", method, endpoint, requestBody !=
        // null ? requestBody : "", timestamp);
        log.info("[API Request] {}: {} {}", method, endpoint, requestBody != null ? requestBody : "");

        Object response = joinPoint.proceed();

        // log.info("[API Response] {}: {} {} [{}]", method, endpoint, response != null
        // ? response : "", timestamp);
        log.info("[API Response] {}: {} {}", method, endpoint, response != null ? response : "");
        return response;
    }

    private boolean isServletType(Object arg) {
        return arg instanceof jakarta.servlet.http.HttpServletRequest
                || arg instanceof jakarta.servlet.http.HttpServletResponse;
    }
}