package xyz.farmdashboard.server.service;

import org.springframework.stereotype.Service;
import xyz.farmdashboard.server.entity.HardWorkEntity;
import xyz.farmdashboard.server.repositories.HardWorkRepository;

import java.util.List;

@Service
public class HardWorkDBService {

    private final HardWorkRepository hardWorkRepository;

    public HardWorkDBService(HardWorkRepository hardWorkRepository) {
        this.hardWorkRepository = hardWorkRepository;
    }

    public List<HardWorkEntity> getLastHardWorks() {
        return hardWorkRepository.fetchLatest();
    }

    public List<HardWorkEntity> getHistoryHardWorks() {
        return hardWorkRepository.findAllByOrderByBlockDate();
    }
}
