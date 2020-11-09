package xyz.farmdashboard.server.entity;

import lombok.Data;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "harvest_tvl", indexes = {
    @Index(name = "idx_harvest_tvl", columnList = "calculateTime")
})
@Cacheable(false)
public class HarvestTvlEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private Long calculateTime;
    private Double lastTvl;
    private int lastOwnersCount;
    private String calculateHash;
}
