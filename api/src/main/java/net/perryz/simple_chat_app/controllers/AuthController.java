package net.perryz.simple_chat_app.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.LoginUserRequest;
import net.perryz.simple_chat_app.dtos.LoginUserResponse;
import net.perryz.simple_chat_app.dtos.PreregisterUserRequest;
import net.perryz.simple_chat_app.dtos.RegisterUserRequest;
import net.perryz.simple_chat_app.dtos.RegisterUserResponse;
import net.perryz.simple_chat_app.dtos.SendVerificationRequest;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.services.auth.AuthService;
import net.perryz.simple_chat_app.services.auth.JwtService;
import net.perryz.simple_chat_app.services.auth.PreregistrationService;
import net.perryz.simple_chat_app.services.auth.RegistrationService;
import net.perryz.simple_chat_app.services.auth.VerificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    private final AuthService authService;
    private final VerificationService verificationService;
    private final PreregistrationService preregistrationService;
    private final RegistrationService registrationService;

    /**
     * Registers a new user into the system.
     * 
     * @param registerUserRequest
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        RegisterUserResponse registerUserResponse = registrationService.register(registerUserRequest);
        return ResponseEntity.ok(registerUserResponse);
    }

    /**
     * Logins a user and return a JWT token.
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
     * Sends an email with a verification code to the user.
     * 
     * @param sendVerificationRequest
     * @return
     */
    @PostMapping("/send-verification")
    public void sendVerificationEmail(
            @RequestBody SendVerificationRequest sendVerificationRequest) {
        verificationService.sendVerificationEmail(sendVerificationRequest);
    }

    @PostMapping("/pre-register")
    public ResponseEntity<String> preregisterUser(@RequestBody PreregisterUserRequest preregisterUserRequest) {
        var registrationToken = preregistrationService.preregisterUser(preregisterUserRequest);
        return ResponseEntity.ok(registrationToken);
    }

}
