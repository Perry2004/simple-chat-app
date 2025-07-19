package net.perryz.simple_chat_app.dtos;

public record SendVerificationRequest(String registrationToken, String email) {

}
