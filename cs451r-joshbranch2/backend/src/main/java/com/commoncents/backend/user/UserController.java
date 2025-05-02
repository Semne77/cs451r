package com.commoncents.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Old endpoint (kept intact)
    @PostMapping("/users/newUser")
    public ResponseEntity<User> registerUserLegacy(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // ✅ New registration endpoint
    @PostMapping("/api/users/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // ✅ New login endpoint using password hashing
    @PostMapping("/api/users/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        boolean isAuthenticated = userService.verifyUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PostMapping("/users/recover")
    public ResponseEntity<String> recoverPassword(@RequestBody User user) {
        String email = user.getEmail();
        boolean exists = userService.doesEmailExist(email);
        if (exists) {
            return ResponseEntity.ok("Recovery instructions sent to " + email);
        } else {
            return ResponseEntity.badRequest().body("No account found for that email.");
        }
    }

    @DeleteMapping("/users/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
