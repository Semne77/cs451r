package com.commoncents.backend.transaction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{userId}")
    public List<Transaction> getTransactions(@PathVariable int userId) {
        return transactionService.getTransactionsForUser(userId);
    }

    @PostMapping("/add")
    public void addTransaction(@RequestBody Transaction transaction) {
        transactionService.addTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable int id) {
        transactionService.deleteTransaction(id);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/bulk")
    public List<Transaction> bulkAdd(@RequestBody List<Transaction> transactions) {
        return transactionService.saveAll(transactions);
    }

    @PostMapping("/deleteMany")
    public ResponseEntity<?> deleteMany(@RequestBody List<Integer> ids) {
        transactionService.deleteMany(ids);
        return ResponseEntity.ok().build();
    }

}
