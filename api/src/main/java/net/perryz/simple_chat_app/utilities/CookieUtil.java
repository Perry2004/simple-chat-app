package net.perryz.simple_chat_app.utilities;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    public static final String ACCESS_TOKEN_COOKIE = "accessToken";
    public static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    @Value("${HTTPS_ENABLED}")
    private boolean httpsEnabled;

    /**
     * Creates an HTTP-only cookie
     */
    public void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(httpsEnabled);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    /**
     * Creates an HTTP-only cookie for access token
     */
    public void addAccessTokenCookie(HttpServletResponse response, String token, long expirationTimeMs) {
        int maxAge = (int) (expirationTimeMs / 1000);
        addCookie(response, ACCESS_TOKEN_COOKIE, token, maxAge);
    }

    /**
     * Creates an HTTP-only cookie for refresh token
     */
    public void addRefreshTokenCookie(HttpServletResponse response, String token, long expirationTimeMs) {
        int maxAge = (int) (expirationTimeMs / 1000);
        addCookie(response, REFRESH_TOKEN_COOKIE, token, maxAge);
    }

    /**
     * Retrieves cookie value by name
     */
    public String getCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /**
     * Deletes a cookie by setting its max age to 0
     */
    public void deleteCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(httpsEnabled);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    /**
     * Deletes both access and refresh token cookies
     */
    public void deleteAuthCookies(HttpServletResponse response) {
        deleteCookie(response, ACCESS_TOKEN_COOKIE);
        deleteCookie(response, REFRESH_TOKEN_COOKIE);
    }
}
