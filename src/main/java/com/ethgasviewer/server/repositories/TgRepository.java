package com.ethgasviewer.server.repositories;

import com.ethgasviewer.server.entity.TgEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TgRepository extends JpaRepository<TgEntity, Long> {
}
