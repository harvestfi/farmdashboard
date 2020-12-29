package xyz.farmdashboard.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.farmdashboard.server.entity.UniswapTxEntity;

import java.util.List;

public interface UniswapTxRepository extends JpaRepository<UniswapTxEntity, String> {

    @Query(nativeQuery = true, value =
        "select * from uni_tx t where t.coin = 'FARM' and t.block_date > :fromTs order by t.block_date")
    List<UniswapTxEntity> fetchAllFromBlockDate(@Param("fromTs") long fromTs);

    @Query(nativeQuery = true, value =
        "select * from uni_tx t where "
            + "t.coin = 'FARM' "
            + "and t.block_date > :from "
            + "and t.block_date <= :to "
            + "order by t.block_date")
    List<UniswapTxEntity> fetchAllByPeriod(@Param("from") long from, @Param("to") long to);

    @Query(nativeQuery = true, value = "" +
        "select FLOOR(MIN(block_date)/:period)*:period timestamp,  " +
        "       SUBSTRING_INDEX(MIN(CONCAT(block_date, '_', last_price)), '_', -1) open,  " +
        "       max(last_price) high,  " +
        "       min(last_price) low,  " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', last_price)), '_', -1) close,  " +
        "       sum(amount) volume  " +
        "from uni_tx  " +
        "where coin = :coin and block_date >= :fromTs " +
        "GROUP BY FLOOR(block_date/:period)  " +
        "order by timestamp;")
    List<OhlcProjection> fetchOHLCTransactionsFromBlock(
        @Param("coin") String coin,
        @Param("fromTs") long fromTs,
        @Param("period") int period);

    public static interface OhlcProjection {
        long getTimestamp();

        double getOpen();

        double getHigh();

        double getLow();

        double getClose();

        double getVolume();
    }

}
