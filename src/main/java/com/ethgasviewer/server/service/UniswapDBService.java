package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.UniswapDTO;
import com.ethgasviewer.server.repositories.UniswapTxRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class UniswapDBService {
    private final UniswapTxRepository uniswapTxRepository;


    public UniswapDBService(UniswapTxRepository uniswapTxRepository) {
        this.uniswapTxRepository = uniswapTxRepository;
    }

    public List<UniswapDTO> fetchAllForLastDay() {
        return uniswapTxRepository.fetchAllFromBlock(
            Instant.now().minus(1, DAYS).toEpochMilli() / 1000);
    }
}
