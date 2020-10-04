package com.ethgasviewer.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "tg")
@Cacheable(false)
@Getter
@Setter
@ToString
public class TgEntity {

    public TgEntity() {
    }

    public TgEntity(long chat) {
        this.chat = chat;
    }

    @Id
    private long chat;
}
