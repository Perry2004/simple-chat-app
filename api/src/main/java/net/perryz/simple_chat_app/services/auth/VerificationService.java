package net.perryz.simple_chat_app.services.auth;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.entities.Verification;
import net.perryz.simple_chat_app.repositories.VerificationRepository;

@Service
@Slf4j
public class VerificationService {
    private final VerificationRepository verificationRepository;
    private final JavaMailSender mailSender;
    private static final int VERIFICATION_EXPIRATION_MINUTES = 10;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public VerificationService(VerificationRepository verificationRepository, JavaMailSender mailSender) {
        this.verificationRepository = verificationRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public void sendVerificationEmail(String email) {
        var verification = verificationRepository.findByEmail(email);
        if (verification.isPresent()
                && verification.get().getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(1))) {
            log.warn("Verification request too frequent for email: {}", email);
            throw new IllegalStateException("Verification request too frequent. Please try again later.");
        }
        String verificationCode = generateVerificationCode();
        var newVerification = new Verification();
        newVerification.setEmail(email);
        newVerification.setVerificationCode(verificationCode);
        newVerification.setExpiresAt(LocalDateTime.now().plusMinutes(VERIFICATION_EXPIRATION_MINUTES));
        if (verification.isPresent()) {
            newVerification.setCreatedAt(LocalDateTime.now());
            verificationRepository.update(newVerification);
        } else {
            verificationRepository.save(newVerification);
        }
        sendVerificationEmail(email, verificationCode);
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
        message.setText(String.format(
                "Hello,\n\n" +
                        "Your verification code is: %s\n\n" +
                        "This code will expire in 10 minutes.\n\n" +
                        "If you didn't request this verification, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Simple Chat App",
                code));

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

    @Transactional
    public boolean removeVerification(String email) {
        var verification = verificationRepository.findByEmail(email);
        if (verification.isEmpty()) {
            log.error("No verification found for email: {}", email);
            return false;
        }
        verificationRepository.deleteByEmail(email);
        log.info("Verification record removed for email: {}", email);
        return true;
    }

    @Scheduled(cron = "0 0 2 * * ?")
    void cleanupExpiredVerifications() {
        var now = LocalDateTime.now();
        var expiredVerifications = verificationRepository.findAll().stream()
                .filter(v -> v.getExpiresAt().isBefore(now))
                .toList();

        for (var verification : expiredVerifications) {
            verificationRepository.delete(verification);
            log.info("Removed expired verification for email: {}", verification.getEmail());
        }
    }
}
