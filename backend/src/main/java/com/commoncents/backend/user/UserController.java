package com.commoncents.backend.user;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.security.MessageDigest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping(path = "/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/getUsers")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @PostMapping(path = "/getUser")
    public User getUser(@RequestBody User request) {
        User user = userService.getUser(request.getEmail());
        String pas = hashPassword(request.getPassword());

        if (user == null || !pas.equals(user.getPassword())) {
            user = new User();
        }
        return user;
    }

    @PostMapping(path = "/newUser")
    public User addUser(@RequestBody User user) {
        String pas = hashPassword(user.getPassword());
        user.setPassword(pas);
        userService.addNewUser(user);
        // user = userService.getUser(user.getEmail());
        return user;
    }

    // 📥 Handle GET requests to /users/{id}
    @GetMapping(path = "/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id, HttpServletRequest request) {

        //  Get the ID of the currently logged-in user from the request header (or token/session)
        int loggedInUserId = getUserIdFromSessionOrToken(request);

        //  If the logged-in user is trying to access someone else's data, deny access
        if (loggedInUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
        }

        //  If IDs match, retrieve the user from the database
        User user = userService.getUserById(id);

        //  Return the user in the HTTP response with status 200 OK
        return ResponseEntity.ok(user);
}


    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User updatedData) {
        return userService.updateUser(id, updatedData);
    }


    private int getUserIdFromSessionOrToken(HttpServletRequest request) {
        String userIdHeader = request.getHeader("user-id");
        return Integer.parseInt(userIdHeader);
    }


    //  Utility method to hash a password using SHA-256
    public static String hashPassword(String password) {
        try {
            //  Create a MessageDigest instance using SHA-256 algorithm
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            //  Convert the password string into a byte array and compute the hash
            byte[] hashedBytes = md.digest(password.getBytes());

            //  Convert the byte array into a readable hexadecimal string
            StringBuilder stringBuilder = new StringBuilder();
            for (byte b : hashedBytes) {
                // Format each byte as a two-character hex string and append
                stringBuilder.append(String.format("%02x", b));
            }

            //  Return the final hex string (the hashed password)
            return stringBuilder.toString();

        } catch (NoSuchAlgorithmException e) {
            //  If SHA-256 is not supported (very rare), print the error and return null
            e.printStackTrace();
            return null;
        }
    }

}
