package net.perryz.simple_chat_app.services;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.utilities.CookieUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class TokenVerificationService {
    private final JwtService jwtService;
    private final UserService userService;
    private final CookieUtil cookieUtil;

    /**
     * Generates new access and refresh tokens for a user.
     * 
     * @param user The user to generate tokens for
     * @return TokenPair containing both new tokens
     */
    public TokenPair generateTokenPair(User user) {
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new TokenPair(accessToken, refreshToken);
    }

    /**
     * Gets the current user based on an access token.
     * 
     * @param accessToken The access token to extract user from
     * @return User if token is valid, null otherwise
     */
    public User getCurrentUser(String accessToken) {
        if (accessToken == null) {
            return null;
        }

        try {
            String username = jwtService.extractUsername(accessToken);
            return userService.findByEmail(username);
        } catch (RuntimeException e) {
            log.warn("Failed to get current user from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Gets the current user from access token, attempting refresh if needed.
     * This method handles the complete flow of token validation and refresh.
     * 
     * @param request  HTTP request to get cookies from
     * @param response HTTP response to set new cookies if refresh is needed
     * @return User if authentication is successful, null otherwise
     */
    public User getCurrentUserWithRefresh(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = cookieUtil.getCookieValue(request, CookieUtil.ACCESS_TOKEN_COOKIE);
        User user = null;

        if (accessToken != null) {
            user = getCurrentUser(accessToken);
        }

        if (user == null) {
            user = attemptTokenRefresh(request, response);
        }

        return user;
    }

    /**
     * Attempts to refresh the access token using the refresh token cookie.
     * If successful, updates cookies with new tokens.
     * 
     * @param request  HTTP request to get refresh token cookie from
     * @param response HTTP response to set new cookies if refresh is successful
     * @return User if refresh is successful, null otherwise
     */
    public User attemptTokenRefresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = cookieUtil.getCookieValue(request, CookieUtil.REFRESH_TOKEN_COOKIE);

        if (refreshToken == null) {
            return null;
        }

        try {
            String userEmail = jwtService.extractUsername(refreshToken);
            User refreshUser = userService.findByEmail(userEmail);

            if (jwtService.isTokenValid(refreshToken, refreshUser)) {
                TokenPair tokenPair = generateTokenPair(refreshUser);

                cookieUtil.addAccessTokenCookie(response, tokenPair.accessToken(),
                        jwtService.getExpirationTime());
                cookieUtil.addRefreshTokenCookie(response, tokenPair.refreshToken(),
                        jwtService.getRefreshExpirationTime());

                log.info("Token refresh successful for user: {}", userEmail);
                return refreshUser;
            } else {
                cookieUtil.deleteAuthCookies(response);
                log.warn("Invalid refresh token for user: {}", userEmail);
            }
        } catch (Exception e) {
            cookieUtil.deleteAuthCookies(response);
            log.error("Error during token refresh: {}", e.getMessage());
        }

        return null;
    }

    /**
     * Simple record to hold both access and refresh tokens.
     */
    public record TokenPair(String accessToken, String refreshToken) {
    }
}
