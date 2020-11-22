package xyz.farmdashboard.server.entity;

import lombok.Data;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import java.math.BigInteger;

@Entity
@Table(name = "uni_tx", indexes = {
    @Index(name = "idx_uni_tx", columnList = "blockDate")
})
@Cacheable(false)
@Data
public class UniswapTxEntity { //TODO get from ethparser
    @Id
    private String id;
    private String type;
    private String coin;
    private String owner;
    private double amount;
    private String otherCoin;
    private double otherAmount;
    private Double ethAmount;
    private String hash;
    private BigInteger block;
    private boolean confirmed = false;
    private Double lastPrice;
    private Double lastGas;
    private Long blockDate;
    private Integer ownerCount;
    private Double psWeekApy;
    private Double psIncomeUsd;
}
