package net.perryz.simple_chat_app.services.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.perryz.simple_chat_app.dtos.LoginUserRequest;
import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.repositories.UserRepository;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public User authenticate(LoginUserRequest input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()));

        return userRepository.findByEmail(input.email())
                .orElseThrow();
    }

}