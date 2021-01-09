package xyz.farmdashboard.server.service;

import static java.time.temporal.ChronoUnit.DAYS;

import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import xyz.farmdashboard.server.entity.UniswapTxEntity;
import xyz.farmdashboard.server.repositories.UniswapTxRepository;

@Service
public class UniswapDBService {

    private static final int SEPT_04 = 1599177600;
    private final UniswapTxRepository uniswapTxRepository;
    private final static Pageable LIMIT_100 = PageRequest.of(0, 100);

    public UniswapDBService(UniswapTxRepository uniswapTxRepository) {
        this.uniswapTxRepository = uniswapTxRepository;
    }

    public List<UniswapTxEntity> fetchUni(String from, String to) {
        if (from == null && to == null) {
            return uniswapTxRepository.fetchAllFromBlockDate(
                Instant.now().minus(1, DAYS).toEpochMilli() / 1000);
        }
        int fromI = 0;
        int toI = Integer.MAX_VALUE;
        if (from != null) {
            fromI = Integer.parseInt(from);
        }
        if (to != null) {
            toI = Integer.parseInt(to);
        }
        return uniswapTxRepository.fetchAllByPeriod(fromI, toI);
    }

//    public List<UniswapTxEntity> fetchAllForLastDay() {
//        return uniswapTxRepository.fetchAllLimited(LIMIT_100);
//    }

    public Iterable<UniswapTxRepository.OhlcProjection> ohclUniswapTx(String name) {
        return uniswapTxRepository.fetchOHLCTransactionsFromBlock(
            name, 1, 3600);
    }
}
