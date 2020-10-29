package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.TransactionDTO;
import com.ethgasviewer.server.repositories.TransactionsRepository;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionsService {
    private final static BigInteger AVERAGE_BLOCK_PER_DAY = new BigInteger("5760");

    private final TransactionsRepository transactionsRepository;


    public TransactionsService(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public List<TransactionDTO> fetchAllForLastDay() {
        TransactionDTO firstDto = transactionsRepository.findFirstByOrderByBlockDesc();
        if (firstDto != null && firstDto.getBlock() != null) {
            return transactionsRepository.fetchAllFromBlock(firstDto.getBlock().min(AVERAGE_BLOCK_PER_DAY));
        }
        return new ArrayList<>();
    }
}
