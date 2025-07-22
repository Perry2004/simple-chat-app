package net.perryz.simple_chat_app.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.LoginUserRequest;
import net.perryz.simple_chat_app.dtos.LoginUserResponse;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.repositories.UserRepository;
import net.perryz.simple_chat_app.utilities.CookieUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenVerificationService tokenVerificationService;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    /**
     * Authenticates a user with email and password.
     * 
     * @param input The login request containing email and password
     * @return The authenticated user
     * @throws RuntimeException if authentication fails or user not found
     */
    public User authenticate(LoginUserRequest input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()));

        return userRepository.findByEmail(input.email())
                .orElseThrow();
    }

    public LoginUserResponse login(LoginUserRequest loginUserRequest, HttpServletResponse response) {
        User authenticatedUser = authenticate(loginUserRequest);

        TokenVerificationService.TokenPair tokenPair = tokenVerificationService.generateTokenPair(authenticatedUser);
        cookieUtil.addAccessTokenCookie(response, tokenPair.accessToken(), jwtService.getExpirationTime());
        cookieUtil.addRefreshTokenCookie(response, tokenPair.refreshToken(), jwtService.getRefreshExpirationTime());

        return new LoginUserResponse("Login successful", jwtService.getExpirationTime(),
                authenticatedUser.getEmail());
    }
}