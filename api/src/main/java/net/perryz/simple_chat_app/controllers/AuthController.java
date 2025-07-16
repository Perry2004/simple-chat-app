package net.perryz.simple_chat_app.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.LoginUserRequest;
import net.perryz.simple_chat_app.dtos.LoginUserResponse;
import net.perryz.simple_chat_app.dtos.RegisterUserRequest;
import net.perryz.simple_chat_app.dtos.SendVerificationRequest;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.services.AuthService;
import net.perryz.simple_chat_app.services.JwtService;
import net.perryz.simple_chat_app.services.VerificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {
    private final JwtService jwtService;
    private final AuthService authService;
    private final VerificationService verificationService;

    public AuthController(JwtService jwtService, AuthService authService, VerificationService verificationService) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.verificationService = verificationService;
    }

    /**
     * Register a new user into the system.
     * 
     * @param registerUserRequest
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        User newUser = authService.register(registerUserRequest);
        return ResponseEntity.ok(newUser);
    }

    /**
     * Login a user and return a JWT token.
     * 
     * @param loginUserRequest
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> authenticate(@RequestBody LoginUserRequest loginUserRequest) {
        User authenticatedUser = authService.authenticate(loginUserRequest);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginUserResponse loginResponse = new LoginUserResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    /**
     * Check if there's an existing user with the given email.
     * 
     * @param email
     * @return
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = authService.checkEmailExists(email);
        if (exists) {
            return ResponseEntity.status(409).body(exists); // 409 Conflict
        } else {
            return ResponseEntity.ok(exists);
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody SendVerificationRequest sendVerificationRequest) {
        verificationService.sendVerificationEmail(sendVerificationRequest.email());
        return ResponseEntity.ok("Verification email sent successfully.");
    }

}
