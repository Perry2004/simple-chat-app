package net.perryz.simple_chat_app.services;

import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.SendVerificationRequest;
import net.perryz.simple_chat_app.entities.Verification;
import net.perryz.simple_chat_app.repositories.PreregistrationRepository;
import net.perryz.simple_chat_app.repositories.VerificationRepository;
import net.perryz.simple_chat_app.utilities.Utility;

@Service
@Slf4j
@RequiredArgsConstructor
public class VerificationService {
    private final PreregistrationRepository preregistrationRepository;
    private final JavaMailSender mailSender;
    private final VerificationRepository verificationRepository;
    private final PreregistrationService preregistrationService;
    private static final int VERIFICATION_EXPIRATION_MINUTES = 10;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Transactional
    public void sendVerificationEmail(SendVerificationRequest sendVerificationRequest) {
        var registrationToken = sendVerificationRequest.registrationToken();
        var email = Utility.normalizeString(sendVerificationRequest.email());

        validatePayload(sendVerificationRequest);

        var verification = verificationRepository.findByEmail(email);
        if (verification.isPresent()
                &&
                verification.get().getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(1))) {
            log.warn("Verification request too frequent for email: {}", email);
            throw new IllegalStateException("Verification request too frequent. Please try again later.");
        }

        preregistrationService.verifyRegistrationToken(registrationToken, email);

        String verificationCode = generateVerificationCode();

        Verification savedVerification;
        if (verification.isPresent()) {
            var existingVerification = verification.get();
            existingVerification.setVerificationCode(verificationCode);
            existingVerification.setExpiresAt(LocalDateTime.now().plusMinutes(VERIFICATION_EXPIRATION_MINUTES));
            verificationRepository.updateByEmail(existingVerification);
            savedVerification = existingVerification;
            preregistrationRepository.updateExpiresAtByEmail(email,
                    LocalDateTime.now().plusMinutes(PreregistrationService.PREREGISTRATION_EXPIRATION_MINUTES));
        } else {
            var newVerification = new Verification();
            newVerification.setVerificationCode(verificationCode);
            newVerification.setExpiresAt(LocalDateTime.now().plusMinutes(VERIFICATION_EXPIRATION_MINUTES));
            newVerification.setEmail(email);
            savedVerification = verificationRepository.save(newVerification);
        }

        preregistrationRepository.updateVerificationIdByEmail(email, savedVerification.getId());

        sendVerificationEmail(email, verificationCode);
    }

    void validatePayload(SendVerificationRequest sendVerificationRequest) {
        if (sendVerificationRequest.registrationToken() == null
                || sendVerificationRequest.registrationToken().isEmpty()) {
            throw new IllegalArgumentException("Registration token must not be empty");
        }
        if (sendVerificationRequest.email() == null || sendVerificationRequest.email().isEmpty()) {
            throw new IllegalArgumentException("Email must not be empty");
        }
    }

    private String generateVerificationCode() {
        var random = new Random();
        var code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    private void sendVerificationEmail(String email, String code) {
        log.info("Sending verification email to: {}", email);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Email Verification Code - Simple Chat App");
        message.setText("""
                Hello,

                Your verification code is: %s

                This code will expire in 10 minutes.

                If you didn't request this verification, please ignore this email.

                Best regards,
                Simple Chat App
                """.formatted(code));

        // mailSender.send(message);
    }

    public boolean verifyCode(String email, String verificationCode) {
        var verification = verificationRepository.findByEmail(email);
        if (verification.isEmpty()) {
            log.error("No verification found for email: {}", email);
            return false;
        }

        var verificationRecord = verification.get();
        if (isCodeExpired(verificationRecord)) {
            log.error("Verification code expired for email: {}", email);
            return false;
        }

        if (!verificationRecord.getVerificationCode().equals(verificationCode)) {
            log.error("Invalid verification code for email: {}", email);
            return false;
        }

        log.info("Verification code validated successfully for email: {}", email);
        return true;
    }

    private boolean isCodeExpired(Verification verification) {
        return verification.getExpiresAt().isBefore(LocalDateTime.now());
    }

    @Scheduled(cron = "0 0 2 * * ?")
    void cleanupExpiredVerifications() {
        var deletedCount = verificationRepository.deleteExpiredVerifications(LocalDateTime.now());
        log.info("Deleted {} expired verifications", deletedCount);
    }
}
