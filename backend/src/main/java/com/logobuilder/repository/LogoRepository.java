package com.logobuilder.repository;

import com.logobuilder.model.Logo;
import com.logobuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface LogoRepository extends JpaRepository<Logo, Long> {
    List<Logo> findByUser(User user);
    @Query("SELECT l FROM Logo l WHERE l.user.id = :userId")
    List<Logo> findByUserId(@Param("userId") Long userId);
    List<Logo> findByIsPublicTrue();
}