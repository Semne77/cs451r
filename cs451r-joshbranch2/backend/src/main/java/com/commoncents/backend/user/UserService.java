package com.commoncents.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void deleteUser(int userId) {
        userRepository.deleteById(userId);
    }

    public User saveUser(User user) {
        // ✅ Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean doesEmailExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // ✅ New method for login password check
    public boolean verifyUser(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            String storedHashedPassword = optionalUser.get().getPassword();
            return passwordEncoder.matches(rawPassword, storedHashedPassword);
        }
        return false;
    }
}
