package com.ethgasviewer.server.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "token", indexes = {
        @Index(name = "idx_token_aquired", columnList = "acquired"),
        @Index(name = "idx_token_name_id", columnList = "nameId")
})
@Cacheable(false)
@Getter
@Setter
@ToString
public class TokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long acquired;

    private int nameId;
    protected double price;
    protected double volume;

}
