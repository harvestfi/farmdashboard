package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.entity.GasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GasRepository extends JpaRepository<GasEntity, Long> {

    @Query("select g from GasEntity g where g.acquired > :fromDate")
    List<GasEntity> getFromDate(@Param("fromDate") long server);

}
