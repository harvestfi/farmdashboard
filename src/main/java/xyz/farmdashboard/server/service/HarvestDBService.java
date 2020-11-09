package xyz.farmdashboard.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import xyz.farmdashboard.server.dto.TvlHistoryDTO;
import xyz.farmdashboard.server.entity.HarvestTxEntity;
import xyz.farmdashboard.server.repositories.HarvestTxRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class HarvestDBService {
    private static final Logger log = LoggerFactory.getLogger(HarvestDBService.class);
    private final HarvestTxRepository harvestTxRepository;

    public HarvestDBService(HarvestTxRepository harvestTxRepository) {
        this.harvestTxRepository = harvestTxRepository;
    }

    public List<HarvestTxEntity> fetchAllForLastDay() {
        return harvestTxRepository.fetchAllFromBlock(
            Instant.now().minus(10, DAYS).toEpochMilli() / 1000);
    }

    public List<TvlHistoryDTO> fetchTvlByVault(String name) {
        log.debug("get tvl for " + name);
        List<HarvestTxEntity> harvestTxEntities = harvestTxRepository.fetchAllTvlForVault(name);
        List<TvlHistoryDTO> tvlHistoryDTOS = new ArrayList<>();
        if (harvestTxEntities == null) {
            return tvlHistoryDTOS;
        }
        for (HarvestTxEntity harvestTxEntity : harvestTxEntities) {
            try {
                TvlHistoryDTO tvlHistoryDTO = new TvlHistoryDTO();
                tvlHistoryDTO.setCalculateTime(harvestTxEntity.getBlockDate());
                tvlHistoryDTO.setLastTvl(harvestTxEntity.getLastUsdTvl());
                tvlHistoryDTO.setSharePrice(harvestTxEntity.getSharePrice());
                tvlHistoryDTO.setLastOwnersCount(harvestTxEntity.getOwnerCount());
                tvlHistoryDTOS.add(tvlHistoryDTO);
            } catch (Exception e) {
                log.error("Error convert " + harvestTxEntity, e);
                break;
            }
        }
        return tvlHistoryDTOS;
    }
}
