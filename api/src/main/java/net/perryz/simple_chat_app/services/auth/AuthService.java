package net.perryz.simple_chat_app.services.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.LoginUserRequest;
import net.perryz.simple_chat_app.dtos.RegisterUserRequest;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.repositories.UserRepository;

@Service
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final VerificationService verificationService;

    public AuthService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            VerificationService verificationService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationService = verificationService;
    }

    public User register(RegisterUserRequest input) {

        var verificationCode = input.verificationCode();
        var isValidCode = verificationService.verifyCode(input.email(), verificationCode);
        if (!isValidCode) {
            log.error("Invalid verification code for email: {}", input.email());
            throw new IllegalArgumentException("Invalid verification code");
        }

        if (checkEmailExists(input.email())) {
            log.error("Email already exists: {}", input.email());
            throw new IllegalArgumentException("Email already exists");
        }

        User newUser = new User();
        newUser.setUserName(input.userName());
        newUser.setEmail(input.email());
        newUser.setPassword(passwordEncoder.encode(input.password()));

        verificationService.removeVerification(input.email());
        return userRepository.save(newUser);
    }

    public User authenticate(LoginUserRequest input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()));

        return userRepository.findByEmail(input.email())
                .orElseThrow();
    }

    public boolean checkEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}