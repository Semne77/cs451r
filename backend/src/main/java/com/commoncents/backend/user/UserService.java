package com.commoncents.backend.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void addNewUser(User user) {
        userRepository.save(user);
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUser(int id, User updatedData) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;

        user.setFirstName(updatedData.getFirstName());
        user.setLastName(updatedData.getLastName());
        user.setEmail(updatedData.getEmail());
        user.setPhone(updatedData.getPhone());
        user.setPassword(updatedData.getPassword());

        return userRepository.save(user);
    }

}
