package net.perryz.simple_chat_app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import net.perryz.simple_chat_app.entities.Verification;

public interface VerificationRepository extends JpaRepository<Verification, Integer> {

}
