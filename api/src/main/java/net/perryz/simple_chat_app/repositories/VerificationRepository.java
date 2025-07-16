package net.perryz.simple_chat_app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import net.perryz.simple_chat_app.entities.Verification;

public interface VerificationRepository extends JpaRepository<Verification, Integer> {
    Optional<Verification> findByEmail(String email);

    void deleteByEmail(String email);
}
