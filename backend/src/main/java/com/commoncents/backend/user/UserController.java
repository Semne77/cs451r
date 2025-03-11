package com.commoncents.backend.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(path = "/user")
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

    @GetMapping(path = "/getUser/{userEmail}")
    public User getUser(@PathVariable String userEmail) {
        return userService.getUser(userEmail);
    }

    @PostMapping(path = "/newUser")
    public void addUser(@RequestBody User user) {
        userService.addNewUser(user);
    }
}
