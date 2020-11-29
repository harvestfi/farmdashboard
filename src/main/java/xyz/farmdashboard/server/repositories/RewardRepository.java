package xyz.farmdashboard.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import xyz.farmdashboard.server.entity.HarvestTxEntity;
import xyz.farmdashboard.server.entity.RewardEntity;

import java.util.List;

public interface RewardRepository extends JpaRepository<RewardEntity, String> {

    @Query(nativeQuery = true, value = "" +
        "select max(id)                                                              id, " +
        "       null                                                                 block, " +
        "       max(block_date)                                                      block_date, " +
        "       vault                                                                vault, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', reward)), '_', -1)     reward, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', period_finish)), '_', -1)     period_finish " +
        " " +
        "from rewards " +
        "group by vault")
    List<RewardEntity> fetchLastRewards();

}
