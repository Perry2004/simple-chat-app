package net.perryz.simple_chat_app.dtos;

public record LoginUserResponse(String message, long expiresIn, String email) {
}
