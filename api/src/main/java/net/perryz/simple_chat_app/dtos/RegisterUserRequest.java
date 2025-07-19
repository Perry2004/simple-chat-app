package net.perryz.simple_chat_app.dtos;

public record RegisterUserRequest(String email, String registrationToken, String verificationCode) {
}