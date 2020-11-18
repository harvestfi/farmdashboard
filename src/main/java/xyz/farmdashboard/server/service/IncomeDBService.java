package xyz.farmdashboard.server.service;

import org.springframework.stereotype.Service;
import xyz.farmdashboard.server.dto.IncomeDTO;
import xyz.farmdashboard.server.entity.IncomeEntity;
import xyz.farmdashboard.server.repositories.IncomeRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeDBService {
    private final IncomeRepository incomeRepository;

    public IncomeDBService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }


    public List<IncomeDTO> fetchIncome() {
        List<IncomeEntity> incomeEntities = incomeRepository.findAllByOrderByTimestamp();
        if (incomeEntities != null) {
            return incomeEntities.stream().map(IncomeDTO::fromEntity).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    public IncomeDTO fetchLastIncome() {
        IncomeEntity entity = incomeRepository.findFirstByOrderByTimestampDesc();
        if (entity != null) {
            return IncomeDTO.fromEntity(entity);
        }
        return null;
    }


}
