package net.perryz.simple_chat_app.repositories;

import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import net.perryz.simple_chat_app.entities.Verification;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {
        Optional<Verification> findByEmail(String email);

        @Transactional
        @Modifying
        @Query("""
                        UPDATE Verification v
                        SET v.verificationCode = :#{#verification.verificationCode},
                        v.expiresAt = :#{#verification.expiresAt}
                        WHERE v.email = :#{#verification.email}
                        """)
        void updateByEmail(Verification verification);

        @Transactional
        @Modifying
        @Query("""
                        DELETE FROM Verification v
                        WHERE v.expiresAt < :currentTime
                        """)
        int deleteExpiredVerifications(@Param("currentTime") LocalDateTime currentTime);

        void deleteByEmail(String email);
}
