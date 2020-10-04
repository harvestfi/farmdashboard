package com.ethgasviewer.server.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gas", indexes = {
        @Index(name = "idx_gas", columnList = "acquired")
})
@Cacheable(false)
@Getter
@Setter
@ToString
public class GasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long acquired;

    private long fastest;
    private long fast;
    private long average;
    private long safeLow;
    private long blockTime;
    private long blockNum;
    private long speed;

}
