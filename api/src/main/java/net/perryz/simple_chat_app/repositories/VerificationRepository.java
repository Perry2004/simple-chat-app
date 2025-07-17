package net.perryz.simple_chat_app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import net.perryz.simple_chat_app.entities.Verification;

public interface VerificationRepository extends JpaRepository<Verification, Integer> {
    Optional<Verification> findByEmail(String email);

    void deleteByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE Verification v SET v.verificationCode = :#{#verification.verificationCode}, v.expiresAt = :#{#verification.expiresAt}, v.createdAt = :#{#verification.createdAt} WHERE v.email = :#{#verification.email}")
    void update(@Param("verification") Verification verification);
}
