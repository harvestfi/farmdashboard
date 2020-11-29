package xyz.farmdashboard.server.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "rewards", indexes = {
    @Index(name = "idx_rewards", columnList = "blockDate")
})
public class RewardEntity {
    @Id
    private String id;
    private String vault;
    private Long block;
    private Long blockDate;
    private Double reward;
    private Long periodFinish;
}
