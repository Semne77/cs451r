package com.commoncents.backend.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

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

    public void editTransactions(List<Integer> ids, Map<String, Object> updates) {
        List<Transaction> transactions = transactionRepository.findAllById(ids);

        for (Transaction tx : transactions) {
            if (updates.containsKey("merchant")) {
                tx.setMerchant((String) updates.get("merchant"));
            }

            if (updates.containsKey("category")) {
                tx.setCategory((String) updates.get("category"));
            }

            if (updates.containsKey("amount")) {
                Object amtObj = updates.get("amount");
                try {
                    BigDecimal amount;
                    if (amtObj instanceof Integer) {
                        amount = BigDecimal.valueOf((Integer) amtObj);
                    } else if (amtObj instanceof Double) {
                        amount = BigDecimal.valueOf((Double) amtObj);
                    } else if (amtObj instanceof String) {
                        amount = new BigDecimal((String) amtObj);
                    } else {
                        throw new IllegalArgumentException("Unsupported amount type: " + amtObj.getClass());
                    }
                    tx.setAmount(amount);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid amount format: " + amtObj);
                }
            }

            if (updates.containsKey("transactionDate")) {
                try {
                    String dateStr = updates.get("transactionDate").toString().replace("Z", "");
                    LocalDateTime date = LocalDateTime.parse(dateStr);
                    tx.setTransactionDate(date);
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Invalid transactionDate format");
                }
            }
        }

        transactionRepository.saveAll(transactions);
    }

}
