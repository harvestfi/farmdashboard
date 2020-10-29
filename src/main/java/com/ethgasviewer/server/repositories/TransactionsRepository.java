package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.model.TransactionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.util.List;

public interface TransactionsRepository extends JpaRepository<TransactionDTO, Long> {

    @Query("select t from TransactionDTO t where t.block > :fromBlock ")
    List<TransactionDTO> fetchAllFromBlock(@Param("fromBlock") BigInteger fromBlock);


    TransactionDTO findFirstByOrderByBlockDesc();

}
