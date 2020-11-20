package xyz.farmdashboard.server.repositories;

import xyz.farmdashboard.server.entity.HarvestTxEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HarvestTxRepository extends JpaRepository<HarvestTxEntity, String> {

    @Query("select t from HarvestTxEntity t where t.blockDate > :fromTs order by t.blockDate asc")
    List<HarvestTxEntity> fetchAllFromBlock(@Param("fromTs") long fromTs);

    HarvestTxEntity findFirstByVaultOrderByBlockDateDesc(String name);

    @Query("select t from HarvestTxEntity t order by t.blockDate asc")
    List<HarvestTxEntity> fetchAll();

    @Query(nativeQuery = true, value = "" +
        "select " +
        "    id as id, " +
        "    null as amount, " +
        "    null as amount_in, " +
        "    null as block, " +
        "    block_date as block_date, " +
        "    confirmed as confirmed, " +
        "    null as hash, " +
        "    null as last_gas, " +
        "    last_tvl as last_tvl, " +
        "    last_usd_tvl as last_usd_tvl, " +
        "    null as method_name, " +
        "    null as owner, " +
        "    owner_count as owner_count, " +
        "    share_price as share_price, " +
        "    null as usd_amount, " +
        "    null as vault, " +
        "    null as prices, " +
        "    null as lp_stat " +
        "from harvest_tx where vault = :vault order by block_date")
    List<HarvestTxEntity> fetchAllTvlForVault(@Param("vault") String vault);
}
