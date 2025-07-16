package net.perryz.simple_chat_app.services;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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

    public void sendVerificationEmail(String email) {
        String verificationCode = generateVerificationCode();
        var verification = new Verification();
        verification.setEmail(email);
        verification.setVerificationCode(verificationCode);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(VERIFICATION_EXPIRATION_MINUTES));
        verificationRepository.save(verification);
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

        mailSender.send(message);
    }
}