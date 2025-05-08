package com.commoncents.backend.goal;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goalId;

    private String category;
    private String goalType;
    private String period;
    private BigDecimal targetAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate createdAt;

    @Column(name = "user_id")
    private Long userId;

    // Getters
    public Long getGoalId() { return goalId; }
    public String getCategory() { return category; }
    public String getGoalType() { return goalType; }
    public String getPeriod() { return period; }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public LocalDate getCreatedAt() { return createdAt; }
    public Long getUserId() { return userId; }

    // Setters
    public void setGoalId(Long goalId) { this.goalId = goalId; }
    public void setCategory(String category) { this.category = category; }
    public void setGoalType(String goalType) { this.goalType = goalType; }
    public void setPeriod(String period) { this.period = period; }
    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public void setUserId(Long userId) { this.userId = userId; }
}
