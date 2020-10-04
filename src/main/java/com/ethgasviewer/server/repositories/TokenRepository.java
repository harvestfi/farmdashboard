package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.entity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TokenRepository extends JpaRepository<TokenEntity, Long> {

    @Query("select t from TokenEntity t where t.nameId = :nameId and t.acquired > :fromDate")
    List<TokenEntity> getFromDate(@Param("fromDate") long server, @Param("nameId") int nameId);

}
