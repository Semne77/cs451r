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
        if (user == null || !request.getPassword().equals(user.getPassword())) {
            user = new User();
        }
        return user;
    }

    @PostMapping(path = "/newUser")
    public User addUser(@RequestBody User user) {
        userService.addNewUser(user);
        user = userService.getUser(user.getEmail());
        return user;
    }

    @GetMapping(path = "/{id}")
    public User getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }
}
