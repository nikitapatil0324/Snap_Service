package com.snap_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.snap_service.Entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
//	User findByEmailAndPassword(String email, String password);
	 User findByEmailAndPassword(String email, String password);
}
