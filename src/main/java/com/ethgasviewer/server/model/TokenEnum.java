package com.ethgasviewer.server.model;

public enum TokenEnum {
    FARM("FARM", 1);

    private String name;
    private int id;

    TokenEnum(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public int getId() {
        return id;
    }
}
