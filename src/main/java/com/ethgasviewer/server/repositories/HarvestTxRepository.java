package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.model.HarvestDTO;
import com.ethgasviewer.server.model.UniswapDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HarvestTxRepository extends JpaRepository<HarvestDTO, String> {

    @Query("select t from HarvestDTO t where t.blockDate > :fromTs order by t.block asc")
    List<HarvestDTO> fetchAllFromBlock(@Param("fromTs") long fromTs);
}
