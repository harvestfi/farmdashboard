package xyz.farmdashboard.server.service;

import xyz.farmdashboard.server.dto.TvlHistoryDTO;
import xyz.farmdashboard.server.entity.UniswapTxEntity;
import xyz.farmdashboard.server.repositories.UniswapTxRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class UniswapDBService {
    private static final int SEPT_04 = 1599177600;
    private final UniswapTxRepository uniswapTxRepository;


    public UniswapDBService(UniswapTxRepository uniswapTxRepository) {
        this.uniswapTxRepository = uniswapTxRepository;
    }

    public List<UniswapTxEntity> fetchAllForLastDay() {
        return uniswapTxRepository.fetchAllFromBlock(
            Instant.now().minus(10, DAYS).toEpochMilli() / 1000);
    }

    public Iterable<UniswapTxRepository.OhlcProjection> ohclUniswapTx() {
        return uniswapTxRepository.fetchOHLCTransactionsFromBlock(
            1, 3600);
    }

    public List<TvlHistoryDTO> fetchIncome() {
        return null;
    }
}
