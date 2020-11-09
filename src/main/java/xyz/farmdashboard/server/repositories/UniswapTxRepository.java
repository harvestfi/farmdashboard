package xyz.farmdashboard.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.farmdashboard.server.dto.OhlcDTO;
import xyz.farmdashboard.server.entity.UniswapTxEntity;

import java.util.List;

public interface UniswapTxRepository extends JpaRepository<UniswapTxEntity, String> {

    @Query("select t from UniswapTxEntity t where t.blockDate > :fromTs order by t.block asc")
    List<UniswapTxEntity> fetchAllFromBlock(@Param("fromTs") long fromTs);


    UniswapTxEntity findFirstByOrderByBlockDesc();

    @Query(nativeQuery = true, value = "" +
        "select FLOOR(MIN(block_date)/:period)*:period timestamp,  " +
        "       SUBSTRING_INDEX(MIN(CONCAT(block_date, '_', last_price)), '_', -1) open,  " +
        "       max(last_price) high,  " +
        "       min(last_price) low,  " +
        "       SUBSTRING_INDEX(MAX(CONCAT(block_date, '_', last_price)), '_', -1) close,  " +
        "       sum(amount) volume  " +
        "from uni_tx  " +
        "where block_date >= :fromTs " +
        "GROUP BY FLOOR(block_date/:period)  " +
        "order by timestamp;")
    List<OhlcProjection> fetchOHLCTransactionsFromBlock(@Param("fromTs") long fromTs, @Param("period") int period);

    public static interface OhlcProjection {
        long getTimestamp();

        double getOpen();

        double getHigh();

        double getLow();

        double getClose();

        double getVolume();
    }

}
