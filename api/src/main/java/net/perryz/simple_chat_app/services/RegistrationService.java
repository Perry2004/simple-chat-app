package net.perryz.simple_chat_app.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.RegisterUserRequest;
import net.perryz.simple_chat_app.dtos.RegisterUserResponse;
import net.perryz.simple_chat_app.entities.Preregistration;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.repositories.PreregistrationRepository;
import net.perryz.simple_chat_app.repositories.UserRepository;
import net.perryz.simple_chat_app.repositories.VerificationRepository;
import net.perryz.simple_chat_app.utilities.Utility;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {
    private final UserRepository userRepository;
    private final PreregistrationService preregistrationService;
    private final PreregistrationRepository preregistrationRepository;
    private final VerificationRepository verificationRepository;
    private final UserService userService;

    @Transactional
    public RegisterUserResponse register(RegisterUserRequest registerRequest) {
        var email = Utility.normalizeString(registerRequest.email());
        var registrationToken = registerRequest.registrationToken();
        var verificationCode = registerRequest.verificationCode();

        preregistrationService.verifyRegistrationToken(registrationToken, email);
        if (userService.checkEmailAlreadyRegistered(email)) {
            throw new IllegalArgumentException("Email is already registered: " + email);
        }
        verifyVerificationCode(email, verificationCode);
        Preregistration preregistration = preregistrationRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Preregistration not found for email: " + email));
        var user = new User();
        user.setEmail(email);
        user.setPassword(preregistration.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setCustomizedUserName(email);
        userRepository.save(user);

        preregistrationRepository.delete(preregistration);
        verificationRepository.deleteByEmail(email);

        return new RegisterUserResponse(user.getEmail(), user.getCustomizedUserName());
    }

    void verifyVerificationCode(String email, String verificationCode) {
        var verification = verificationRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found for email: " + email));

        if (!verification.getVerificationCode().equals(verificationCode)) {
            throw new IllegalArgumentException("Invalid verification code");
        }

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired");
        }
    }

}
