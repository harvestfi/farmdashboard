package xyz.farmdashboard.server.entity;

import javax.persistence.Column;
import lombok.Data;
import lombok.ToString;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import java.math.BigInteger;

@Entity
@Table(name = "harvest_tx", indexes = {
    @Index(name = "idx_harvest_tx", columnList = "blockDate"),
    @Index(name = "idx_harvest_tx2", columnList = "methodName, vault")
})
@Cacheable(false)
@Data
@ToString
public class HarvestTxEntity {

    @Id
    private String id;
    private String hash;
    private BigInteger block;
    private boolean confirmed = false;
    private Long blockDate;
    private String methodName;
    private String owner;
    private Double amount;
    private Double amountIn;
    private String vault;
    private Double lastGas;
    private Double lastTvl;
    private Double lastUsdTvl;
    private Integer ownerCount;
    private Double sharePrice;
    private Long usdAmount;
    @Column(columnDefinition = "TEXT") //todo create price entity
    private String prices;
    private String lpStat;
    private Double lastAllUsdTvl;
    private Double ownerBalance;
    private Double ownerBalanceUsd;
    private Integer allOwnersCount;
    private Integer allPoolsOwnersCount;
}
