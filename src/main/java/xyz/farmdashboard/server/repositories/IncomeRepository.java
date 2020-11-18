package xyz.farmdashboard.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.farmdashboard.server.dto.IncomeDTO;
import xyz.farmdashboard.server.entity.IncomeEntity;

import java.util.List;

public interface IncomeRepository extends JpaRepository<IncomeEntity, String> {

    List<IncomeEntity> findAllByOrderByTimestamp();

    IncomeEntity findFirstByOrderByTimestampDesc();

}
