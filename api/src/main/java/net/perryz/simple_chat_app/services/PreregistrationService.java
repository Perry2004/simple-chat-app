package net.perryz.simple_chat_app.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.PreregisterUserRequest;
import net.perryz.simple_chat_app.entities.Preregistration;
import net.perryz.simple_chat_app.repositories.PreregistrationRepository;
import net.perryz.simple_chat_app.utilities.StringUtil;

@Service
@RequiredArgsConstructor
@Slf4j
public class PreregistrationService {
    private final PreregistrationRepository preregistrationRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    static final int PREREGISTRATION_EXPIRATION_MINUTES = 60;
    private final StringUtil stringUtil;

    @Transactional
    public String preregisterUser(PreregisterUserRequest preregisterUserRequest) {
        var email = stringUtil.normalizeString(preregisterUserRequest.email());
        var encodedPassword = passwordEncoder.encode(preregisterUserRequest.password());
        var registrationToken = generateRegistrationToken();
        var currentTime = LocalDateTime.now();
        var expiresAt = currentTime.plusMinutes(PREREGISTRATION_EXPIRATION_MINUTES);

        if (userService.checkEmailAlreadyRegistered(email)) {
            throw new IllegalArgumentException("Email is already registered: " + email);
        }

        var existingPreregistration = preregistrationRepository.findByEmail(email);

        var preregistration = new Preregistration();
        preregistration.setEmail(stringUtil.normalizeString(email));
        preregistration.setPassword(encodedPassword);
        preregistration.setRegistrationToken(registrationToken);
        preregistration.setExpiresAt(expiresAt);

        validatePreregistration(preregisterUserRequest);

        if (existingPreregistration.isPresent()) {
            log.warn("Preregistration for email {} already exists, updating", email);
            preregistrationRepository.updateByEmail(preregistration);
            return registrationToken;
        } else {
            preregistration.setCreatedAt(currentTime);
            preregistrationRepository.save(preregistration);
            return registrationToken;
        }
    }

    private String generateRegistrationToken() {
        return UUID.randomUUID().toString();
    }

    private void validatePreregistration(PreregisterUserRequest preregisterUserRequest) {
        if (preregisterUserRequest.email() == null || preregisterUserRequest.email().isEmpty()) {
            throw new IllegalArgumentException("Email must not be empty");
        }
        if (preregisterUserRequest.password() == null || preregisterUserRequest.password().isEmpty()) {
            throw new IllegalArgumentException("Password must not be empty");
        }
        if (preregisterUserRequest.password().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
    }

    void verifyRegistrationToken(String registrationToken, String email) {
        var preregistration = preregistrationRepository.findByRegistrationToken(registrationToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid registration token"));

        if (!preregistration.getEmail().equals(email)) {
            throw new IllegalArgumentException("Email does not match the registration token");
        }

        if (preregistration.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Registration token has expired");
        }
    }

    @Transactional
    @Scheduled(cron = "0 0 2 * * ?")
    void cleanupExpiredPreregistrations() {
        var deletedCount = preregistrationRepository.deleteExpiredPreregistrations(LocalDateTime.now());
        log.info("Deleted {} expired preregistrations", deletedCount);
    }
}
