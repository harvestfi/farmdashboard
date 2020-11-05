package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.model.UniswapDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UniswapTxRepository extends JpaRepository<UniswapDTO, String> {

    @Query("select t from UniswapDTO t where t.blockDate > :fromTs order by t.block asc")
    List<UniswapDTO> fetchAllFromBlock(@Param("fromTs") long fromTs);


    UniswapDTO findFirstByOrderByBlockDesc();

}
