package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.HarvestDTO;
import com.ethgasviewer.server.model.UniswapDTO;
import com.ethgasviewer.server.repositories.HarvestTxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class HarvestDBService {
    private final HarvestTxRepository harvestTxRepository;

    public HarvestDBService(HarvestTxRepository harvestTxRepository) {
        this.harvestTxRepository = harvestTxRepository;
    }

    public List<HarvestDTO> fetchAllForLastDay() {
        return harvestTxRepository.fetchAllFromBlock(
            Instant.now().minus(1, DAYS).toEpochMilli() / 1000);
    }
}
