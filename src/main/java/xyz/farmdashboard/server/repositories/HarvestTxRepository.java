package xyz.farmdashboard.server.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.farmdashboard.server.entity.HarvestTxEntity;

import java.util.List;

public interface HarvestTxRepository extends JpaRepository<HarvestTxEntity, String> {

    @Query(nativeQuery = true, value =
        "select * from harvest_tx t where t.block_date > :fromTs order by t.block_date")
    List<HarvestTxEntity> fetchAllFromBlockDate(@Param("fromTs") long fromTs);

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
        "    null as lp_stat, " +
        "    null as last_all_usd_tvl, " +
        "    null as owner_balance, " +
        "    owner_balance_usd as owner_balance_usd, " +
        "    all_owners_count as all_owners_count, " +
        "    all_pools_owners_count as all_pools_owners_count " +
        "from harvest_tx where vault = :vault order by block_date")
    List<HarvestTxEntity> fetchAllTvlForVault(@Param("vault") String vault);

    @Query(nativeQuery = true, value = "" +
        "select max(id)                                                              id, " +
        "       null                                                                 hash, " +
        "       null                                                                 block, " +
        "       true                                                                 confirmed, " +
        "       max(block_date)                                                      block_date, " +
        "       null                                                                 method_name, " +
        "       null                                                                 owner, " +
        "       null                                                                 amount, " +
        "       null                                                                 amount_in, " +
        "       vault                                                                vault, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', last_gas)), '_', -1)     last_gas, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', last_tvl)), '_', -1)     last_tvl, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', last_usd_tvl)), '_', -1) last_usd_tvl, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', owner_count)), '_', -1)  owner_count, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', share_price)), '_', -1)  share_price, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', usd_amount)), '_', -1)   usd_amount, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', prices)), '_', -1)       prices, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', lp_stat)), '_', -1)      lp_stat, " +
        "       null      owner_balance, " +
        "       null      owner_balance_usd, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', all_owners_count)), '_', -1) all_owners_count, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', last_all_usd_tvl)), '_', -1)      last_all_usd_tvl, " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', all_pools_owners_count)), '_', -1)      all_pools_owners_count " +
        " " +
        "from harvest_tx " +
        "group by vault")
    List<HarvestTxEntity> fetchLastTvl();
}
