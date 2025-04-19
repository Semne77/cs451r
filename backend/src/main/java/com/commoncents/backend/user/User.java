package com.commoncents.backend.user;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;


@Entity
@Table(name = "users")
public class User {
    @Id
    @SequenceGenerator(name = "user_sequence", sequenceName = "user_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")
    private int userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    @JsonIgnore
    private String password;

    public User() {
        this.userId = 0;
        this.firstName = "unknown";
        this.lastName = "unknown";
        this.email = "unknown";
        this.phone = "unknown";
        this.password = "unknown";
    }

    public User(String email, String password) {
        this.userId = 0;
        this.firstName = "";
        this.lastName = "";
        this.email = email;
        this.phone = "";
        this.password = password;
    }

    public User(int id, String firstname, String lastname, String email, String phone, String password) {
        this.userId = id;
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    public User(String firstname, String lastname, String email, String phone, String password) {
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    public int getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
