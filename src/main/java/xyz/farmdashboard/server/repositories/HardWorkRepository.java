package xyz.farmdashboard.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import xyz.farmdashboard.server.entity.HardWorkEntity;

import java.util.List;

public interface HardWorkRepository extends JpaRepository<HardWorkEntity, String> {

    List<HardWorkEntity> findAllByOrderByBlockDate();

    List<HardWorkEntity> findAllByVaultOrderByBlockDate(String vault);

    @Query(nativeQuery = true, value = "" +
        "select " +
        "    max(id) id, " +
        "    vault, " +
        "    0 block, " +
        "    max(block_date) block_date, " +
        "    0.0 share_change, " +
        "    0.0 share_change_usd, " +
        "    SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', share_usd_total)), '_', -1)  share_usd_total, " +
        "    0.0 tvl, " +
        "    SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', all_profit)), '_', -1) all_profit, " +
        "    0 period_of_work, " +
        "    0 ps_period_of_work, " +
        "    0.0 perc, " +
        "    0.0 ps_tvl_usd, " +
        "    SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', ps_apr)), '_', -1)  ps_apr, " +
        "    SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', apr)), '_', -1) apr, " +
        "    SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', weekly_profit)), '_', -1) weekly_profit " +
        "from hard_work " +
        "group by vault")
    List<HardWorkEntity> fetchLatest();

}
