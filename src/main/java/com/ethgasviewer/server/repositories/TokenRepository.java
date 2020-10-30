package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.entity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TokenRepository extends JpaRepository<TokenEntity, Long> {

//    @Query("select t from TokenEntity t where t.nameId = :nameId and t.acquired > :fromDate")
    @Query(nativeQuery = true, value = "" +
        "select MAX(agg.id) id," +
        " MAX(agg.name_id) name_id," +
        " MAX(agg.acquired) acquired," +
        " MAX(agg.price) price," +
        " MAX(agg.volume) volume" +
        " from ( " +
        "select " +
        "       t.id id, " +
        "       t.name_id name_id, " +
        "       t.acquired acquired, " +
        "       t.price price, " +
        "       t.volume volume, " +
        "       DATE_FORMAT(FROM_UNIXTIME(t.acquired/1000), '%Y-%m-%d-%h') gtime " +
        "from egv.token t " +
        "where t.name_id = :nameId " +
        "      and t.acquired > :fromDate " +
        "    ) agg " +
        "group by agg.gtime")
    List<TokenEntity> getFromDate(@Param("fromDate") long server, @Param("nameId") int nameId);

}
