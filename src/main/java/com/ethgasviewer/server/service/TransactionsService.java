package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.TransactionDTO;
import com.ethgasviewer.server.repositories.TransactionsRepository;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.Instant;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class TransactionsService {
    private final static BigInteger AVERAGE_BLOCK_PER_DAY = new BigInteger("5760");

    private final TransactionsRepository transactionsRepository;


    public TransactionsService(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public List<TransactionDTO> fetchAllForLastDay() {
        return transactionsRepository.fetchAllFromBlock(
            Instant.now().minus(1, DAYS).toEpochMilli() / 1000);
    }
}
