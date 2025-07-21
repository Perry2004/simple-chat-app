package net.perryz.simple_chat_app.services;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.perryz.simple_chat_app.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public boolean checkEmailAlreadyRegistered(String email) {
        var user = userRepository.findByEmail(email);
        return user.isPresent();
    }
}
