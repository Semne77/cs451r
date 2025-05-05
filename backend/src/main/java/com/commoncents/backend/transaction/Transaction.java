package com.commoncents.backend.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private int id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    private String merchant;
    private String category;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Transaction() {}

    public Transaction(BigDecimal amount, LocalDateTime transactionDate, String merchant, String category, int userId, LocalDateTime createdAt) {
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.merchant = merchant;
        this.category = category;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public String getMerchant() { return merchant; }
    public String getCategory() { return category; }
    public int getUserId() { return userId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getId() { return id; }
}
