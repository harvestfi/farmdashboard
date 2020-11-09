package xyz.farmdashboard.server.repositories;

import xyz.farmdashboard.server.entity.HarvestTvlEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface HarvestTvlRepository extends JpaRepository<HarvestTvlEntity, Long> {

    @Query(nativeQuery = true, value = "" +
        "select MAX(agg.id) id,  " +
        "       null calculate_hash,  " +
        "       MAX(agg.calculate_time) calculate_time,  " +
        "       MAX(agg.last_tvl) last_tvl,  " +
        "       MAX(agg.last_owners_count) last_owners_count,  " +
        "       grp  " +
        "from (  " +
        "         select  " +
        "             t.id id,  " +
        "             t.calculate_time calculate_time,  " +
        "             t.last_tvl last_tvl,  " +
        "             t.last_owners_count last_owners_count,  " +
        "             date_format(from_unixtime(t.calculate_time), '%Y-%m-%d %H' ) grp  " +
        "         from harvest_tvl t  " +
        "     ) agg  " +
        "group by agg.grp  " +
        "order by calculate_time")
    List<HarvestTvlEntity> getHistoryOfAllTvl();

}
