package net.perryz.simple_chat_app.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.LoginUserRequest;
import net.perryz.simple_chat_app.dtos.LoginUserResponse;
import net.perryz.simple_chat_app.dtos.PreregisterUserRequest;
import net.perryz.simple_chat_app.dtos.ProfileResponse;
import net.perryz.simple_chat_app.dtos.RegisterUserRequest;
import net.perryz.simple_chat_app.dtos.RegisterUserResponse;
import net.perryz.simple_chat_app.dtos.SendVerificationRequest;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.services.AuthService;
import net.perryz.simple_chat_app.services.PreregistrationService;
import net.perryz.simple_chat_app.services.RegistrationService;
import net.perryz.simple_chat_app.services.TokenVerificationService;
import net.perryz.simple_chat_app.services.UserService;
import net.perryz.simple_chat_app.services.VerificationService;
import net.perryz.simple_chat_app.utilities.CookieUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final TokenVerificationService tokenVerificationService;
    private final VerificationService verificationService;
    private final PreregistrationService preregistrationService;
    private final RegistrationService registrationService;
    private final CookieUtil cookieUtil;

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
     * Logins a user and return JWT tokens via HTTP-only cookies.
     * 
     * @param loginUserRequest
     * @param response
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> authenticate(
            @RequestBody LoginUserRequest loginUserRequest,
            HttpServletResponse response) {
        LoginUserResponse loginResponse = authService.login(loginUserRequest, response);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        cookieUtil.deleteAuthCookies(response);
        return ResponseEntity.ok("Logged out successfully");
    }

    /**
     * Sends an email with a verification code to the user.
     * 
     * @param sendVerificationRequest
     * @return
     */
    @PostMapping("/send-verification")
    public ResponseEntity<String> sendVerificationEmail(
            @RequestBody SendVerificationRequest sendVerificationRequest) {
        verificationService.sendVerificationEmail(sendVerificationRequest);
        return ResponseEntity.ok("Verification email sent successfully.");
    }

    /**
     * Pre-registers a user and returns a registration token.
     * 
     * @param preregisterUserRequest
     * @return
     */
    @PostMapping("/pre-register")
    public ResponseEntity<String> preregisterUser(@RequestBody PreregisterUserRequest preregisterUserRequest) {
        var registrationToken = preregistrationService.preregisterUser(preregisterUserRequest);
        return ResponseEntity.ok(registrationToken);
    }

    /**
     * Checks if the email is already registered in the system.
     * 
     * @param email
     * @return
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailAlreadyRegistered(@RequestParam String email) {
        boolean isRegistered = userService.checkEmailAlreadyRegistered(email);
        return ResponseEntity.ok(isRegistered);
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getCurrentUser(HttpServletRequest request, HttpServletResponse response) {
        User user = tokenVerificationService.getCurrentUserWithRefresh(request, response);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileResponse profileResponse = new ProfileResponse(user.getEmail());
        return ResponseEntity.ok(profileResponse);
    }

}
