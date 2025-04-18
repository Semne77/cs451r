package com.commoncents.backend.transaction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsForUser(int userId) {
        return transactionRepository.findByUserId(userId);
    }

    public void addTransaction(Transaction transaction) {
        transactionRepository.save(transaction);
    }

    public void deleteTransaction(int id) {
        transactionRepository.deleteById(id);
    }

    public List<Transaction> saveAll(List<Transaction> transactions) {
        return transactionRepository.saveAll(transactions);
    }

    public void deleteMany(List<Integer> ids) {
        transactionRepository.deleteAllById(ids);
    }

}
