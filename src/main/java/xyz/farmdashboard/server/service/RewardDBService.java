package xyz.farmdashboard.server.service;

import org.springframework.stereotype.Service;
import xyz.farmdashboard.server.entity.RewardEntity;
import xyz.farmdashboard.server.repositories.RewardRepository;

import java.util.List;

@Service
public class RewardDBService {

    private final RewardRepository rewardRepository;

    public RewardDBService(RewardRepository rewardRepository) {
        this.rewardRepository = rewardRepository;
    }

    public List<RewardEntity> getAllLastRewards() {
        return rewardRepository.fetchLastRewards();
    }

    public List<RewardEntity> getAllRewards(String name) {
        return rewardRepository.getAllByVaultOrderByBlockDate(name);
    }
}
