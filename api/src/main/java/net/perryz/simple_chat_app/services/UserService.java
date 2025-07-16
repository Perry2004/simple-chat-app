package net.perryz.simple_chat_app.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import net.perryz.simple_chat_app.entities.User;
import net.perryz.simple_chat_app.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
}
