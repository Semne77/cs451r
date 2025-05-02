package com.commoncents.backend.goal;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int goal_id;

    private int user_id;
    private String goal_type;
    private String category;
    private double target_amount;
    private String period;
    private LocalDate start_date;
    private LocalDate end_date;
    private LocalDateTime created_at = LocalDateTime.now();

    public Goal() {}

    public Goal(int user_id, String goal_type, String category, double target_amount,
                String period, LocalDate start_date, LocalDate end_date) {
        this.user_id = user_id;
        this.goal_type = goal_type;
        this.category = category;
        this.target_amount = target_amount;
        this.period = period;
        this.start_date = start_date;
        this.end_date = end_date;
    }

    // Getters and setters
    public int getGoal_id() { return goal_id; }
    public void setGoal_id(int goal_id) { this.goal_id = goal_id; }

    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public String getGoal_type() { return goal_type; }
    public void setGoal_type(String goal_type) { this.goal_type = goal_type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getTarget_amount() { return target_amount; }
    public void setTarget_amount(double target_amount) { this.target_amount = target_amount; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public LocalDate getStart_date() { return start_date; }
    public void setStart_date(LocalDate start_date) { this.start_date = start_date; }

    public LocalDate getEnd_date() { return end_date; }
    public void setEnd_date(LocalDate end_date) { this.end_date = end_date; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
}