package net.perryz.simple_chat_app.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import net.perryz.simple_chat_app.entities.Preregistration;

public interface PreregistrationRepository extends JpaRepository<Preregistration, Long> {
        Optional<Preregistration> findByEmail(String email);

        void deleteByEmail(String email);

        @Transactional
        @Modifying
        @Query("""
                        UPDATE Preregistration p
                        SET p.password = :#{#preregistration.password},
                        p.registrationToken = :#{#preregistration.registrationToken},
                        p.expiresAt = :#{#preregistration.expiresAt}
                        WHERE p.email = :#{#preregistration.email}
                        """)
        void updateByEmail(@Param("preregistration") Preregistration preregistration);

        @Transactional
        @Modifying
        @Query("""
                        DELETE FROM Preregistration p
                        WHERE p.expiresAt < :currentTime
                        """)
        int deleteExpiredPreregistrations(@Param("currentTime") LocalDateTime currentTime);

        Optional<Preregistration> findByRegistrationToken(String registrationToken);

        @Transactional
        @Modifying(flushAutomatically = true)
        @Query("""
                        UPDATE Preregistration p
                        SET p.verification.id = :verificationId
                        WHERE p.email = :email
                        """)
        void updateVerificationIdByEmail(@Param("email") String email, @Param("verificationId") Long verificationId);

        @Transactional
        @Modifying()
        @Query("""
                        UPDATE Preregistration p
                        SET p.expiresAt = :expiresAt
                        WHERE p.email = :email
                        """)
        void updateExpiresAtByEmail(@Param("email") String email, @Param("expiresAt") LocalDateTime expiresAt);

}
